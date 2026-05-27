/**
 * Core ingestion logic — reads markdown files, chunks them,
 * generates embeddings, and upserts into Supabase.
 * Called by scripts/ingest-knowledge-base.ts
 */
import { readFileSync, readdirSync } from 'fs'
import { createHash } from 'crypto'
import { join } from 'path'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { chunkMarkdown } from '@/lib/rag/chunker'
import { generateEmbeddings } from '@/lib/rag/embeddings'

const KB_DIR = join(process.cwd(), "content/knowledge-base")

export function loadMarkdownFiles(): { section: string; content: string }[] {
    const files = readdirSync(KB_DIR).filter(file => file.endsWith(".md"))

    return files.map(file => ({
        section: file.replace(".md", ""),
        content: readFileSync(join(KB_DIR, file), "utf-8")
    }))
}

/**
 * Stable hash for deduplication + upsert tracking.
 * If content changes, hash changes.
 */
function hashChunk(
    section: string,
    title: string,
    content: string
): string {
    return createHash("sha256")
        .update(`${section}::${title}::${content}`)
        .digest("hex")
}

export async function ingestFile(
    section: string,
    markdown: string,
    batchSize = 20
): Promise<{inserted: number; hashes: string[] }> {
    const supabase = createServerSupabaseClient()

    const chunks = chunkMarkdown(markdown, section)

    console.log(`📄 ${section}.md: ${chunks.length} chunks`);

    let inserted = 0
    const hashes: string[] = []

    for (let i = 0; i < chunks.length; i += batchSize) {
        const batch = chunks.slice(i, i + batchSize)
        // Prepend title for richer embedding context
        const texts = batch.map(
            chunk => `${chunk.title}\n\n${chunk.content}`
        )

        const embeddings = await generateEmbeddings(texts)

        const rows = batch.map((chunk, idx) => {
            const embedding = embeddings[idx]

            if (!embedding || embedding.length === 0) {
                throw new Error(
                    `Missing embedding for chunk ${idx} in ${section}.md`
                )
            }

            const contentHash = hashChunk(
                chunk.section,
                chunk.title,
                chunk.content
            )
            hashes.push(contentHash)

            return {
                section: chunk.section,
                title: chunk.title,
                content: chunk.content,
                embedding,
                content_hash: contentHash,
            }
        })

        const { error } = await supabase
            .from("knowledge_chunks")
            .upsert(rows, {
                onConflict: "content_hash",
                ignoreDuplicates: false,
            })

        if (error) {
            console.error(`  ❌ Batch upsert error:`, error.message);
        } else {
            inserted += batch.length

            console.log(
                `  ✓ Upserted batch ${Math.floor(i / batchSize) + 1}`
            )
        }
    }

    return {
        inserted,
        hashes
    }
}