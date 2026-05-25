'use client'

import { cn } from "@/lib/utils";
import { ArrowUp } from "lucide-react";
import { useRef } from "react";
import { CursorZone } from "../global/cursor/cursor-zone";

interface ChatInputProps {
    input: string;
    setInput: (value: string) => void;
    onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
    isLoading: boolean;
    disabled?: boolean;
}

export const ChatInput = ({
    input,
    setInput,
    onSubmit,
    isLoading,
    disabled
}: ChatInputProps) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const formRef = useRef<HTMLFormElement>(null)

    const keyDownHandler = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            if (input.trim() && !isLoading) {
                formRef.current?.requestSubmit()
            }
        }
    }
    return (
        <div className="sticky bottom-0 bg-linear-to-t from-background via-background to-transparent pt-6 pb-4">
            <form ref={formRef} onSubmit={onSubmit} className="relative max-w-180 mx-auto">
                <div className="flex items-center gap-2">
                    <CursorZone variant="text" className="contents">
                        <input 
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything about Roshis..."
                            disabled={disabled}
                            onKeyDown={keyDownHandler}
                            className={cn(
                                "flex-1 h-12 px-4 rounded-xl text-base bg-text-primary/4",
                                "border border-text-primary/8 text-text-primary placeholder:text-text-secondary",
                                "outline-none transition-colors duration-(--duration-fast)",
                                "focus:border-accent/50 focus:bg-input-bg-focus"
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