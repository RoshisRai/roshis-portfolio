"use client"

import { useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import type { BlogCategory } from "@/types/blog"
import { CursorZone } from "../global/cursor/cursor-zone"
import { Tag } from "../ui/tag"

interface CategoryFilterProps {
    categories: BlogCategory[]
}

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
            <CursorZone className="content" variant="category">
                <Tag 
                    variant="filter" 
                    active={!activeCategory}
                    onClick={() => handleFilter(null)}
                    aria-pressed={!activeCategory}
                >
                    All
                </Tag>

            </CursorZone>

            {categories.map((category) => (
                <CursorZone className="content" variant="category" key={category._id}>
                    <Tag 
                        variant="filter" 
                        active={activeCategory === category.slug}
                        onClick={() => handleFilter(category.slug)}
                        aria-pressed={activeCategory === category.slug}
                    >
                        {category.title}
                    </Tag>
                </CursorZone>
            ))}
        </nav>
    )
}