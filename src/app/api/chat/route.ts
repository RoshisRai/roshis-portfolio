import { openai } from "@ai-sdk/openai"
import { streamText, convertToModelMessages, type UIMessage } from "ai"
import { headers } from "next/headers"

import { retrieveRelevantChunks } from "@/lib/rag/retrieval"
import { chatRatelimit } from "@/lib/ratelimit"
import { SYSTEM_PROMPT } from "@/lib/rag/system-prompt"

export const maxDuration = 30

export async function POST(req: Request) {
    try {
        const headersList = await headers()

        const forwarded = headersList.get("x-forwarded-for")
        const ip =
            forwarded?.split(",")[0]?.trim() ??
            headersList.get("x-real-ip") ??
            "anonymous"

        const { success, remaining } = await chatRatelimit.limit(ip)

        if (!success) {
            return new Response(
                JSON.stringify({
                    error: "rate_limited",
                    message:
                        "Too many requests. Please try again later or contact Roshis directly"
                }),
                {
                status: 429,
                headers: { "Content-Type": "application/json" }
                }
            )
        }

        const body = await req.json().catch(() => null)
        if (!body || !Array.isArray(body.messages)) {
            return new Response("Invalid request format", { status: 400 })
        }

        const messages: UIMessage[] = body.messages
        const lastUserMessage = messages
            .filter(m => m.role === "user")
            .pop()
        if (!lastUserMessage) {
            return new Response("No user message found", { status: 400 })
        }

        const userQuery = 
            lastUserMessage.parts?.find(p => p.type === "text")?.text ??
            ("content" in lastUserMessage && typeof lastUserMessage.content === "string"
                ? lastUserMessage.content
                : ""
            )
        const normalizedQuery = userQuery.trim()
        if (!normalizedQuery) {
            return new Response("Empty query", { status: 400 })
        }
        
        const chunks = await retrieveRelevantChunks(normalizedQuery, {
            matchCount: 5,
            semanticWeight: 1.2,
            fullTextWeight: 1.0
        })
        const trimmedChunks = chunks.slice(0, 5)

        const context = trimmedChunks
            .map(
                (c, i) =>
                    `[${i + 1}] (${c.section} → ${c.title})\n${c.content}`
            )
            .join("\n\n---\n\n")

        const sources = trimmedChunks
            .map(
                (c, i) => 
                    `[${i + 1}] ${c.section} | ${c.title}`
            )
            .join("\n")

        const systemPrompt = SYSTEM_PROMPT
            .replace("{context}", context || "No relevant context found")
            .replace("{sources}", sources || "No sources available")

        const result = streamText({
            model: openai(process.env.OPENAI_MODEL ?? "gpt-4o-mini"),
            system: systemPrompt,
            messages: await convertToModelMessages(messages),
            temperature: 0.3,
            maxOutputTokens: 500
        })

         const response = result.toUIMessageStreamResponse()

         response.headers.set(
            "X-Sources",
            JSON.stringify(
                trimmedChunks.map(c => ({
                    section: c.section,
                    title: c.title
                }))
            )
        )

        response.headers.set(
            "X-Remaining-Messages",
            String(remaining)
        )

        return response
    } catch (error) {
        console.error("Chat route error:", error)

        return new Response(
            JSON.stringify({
                error: "internal_error",
                message: "Something went wrong. Please try again later"
            }),
            { status: 500 }
        )
    }
}