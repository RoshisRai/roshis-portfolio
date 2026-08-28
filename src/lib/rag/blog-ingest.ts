/**
 * Blog post ingestion for the RAG knowledge base.
 *
 * Aligns with the markdown KB pipeline (content_hash + upsert) but scopes
 * cleanup per post via section = `blog/{slug}` so re-ingesting one post
 * never touches other posts or the static knowledge-base chunks.
 *
 * Unchanged chunks are skipped (no re-embedding); removed/changed chunks
 * are deleted by stale content_hash.
 */
import { createHash } from "crypto";
import { toPlainText } from "@portabletext/toolkit";
import type { PortableTextBlock } from "@portabletext/types";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sanityFetch } from "@/lib/sanity/client";
import type {
  CustomBlock,
  SanityCalloutBlock,
  SanityCodeBlock,
} from "@/types/blog";
import { generateEmbeddings } from "./embeddings";

interface BlogChunk {
  section: string;
  title: string;
  content: string;
}

interface RagPost {
  _id: string;
  title: string;
  slug: string | null;
  category: string | null;
  tags: (string | null)[] | null;
  body: CustomBlock[] | null;
  publishedAt: string;
}

const RAG_POST_PROJECTION = `
  _id,
  title,
  "slug": slug.current,
  "category": category->title,
  "tags": tags[]->title,
  body,
  publishedAt
`;

function blogSection(slug: string): string {
  return `blog/${slug}`;
}

function hashChunk(section: string, title: string, content: string): string {
  return createHash("sha256")
    .update(`${section}::${title}::${content}`)
    .digest("hex");
}

function isPortableTextBlock(
  block: CustomBlock,
): block is PortableTextBlock {
  return block._type === "block";
}

function chunkPortableTextByHeading(post: RagPost): BlogChunk[] {
  const slug = post.slug;
  if (!slug) return [];

  const section = blogSection(slug);
  const postTitle = post.title;
  const category = post.category ?? "Uncategorized";
  const tags = (post.tags ?? []).filter((t): t is string => Boolean(t));
  const blocks = post.body ?? [];

  const chunks: BlogChunk[] = [];
  let currentHeading = postTitle;
  let currentContent = "";

  const flush = () => {
    if (!currentContent.trim()) return;

    const metaPrefix =
      tags.length > 0
        ? `Category: ${category}. Tags: ${tags.join(", ")}.`
        : `Category: ${category}.`;

    chunks.push({
      section,
      title: `${postTitle} → ${currentHeading}`,
      content: `${metaPrefix}\n\n${currentContent.trim()}`,
    });
  };

  for (const block of blocks) {
    if (
      isPortableTextBlock(block) &&
      (block.style === "h2" || block.style === "h3")
    ) {
      flush();
      currentHeading = toPlainText([block]);
      currentContent = "";
    } else if (isPortableTextBlock(block)) {
      currentContent += toPlainText([block]) + "\n";
    } else if (block._type === "codeBlock") {
      const code = (block as SanityCodeBlock).code;
      if (code) {
        currentContent += `[Code example]\n${code}\n`;
      }
    } else if (block._type === "callout") {
      const callout = block as SanityCalloutBlock;
      if (callout.content) {
        currentContent += `[${callout.type.toUpperCase()}] ${callout.content}\n`;
      }
    }
  }

  flush();
  return chunks;
}

/**
 * Diff-aware upsert for one post:
 * - new/changed chunks → embed + upsert
 * - unchanged hashes → skip (no OpenAI cost)
 * - removed hashes → delete
 */
