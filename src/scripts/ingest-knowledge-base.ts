/**
 * Run with:
 * pnpm dlx tsx scripts/ingest-knowledge-base.ts
 *
 * Reads all markdown files in content/knowledge-base/,
 * chunks them, generates embeddings,
 * upserts into Supabase,
 * and removes stale chunks.
 */

import "dotenv/config"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { ingestFile, loadMarkdownFiles } from "@/lib/rag/ingest"

async function main() {
    console.log("🔄 Starting knowledge base ingestion...\n")
    const supabase = createServerSupabaseClient()

    const files = loadMarkdownFiles()

    let totalChunks = 0
    const activeHashes: string[] = []

    for (const { section, content } of files) {
        const { inserted, hashes } = await ingestFile(
            section,
            content
        )
        totalChunks += inserted
        activeHashes.push(...hashes)
    }

    /**
     * Remove stale chunks that no longer exist
     * in the current markdown source files.
     */
    if (activeHashes.length === 0) {
        console.warn(
            "⚠️ No active hashes generated. Skipping cleanup."
        )
    } else {
        const { error } = await supabase.rpc(
            "delete_stale_chunks",
            {
                active_hashes: activeHashes,
            }
        )

        if (error) {
            console.error(
                "❌ Cleanup error:",
                error.message
            )
        } else {
            console.log("🧹 Removed stale chunks")
        }
    }

    console.log(
        `\n✅ Done! Upserted ${totalChunks} chunks total.`
    )
}

main().catch(error => {
    console.log("❌ Fatal ingestion error:", error)
    process.exit(1)
})