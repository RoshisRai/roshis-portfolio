'use client'

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
                <button
                    key={prompt}
                    onClick={() => onSelect(prompt)}
                    className="px-4 py-2.5 text-sm text-text-primary/80 rounded-xl
                        border border-border bg-text-primary/2
                        hover:bg-text-primary/5 hover:border-accent/30 hover:text-text-primary
                        transition-all duration-200 cursor-pointer"
                >
                    {prompt}
                </button>
            ))}
        </div>
    )
}