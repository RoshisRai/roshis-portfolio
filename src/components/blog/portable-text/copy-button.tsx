"use client"

import { Check, Copy } from "lucide-react"

import { useCopy } from "@/hooks/use-copy"
import { cn } from "@/lib/utils"

interface CopyButtonProps {
    code: string
    className?: string
}

export function CopyButton({
    code,
    className,
}: CopyButtonProps) {
    const { copied, copy } = useCopy()

    return (
        <button
            type="button"
            onClick={() => void copy(code)}
            aria-live="polite"
            aria-label={
                copied
                    ? "Code copied"
                    : "Copy code"
            }
            className={cn(
                "flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-foreground/40 transition-colors",
                "hover:bg-white/4 hover:text-foreground/70",
                className,
            )}
        >
            {copied ? (
                <>
                    <Check size={12} />
                    <span>Copied</span>
                </>
            ) : (
                <>
                    <Copy size={12} />
                    <span>Copy</span>
                </>
            )}
        </button>
    )
}