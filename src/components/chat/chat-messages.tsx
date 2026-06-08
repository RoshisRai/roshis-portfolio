'use client'

import { useEffect, useMemo, useRef } from "react"
import type { UIMessage } from "ai"

import { ChatBubble } from "./chat-bubble"
import { TypingIndicator } from "./typing-indicator"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { CursorZone } from "../global/cursor/cursor-zone"

interface Source {
    section: string
    title: string
}

interface ChatMessagesProps {
    messages: UIMessage[]
    isLoading: boolean
    sources: Map<string, Source[]>
    rateLimited?: boolean
}

const SCROLL_THRESHOLD_PX = 140

function isNearBottom(container: HTMLElement) {
    return (
        container.scrollHeight -
        container.scrollTop -
        container.clientHeight
    ) < SCROLL_THRESHOLD_PX
}

function scrollToBottom(target: HTMLElement, smooth: boolean) {
    target.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
        block: "end"
    })
}

export default function ChatMessages({
    messages,
    isLoading,
    sources,
    rateLimited
}: ChatMessagesProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const innerRef = useRef<HTMLDivElement>(null)
    const bottomRef = useRef<HTMLDivElement>(null)
    const userScrolledUp = useRef(false)

    const lastAssistantMessageId = useMemo(() => {
        for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].role === "assistant") {
                return messages[i].id
            }
        }
        return null
    }, [messages])

    // Reset scroll lock + snap to bottom when user sends a new message
    useEffect(() => {
        if (messages[messages.length - 1]?.role === "user") {
            userScrolledUp.current = false
            const bottom = bottomRef.current
            if (bottom) scrollToBottom(bottom, true)
        }
    }, [messages])

    // Track manual scroll up
    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const handleScroll = () => {
            userScrolledUp.current = !isNearBottom(container)
        }

        container.addEventListener("scroll", handleScroll, { passive: true })
        return () => container.removeEventListener("scroll", handleScroll)
    }, [])

    // ResizeObserver watches content growth during streaming.
    useEffect(() => {
        const inner = innerRef.current
        const bottom = bottomRef.current
        if (!inner || !bottom) return

        const observer = new ResizeObserver(() => {
            if (userScrolledUp.current) return
            scrollToBottom(bottom, !isLoading)
        })

        observer.observe(inner)
        return () => observer.disconnect()
    }, [isLoading])

    return (
        <div
            ref={containerRef}
            className="flex-1 overflow-y-auto py-6"
        >
            <div ref={innerRef} className="space-y-4">
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

                {rateLimited && (
                    <CursorZone variant="icon" label="✉️" className="contents">
                        <a 
                            href="mailto:contact@roshis.dev"
                            className="inline-block w-full p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center"
                        >
                            <p className="text-xs text-amber-300">
                                I&rsquo;ve had a lot of conversations today — email Roshis directly at{" "}
                            </p>
                            <span
                                className="underline underline-offset-2"
                            >
                                contact@roshis.dev
                            </span>
                        </a>
                    </CursorZone>
                )}
            </div>
            <div ref={bottomRef} className="relative h-25">
                <div className={cn(
                    "absolute top-10 left-0",
                    isLoading && "animate-pulse-soft",
                )}>
                    <CursorZone variant="tooltip" label="Roshis AI Assistant" className="contents">
                        <div className="flex items-center transition-opacity duration-(--duration-fast) hover:opacity-90 rounded-md overflow-hidden">
                            <Image
                                src="/images/logo.svg"
                                alt="Roshis Rai"
                                width={32}
                                height={32}
                                style={{ width: 32, height: 32 }}
                                priority 
                            />
                        </div>
                    </CursorZone>
                </div>
            </div>
        </div>
    )
}