'use client'

import { useEffect, useMemo, useRef } from "react"
import type { UIMessage } from "ai"

import { ChatBubble } from "./chat-bubble"
import { TypingIndicator } from "./typing-indicator"

interface Source {
    section: string
    title: string
}

interface ChatMessagesProps {
    messages: UIMessage[]
    isLoading: boolean
    sources: Map<string, Source[]>
}

const SCROLL_THRESHOLD_PX = 140

function isNearBottom(container: HTMLElement | null) {
    if (!container) return true
    return (
        container.scrollHeight -
        container.scrollTop -
        container.clientHeight
    ) < SCROLL_THRESHOLD_PX
}

export default function ChatMessages({
    messages,
    isLoading,
    sources
}: ChatMessagesProps) {
    const bottomRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const lastAssistantMessageId = useMemo(() => {
        for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].role === "assistant") {
                return messages[i].id
            }
        }
        return null
    }, [messages])

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        if (isNearBottom(container)) {
            bottomRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "end"
            })
        }
    }, [messages])

    return (
        <div
            ref={containerRef}
            className="flex-1 overflow-y-auto py-6 space-y-4"
        >
            {messages.map((message) => {
                const content =
                    message.parts
                        ?.filter(
                            (p): p is Extract<typeof p, { type: "text" }> =>
                                p.type === "text"
                        )
                        .map((p) => p.text)
                        .join(" ") ?? ""

                const messageSources = sources.get(message.id) ?? []

                return (
                    <ChatBubble
                        key={message.id}
                        role={message.role as "user" | "assistant"}
                        content={content}
                        sources={messageSources}
                        isStreaming={
                            isLoading &&
                            message.role === "assistant" &&
                            message.id === lastAssistantMessageId
                        }
                    />
                )
            })}

            {isLoading &&
                messages[messages.length - 1]?.role === "user" && (
                    <div className="flex justify-start">
                        <div className="bg-text-primary/4 border border-text-primary/6 rounded-[16px_16px_16px_4px]">
                            <TypingIndicator />
                        </div>
                    </div>
                )
            }

            <div ref={bottomRef} />
        </div>
    )
}