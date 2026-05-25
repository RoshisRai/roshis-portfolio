'use client'

import { cn } from "@/lib/utils"
import { Sparkles } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { CursorZone } from "../global/cursor/cursor-zone"

export function ChatFab() {
    const [hovered, setHovered] = useState<boolean>(false)

    return (
        <CursorZone variant="button" className="contents" >
            <Link
                href="/chat"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                aria-label="Ask me anything chat button"
                className={cn(
                    "fixed bottom-6 right-6 z-100",
                    "flex items-center h-12 rounded-full",
                    "bg-accent text-white shadow-lg shadow-accent/30",
                    "transition-all duration-300 ease-out",
                    "hover:shadow-xl hover:shadow-accent/40 hover:scale-105 select-none",
                    hovered ? "pl-4 pr-5 w-40" : "px-3.5 w-12" 
                )}
            >
                <Sparkles size={20} className="shrink-0" />
                <span
                    className={cn(
                        "text-xs font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ease-out",
                        hovered ? "w-28 opacity-100 pl-2 visible" : "w-0 opacity-0 pl-0 invisible"
                    )}
                >
                    Ask me anything
                </span>
            </Link>
        </CursorZone>
    )
}
