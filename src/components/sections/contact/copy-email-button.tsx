'use client'

import { CursorZone } from "@/components/global/cursor/cursor-zone";
import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";
import Link from "next/link";
import { useState, useCallback } from "react";

const EMAIL = "roshis.awai@gmail.com"

export const CopyEmailButton = () => {
    const [copied, setCopied] = useState(false)
    const [copyError, setCopyError] = useState(false)

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(EMAIL);
            setCopied(true);
            setCopyError(false);
            setTimeout(() => setCopied(false), 2000)
        } catch {
            // Clipboard API can fail in insecure contexts or blocked permissions.
            setCopyError(true);
            setTimeout(() => setCopyError(false), 2500)
        }
    }, [])

    return (
        <div className="flex flex-col items-center gap-3">
            <CursorZone variant="scene">
                <Link
                    href={`mailto:${EMAIL}`}
                    className="text-xl font-semibold font-mono text-indigo-400 hover:text-indigo-300 transition-colors"
                >{EMAIL}</Link>
            </CursorZone>

            <CursorZone variant="copy_email" label="😊">
                <button
                    type="button"
                    onClick={handleCopy}
                    className={cn(
                        "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium",
                        "border transition-all duration-200",
                        copied
                            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                            : copyError
                            ? "border-rose-500/40 bg-rose-500/10 text-rose-400"
                            : "border-background/10 bg-background/3 text-text-primary/90 hover:bg-background/6 hover:text-text-secondary"
                    )}
                    aria-label={copied ? "Email copied to clipboard" : copyError ? "Copy failed" : "Copy email address"}
                >
                    <span className="relative w-4 h-4">
                        <Copy
                            size={16}
                            className={cn(
                                "absolute inset-0 transition-all duration-200",
                                copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
                            )}
                        />
                        <Check
                            size={16}
                            className={cn(
                                "absolute inset-0 transition-all duration-200",
                                copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
                            )}
                        />
                    </span>
                    <span>
                        {copied ? "Copied!" : copyError ? "Copy failed" : "Copy Email"}
                    </span>
                </button>
            </CursorZone>

        </div>
    )
}