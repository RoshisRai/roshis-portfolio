'use client'

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState, useCallback } from "react";

const EMAIL = "roshis.awai@gmail.com"

export const CopyEmailButton = () => {
    const [copied, setCopied] = useState(false)

    const handleCopy = useCallback(async () => {
        try {
            
        } catch {
            
        }
    }, [])

    return (
        <div className="flex flex-col items-center gap-3">
            <Link
                href={`mailto:${EMAIL}`}
                className="text-xl font-semibold font-mono text-indigo-400 hover:text-indigo-300 transition-colors"
            >{EMAIL}</Link>
        </div>
    )
}