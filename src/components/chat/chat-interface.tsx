'use client'

import { useState, useCallback, useMemo } from "react"
import { useChat } from "@ai-sdk/react"
import { Bot } from "lucide-react"
import { DefaultChatTransport } from "ai"

import ChatMessages from "./chat-messages"
import { ChatInput } from "./chat-input"
import { SuggestedPrompts } from "./suggested-prompts"
import { CursorZone } from "../global/cursor/cursor-zone"

interface Source {
    section: string
    title: string
}

const PENDING_SOURCES_KEY = "__pending__"

function createTransport(
    onRateLimited: (limited: boolean) => void,
    onSourcesParsed: (sources: Source[]) => void,
    onHttpError: (status: number) => void
) {
    return new DefaultChatTransport({
        api: "/api/chat",
        fetch: async (url, options) => {
            const response = await fetch(url, options as RequestInit)

            // rate limit handling
            if (response.status === 429) {
                onRateLimited(true)
                onHttpError(429)
                return new Response(new ReadableStream({
                    start(controller) {
                        controller.close()
                    }
                }), { 
                    status: 200,
                    headers: { "Content-Type": "text/event-stream" }
                })
            }

            onRateLimited(false)

            // non-success errors (500, 400, etc.)
            if (!response.ok) {
                onHttpError(response.status)
            }

            const sourcesHeader = response.headers.get("X-Sources")

            if (sourcesHeader) {
                try {
                    const sources: Source[] = JSON.parse(sourcesHeader)
                    onSourcesParsed(sources)
                } catch (err) {
                    console.error("Failed to parse source metadata: ", err)
                }
            }

            return response
        }
    })
}

export default function ChatInterface() {
    const [input, setInput] = useState("")
    const [rateLimited, setRateLimited] = useState(false)
    const [httpStatus, setHttpStatus] = useState<number | null>(null)

    const [sourcesMap, setSourcesMap] = useState<Map<string, Source[]>>(
        new Map()
    )

    const handleRateLimited = useCallback((limited: boolean) => {
        setRateLimited(limited)
    }, [])

    const handleHttpError = useCallback((status: number) => {
        setHttpStatus(status)
    }, [])

    const handleSourcesParsed = useCallback((sources: Source[]) => {
        setSourcesMap(prev => {
            const next = new Map(prev)
            next.set(PENDING_SOURCES_KEY, sources)
            return next
        })
    }, [])

    const transport = useMemo(
        () => createTransport(handleRateLimited, handleSourcesParsed, handleHttpError),
        [handleRateLimited, handleSourcesParsed, handleHttpError]
    )

    const {
        messages,
        sendMessage,
        status,
        error,
    } = useChat({
        transport,
        onFinish({ message }) {
            setSourcesMap(prev => {
                const next = new Map(prev)
                const pending = next.get(PENDING_SOURCES_KEY)

                if (pending) {
                    next.set(message.id, pending)
                    next.delete(PENDING_SOURCES_KEY)
                }

                return next
            })
        },
        onError(err) {
            console.error("Chat error: ", err)

            setSourcesMap(prev => {
                const next = new Map(prev)
                next.delete(PENDING_SOURCES_KEY)
                return next
            })
        }
    })

    const isLoading =
        status === "submitted" || status === "streaming"

    const hasMessages = messages.length > 0

    const handleSubmit = useCallback(() => {
        const trimmed = input.trim()

        if (!trimmed || isLoading || rateLimited) return

        setInput("")
        sendMessage({ text: trimmed })
    }, [input, isLoading, rateLimited, sendMessage])

    const handlePromptSelect = useCallback(
        (prompt: string) => {
            if (isLoading || rateLimited) return
            sendMessage({ text: prompt })
        },
        [sendMessage, isLoading, rateLimited]
    )

    return (
        <div className="flex flex-col min-h-[calc(100dvh-64px)] mt-16 max-w-180 mx-auto px-4 md:px-0">

            {!hasMessages && (
                <div className="flex-1 flex flex-col">
                    <div className="flex flex-col mt-25">
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20">
                                <Bot size={24} className="text-accent" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-text-primary mb-1">
                                    Hi! I&rsquo;m Roshis&rsquo; AI assistant.
                                </h1>
                                <p className="text-[15px] text-text-primary/80 max-w-102">
                                    Ask me anything about his work, experience, projects, or technical skills.
                                </p>
                            </div>
                        </div>

                        <SuggestedPrompts onSelect={handlePromptSelect} />
                    </div>
                </div>
            )}

            {hasMessages && (
                <ChatMessages
                    messages={messages}
                    isLoading={isLoading}
                    sources={sourcesMap}
                    rateLimited={rateLimited}
                />
            )}

            {error && httpStatus !== 429 && (
                <CursorZone variant="icon" className="contents" label="🛑">
                    <div
                        role="alert"
                        aria-live="polite"
                        className="mx-4 mb-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-center"
                    >
                        <p className="text-sm text-red-300">
                            Something went wrong. Please try again.
                        </p>

                        {httpStatus && (
                            <p className="text-xs text-red-400 mt-1">
                                Error code: {httpStatus}
                            </p>
                        )}
                    </div>
                </CursorZone>
            )}

            <ChatInput
                input={input}
                setInput={setInput}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                disabled={rateLimited}
            />
        </div>
    )
}