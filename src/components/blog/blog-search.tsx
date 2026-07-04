"use client"

import { useCallback, useMemo, useState } from "react"
import Fuse from "fuse.js"
import type { IFuseOptions } from "fuse.js"
import { Search, X } from "lucide-react"

import { cn } from "@/lib/utils"
import type { BlogSearchIndex } from "@/types/blog"

interface BlogSearchProps {
    posts: BlogSearchIndex[]
    onResults: (slugs: string[] | null) => void
}

const FUSE_OPTIONS: IFuseOptions<BlogSearchIndex> = {
    keys: [
        { name: "title", weight: 0.4 },
        { name: "excerpt", weight: 0.25 },
        { name: "tags", weight: 0.2 },
        { name: "category", weight: 0.15 },
    ],
    threshold: 0.35,
    ignoreLocation: true,
    minMatchCharLength: 2,
}

const MAX_RESULTS = 20

export function BlogSearch({
    posts,
    onResults,
}: BlogSearchProps) {
    const [query, setQuery] = useState("")

    const fuse = useMemo(
        () => new Fuse(posts, FUSE_OPTIONS),
        [posts],
    )

    const handleSearch = useCallback(
        (value: string) => {
            setQuery(value)

            const search = value.trim()

            if (!search) {
                onResults(null)
                return
            }

            const results = fuse.search(search, {
                limit: MAX_RESULTS,
            })

            onResults(
                results.map(
                    ({ item }) => item.slug,
                ),
            )
        },
        [fuse, onResults],
    )

    const clearSearch = useCallback(() => {
        setQuery("")
        onResults(null)
    }, [onResults])

    return (
        <div className="relative mx-auto w-full max-w-md">
            <Search
                aria-hidden="true"
                size={18}
                className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-foreground/30"
            />

            <input
                type="search"
                value={query}
                autoComplete="off"
                spellCheck={false}
                enterKeyHint="search"
                placeholder="Search by title, category, or tag..."
                aria-label="Search blog articles"
                onChange={(event) =>
                    handleSearch(
                        event.target.value,
                    )
                }
                className={cn(
                    "h-11 w-full rounded-xl border border-white/8 bg-white/4 pl-11 pr-10 text-[15px] text-foreground",
                    "placeholder:text-foreground/30",
                    "outline-none transition-colors duration-200",
                    "focus:border-indigo-500/50 focus:bg-white/6",
                )}
            />

            {query && (
                <button
                    type="button"
                    aria-label="Clear search"
                    onClick={clearSearch}
                    className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-foreground/40 transition-colors hover:text-foreground"
                >
                    <X size={16} />
                </button>
            )}
        </div>
    )
}