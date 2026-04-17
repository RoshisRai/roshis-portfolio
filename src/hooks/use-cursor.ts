'use client'

import { CursorContext } from "@/providers/cursor-provider"
import { useContext } from "react"

export function useCursor() {
    const ctx = useContext(CursorContext)
    if (!ctx) {
        throw new Error('useCursor must be used within a CursorProvider')
    }
    return ctx
}