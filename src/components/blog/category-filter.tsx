"use client"

import { useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"
import type { BlogCategory } from "@/types/blog"

interface CategoryFilterProps {
    categories: BlogCategory[]
}

const BUTTON_BASE_CLASS =
    "rounded-full border px-4 py-1.5 text-[14px] font-medium transition-colors duration-200"

export function CategoryFilter({
    categories,
}: CategoryFilterProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const activeCategory = searchParams.get("category")

    const handleFilter = useCallback(
        (slug: string | null) => {
            const params = new URLSearchParams(searchParams.toString())
            if (slug) {
                params.set("category", slug)
            } else {
                params.delete("category")
            }
            params.delete("page")

            const query = params.toString()
            router.replace(
                query ? `/blog?${query}` : "/blog",
                { scroll: false },
            )
        },
        [router, searchParams],
    )

    if (categories.length === 0) {
        return null
    }

    return (
        <nav
            aria-label="Filter posts by category"
            className="flex flex-wrap items-center justify-center gap-2"
        >
            <button
                type="button"
                onClick={() => handleFilter(null)}
                aria-pressed={!activeCategory}
                className={cn(
                    BUTTON_BASE_CLASS,
                    !activeCategory
                        ? "border-indigo-600 bg-indigo-600 text-white"
                        : "border-white/10 text-foreground/60 hover:border-white/20 hover:text-foreground",
                )}
            >
                All
            </button>

            {categories.map((category) => (
                <button
                    key={category._id}
                    type="button"
                    onClick={() => handleFilter(category.slug)}
                    aria-pressed={activeCategory === category.slug}
                    className={cn(
                        BUTTON_BASE_CLASS,
                        activeCategory ===
                            category.slug
                            ? "border-indigo-600 bg-indigo-600 text-white"
                            : "border-white/10 text-foreground/60 hover:border-white/20 hover:text-foreground",
                    )}
                >
                    {category.title}
                </button>
            ))}
        </nav>
    )
}