async function upsertBlogPostChunks(
  post: RagPost,
  batchSize = 20,
): Promise<number> {
  if (!post.slug) return 0;

  const supabase = createServerSupabaseClient();
  const section = blogSection(post.slug);
  const chunks = chunkPortableTextByHeading(post);

  const prepared = chunks.map((chunk) => ({
    ...chunk,
    content_hash: hashChunk(chunk.section, chunk.title, chunk.content),
  }));
  const newHashSet = new Set(prepared.map((c) => c.content_hash));

  const { data: existing, error: fetchError } = await supabase
    .from("knowledge_chunks")
    .select("content_hash")
    .eq("section", section);

  if (fetchError) {
    console.error(
      `Failed to fetch existing hashes for ${section}:`,
      fetchError.message,
    );
  }

  const existingHashes = new Set(
    (existing ?? []).map((row) => row.content_hash as string),
  );

  const staleHashes = [...existingHashes].filter((h) => !newHashSet.has(h));
  if (staleHashes.length > 0) {
    const { error: deleteError } = await supabase
      .from("knowledge_chunks")
      .delete()
      .eq("section", section)
      .in("content_hash", staleHashes);

    if (deleteError) {
      console.error(
        `Failed to delete stale chunks for ${section}:`,
        deleteError.message,
      );
    }
  }

  // Empty / image-only body: clear section and stop
  if (prepared.length === 0) {
    return 0;
  }

  const toInsert = prepared.filter((c) => !existingHashes.has(c.content_hash));
  let inserted = 0;

  for (let i = 0; i < toInsert.length; i += batchSize) {
    const batch = toInsert.slice(i, i + batchSize);
    const texts = batch.map((c) => `${c.title}\n\n${c.content}`);
    const embeddings = await generateEmbeddings(texts);

    const rows = batch.map((chunk, idx) => {
      const embedding = embeddings[idx];
      if (!embedding || embedding.length === 0) {
        throw new Error(
          `Missing embedding for blog chunk ${idx} in ${section}`,
        );
      }

      return {
        section: chunk.section,
        title: chunk.title,
        content: chunk.content,
        embedding,
        content_hash: chunk.content_hash,
      };
    });

    const { error } = await supabase.from("knowledge_chunks").upsert(rows, {
      onConflict: "content_hash",
      ignoreDuplicates: false,
    });

    if (error) {
      console.error(`Blog upsert error (${section}):`, error.message);
    } else {
      inserted += batch.length;
    }
  }

  return inserted;
}

function publishedDocumentId(id: string): string {
  return id.replace(/^drafts\./, "");
}

export async function deleteBlogPostChunks(slug: string): Promise<{
  deleted: number;
  error?: string;
}> {
  const supabase = createServerSupabaseClient();
  const section = blogSection(slug);

  const { data, error } = await supabase
    .from("knowledge_chunks")
    .delete()
    .eq("section", section)
    .select("id");

  if (error) {
    console.error(`Failed to delete chunks for ${section}:`, error.message);
    return { deleted: 0, error: error.message };
  }

  return { deleted: data?.length ?? 0 };
}

export async function ingestBlogPost(postId: string): Promise<{
  chunksInserted: number;
  slug?: string;
  error?: string;
}> {
  const publishedId = publishedDocumentId(postId);
  const query = `*[_type == "post" && _id == $postId && ragEnabled == true && defined(publishedAt)][0] {
    ${RAG_POST_PROJECTION}
  }`;

  const post = await sanityFetch<RagPost | null>(query, { postId: publishedId });

  if (!post) {
    return { chunksInserted: 0, error: "Post not found or RAG disabled" };
  }

  if (!post.slug) {
    return { chunksInserted: 0, error: "Post is missing a slug" };
  }

  const chunksInserted = await upsertBlogPostChunks(post);
  return { chunksInserted, slug: post.slug };
}

export async function ingestAllBlogPosts(): Promise<{
  totalChunks: number;
  postsProcessed: number;
}> {
  const query = `*[_type == "post" && ragEnabled == true && defined(publishedAt)] {
    ${RAG_POST_PROJECTION}
  }`;

  const posts = await sanityFetch<RagPost[]>(query);

  let totalChunks = 0;

  for (const post of posts) {
    if (!post.slug) continue;
    totalChunks += await upsertBlogPostChunks(post);
  }

  return { totalChunks, postsProcessed: posts.length };
}
