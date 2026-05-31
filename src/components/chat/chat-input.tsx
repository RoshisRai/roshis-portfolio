'use client'

import { cn } from "@/lib/utils";
import { ArrowUp } from "lucide-react";
import { useRef, useEffect } from "react";
import { CursorZone } from "../global/cursor/cursor-zone";

interface ChatInputProps {
    input: string;
    setInput: (value: string) => void;
    onSubmit: () => void;
    isLoading: boolean;
    disabled?: boolean;
}

const MIN_HEIGHT = 48 
const MAX_HEIGHT = 200 

export const ChatInput = ({
    input,
    setInput,
    onSubmit,
    isLoading,
    disabled
}: ChatInputProps) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const formRef = useRef<HTMLFormElement>(null)

    useEffect(() => {
        const el = textareaRef.current
        if (!el) return

        el.style.height = `${MIN_HEIGHT}px`
        const scrollHeight = el.scrollHeight
        const newHeight = Math.min(scrollHeight, MAX_HEIGHT)
        el.style.height = `${newHeight}px`
        el.style.overflowY = scrollHeight > MAX_HEIGHT ? "auto" : "hidden"
    }, [input])

    const keyDownHandler = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            if (input.trim() && !isLoading && !disabled) {
                formRef.current?.requestSubmit()
            }
        }
    }

    return (
        <div className="sticky bottom-0 bg-linear-to-t from-background via-background to-transparent pt-6 pb-4">
            <form
                ref={formRef}
                onSubmit={(e) => {
                    e.preventDefault()
                    onSubmit()
                }}
                className="relative max-w-180 mx-auto"
            >
                <div className="flex items-end gap-2">
                    <CursorZone variant="text" className="contents">
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything about Roshis..."
                            disabled={disabled}
                            onKeyDown={keyDownHandler}
                            rows={1}
                            style={{ minHeight: MIN_HEIGHT }}
                            onWheel={(e) => {
                                const el = textareaRef.current;
                                if (!el) return;
                                
                                const isScrollable = el.scrollHeight > MAX_HEIGHT;
                                if (isScrollable) {
                                    e.stopPropagation();
                                    
                                    el.scrollTop += e.deltaY;
                                }
                            }}
                            className={cn(
                                "flex-1 w-full px-4 py-3 rounded-xl text-base bg-input-bg-focus/80",
                                "border border-text-primary/8 text-text-primary placeholder:text-text-secondary",
                                "outline-none transition-colors duration-(--duration-fast)",
                                "focus:border-accent/50 focus:bg-input-bg-focus",
                                "resize-none leading-6 scroll-py-3",
                                "[&::-webkit-scrollbar]:w-3",
                                "[&::-webkit-scrollbar-track]:bg-transparent",
                                "[&::-webkit-scrollbar-thumb]:bg-text-primary/20",
                                "[&::-webkit-scrollbar-thumb]:rounded-full",
                                "[&::-webkit-scrollbar-thumb]:border-3",
                                "[&::-webkit-scrollbar-thumb]:border-solid",
                                "[&::-webkit-scrollbar-thumb]:border-transparent",
                                "[&::-webkit-scrollbar-thumb]:bg-clip-padding"
                            )}
                        />
                    </CursorZone>
                    <CursorZone variant="button" className="contents">
                        <button
                            type="submit"
                            disabled={!input.trim() || disabled || isLoading}
                            aria-label="Send message"
                            className={cn(
                                "shrink-0 w-12 h-12 flex items-center justify-center rounded-xl",
                                "bg-accent text-white transition-all duration-(--duration-fast)",
                                "hover:bg-accent-hover active:scale-95",
                                "disabled:opacity-50 disabled:hover:bg-accent-hover",
                                "outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-background"
                            )}
                        >
                            <ArrowUp size={18} />
                        </button>
                    </CursorZone>
                </div>
                <p className="text-center text-[11px] text-text-secondary mt-2">
                    AI responses are generated and may not be perfect.
                </p>
            </form>
        </div>
    )
}