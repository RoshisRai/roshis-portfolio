'use client'

import { CursorZone } from "../global/cursor/cursor-zone"

const PROMPTS = [
    "What's his approach to system design?",
    "Tell me about his backend experience",
    "What projects has Roshis built?",
    "Is he open to new opportunities?",
]

interface SuggestedPromptsProps {
    onSelect: (prompt: string) => void
}

export const SuggestedPrompts = ({ onSelect }: SuggestedPromptsProps) => {
    return (
        <div className="flex flex-wrap gap-2 justify-center mt-4">
            {PROMPTS.map((prompt) => (
                <CursorZone 
                    variant="button"
                    key={prompt}
                    className="contents"
                >
                    <button
                        onClick={() => onSelect(prompt)}
                        className="px-4 py-2.5 text-sm text-text-primary/80 rounded-xl
                            border border-border bg-text-primary/2
                            hover:bg-text-primary/5 hover:border-accent/30 hover:text-text-primary
                            focus-visible:outline-none focus-visible:bg-text-primary/5 
                            focus-visible:border-accent/30 focus-visible:text-text-primary
                            active:bg-text-primary/10 active:border-accent/40 active:scale-[0.97]
                            transition-all duration-200 cursor-pointer"
                    >
                        {prompt}
                    </button>
                </CursorZone>
            ))}
        </div>
    )
}