'use client'

import { CursorZone } from "../global/cursor/cursor-zone"

const PROMPTS = [
  "What makes Roshis a strong software engineer?",
  "What technologies does he specialize in?",
  "Tell me about his most impressive project",
  "Is he open to new opportunities?"
]

interface SuggestedPromptsProps {
    onSelect: (prompt: string) => void
}

export const SuggestedPrompts = ({ onSelect }: SuggestedPromptsProps) => {
    return (
        <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2 justify-center mt-4 max-w-3xl mx-auto px-4">
            {PROMPTS.map((prompt) => (
                <CursorZone 
                    variant="button"
                    key={prompt}
                    className="contents"
                >
                    <button
                        type="button"
                        onClick={() => onSelect(prompt)}
                        aria-label={`Ask prompt: ${prompt}`}
                        className="px-4 py-2.5 text-sm text-text-primary/80 rounded-xl
                            border border-border bg-text-primary/2
                            outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:text-text-primary
                            hover:bg-text-primary/5 hover:border-accent/30 hover:text-text-primary
                            active:bg-text-primary/10 active:border-accent/40 active:scale-[0.97]
                            sm:py-2.5 
                            transition-all duration-200 cursor-pointer select-none"
                    >
                        {prompt}
                    </button>
                </CursorZone>
            ))}
        </div>
    )
}