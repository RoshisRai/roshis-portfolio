import { renderCodeToHtml } from "@/lib/shiki"
import type { SanityCodeBlock } from "@/types/blog"
import { cn } from "@/lib/utils"

import { CopyButton } from "./copy-button"

interface CodeBlockProps {
    value: SanityCodeBlock
    className?: string
}

export async function CodeBlock({
    value,
    className,
}: CodeBlockProps) {
    const {
        code,
        language = "text",
        filename,
    } = value

    const html = await renderCodeToHtml(
        code,
        language,
    )

    return (
        <figure
            className={cn(
                "my-8 overflow-hidden rounded-xl border border-border bg-surface-alt",
                className,
            )}
        >
            <figcaption className="flex items-center justify-between border-b border-border bg-white/2 px-4 py-2">
                <span className="truncate font-mono text-xs text-text-primary/80">
                    {filename ?? language}
                </span>

                <CopyButton code={code} />
            </figcaption>

            <div
                className={cn(
                    "overflow-x-auto",

                    // Remove Shiki's default spacing/background
                    "[&_.shiki]:bg-transparent!",
                    "[&_.shiki]:m-0",
                    "[&_.shiki]:overflow-x-auto",
                    "[&_.shiki]:p-4",

                    "[&_pre]:m-0",
                    "[&_pre]:rounded-none",

                    "[&_.line]:min-h-6",
                )}
                dangerouslySetInnerHTML={{
                    __html: html,
                }}
            />
        </figure>
    )
}