import { createServerSupabaseClient } from "../supabase/server";
import { generateEmbedding } from "./embeddings";

export interface RetrievedChunk {
    readonly id: number | string
    readonly section: string
    readonly title: string
    readonly content: string
    readonly similarity: number
}

/**
 * Hybrid retrieval: vector similarity + full-text keyword search
 * Combined via Reciprocal Rank Fusion (RRF) in Postgres.
 */
export async function retrieveRelevantChunks(
    query: string,
    options: {
        matchCount?: number;
        fullTextWeight?: number;
        semanticWeight?: number;
    } = {}
): Promise<RetrievedChunk[]> {
    const {
        matchCount = 5,
        fullTextWeight = 1.0,
        semanticWeight = 1.2, // Slightly favor semantic for natural language queries
    } = options

    const normalizedQuery = query.trim()

    if (!normalizedQuery) {
        return []
    }

    const supabase = createServerSupabaseClient()

    // Generate embedding for the user's query
    const queryEmbedding = await generateEmbedding(normalizedQuery)

    // Call hybrid_search RPC function
    const { data, error } = await supabase.rpc("hybrid_search", {
        query_text: normalizedQuery,
        query_embedding: queryEmbedding,
        match_count: matchCount,
        full_text_weight: fullTextWeight,
        semantic_weight: semanticWeight,
    })

    if (error) {
        console.error("Hybrid search error: ", error)

        throw new Error(
            `Hybrid retrieval failed: ${error.message}`
        )
    }

    return (data ?? []) as RetrievedChunk[]
}