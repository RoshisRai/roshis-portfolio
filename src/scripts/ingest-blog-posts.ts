/**
 * Run with:
 * pnpm ingest:blog
 *
 * Fetches all RAG-enabled published posts from Sanity,
 * chunks them, and upserts embeddings into knowledge_chunks.
 * Safe to re-run: unchanged chunks are skipped; stale hashes
 * are deleted per post (section = blog/{slug}).
 *
 * loadEnvConfig must run before blog-ingest is imported: env.ts
 */
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function main() {
  const { ingestAllBlogPosts } = await import("@/lib/rag/blog-ingest");

  console.log("🔄 Ingesting RAG-enabled blog posts from Sanity...\n");

  const { totalChunks, postsProcessed } = await ingestAllBlogPosts();

  console.log(
    `\n✅ Done! Upserted ${totalChunks} chunks from ${postsProcessed} posts.`,
  );
}

main().catch((error) => {
  console.error("❌ Fatal blog ingest error:", error);
  process.exit(1);
});
