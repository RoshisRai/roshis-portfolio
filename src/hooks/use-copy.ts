"use client"

import { useCallback, useEffect, useRef, useState } from "react"

export function useCopy(duration = 2_000) {
    const [copied, setCopied] = useState(false)
    const timeoutRef = useRef<number | null>(null)

    const copy = useCallback(
        async (text: string) => {
            try {
                await navigator.clipboard.writeText(text)

                setCopied(true)

                if (timeoutRef.current) {
                    window.clearTimeout(timeoutRef.current)
                }

                timeoutRef.current = window.setTimeout(() => {
                    setCopied(false)
                }, duration)

                return true
            } catch (error) {
                console.error("Failed to copy text.", error)
                return false
            }
        },
        [duration],
    )

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                window.clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    return {
        copied,
        copy,
    }
}