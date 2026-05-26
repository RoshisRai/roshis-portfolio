import { embed, embedMany } from "ai";
import { openai } from "@ai-sdk/openai";

const EMBEDDING_MODEL = openai.embedding("text-embedding-3-small")

export async function generateEmbedding(text: string): Promise<number[]> {
    const { embedding } = await embed({
        model: EMBEDDING_MODEL,
        value: text.replace(/\n/g, " ").trim(),
    })
    return embedding
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
    const { embeddings } = await embedMany({
        model: EMBEDDING_MODEL,
        values: texts.map((t) => t.replace(/\n/g, " ").trim()),
    })
    return embeddings
}