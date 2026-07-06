import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

interface PaginationProps {
    currentPage: number
    totalPages: number
    basePath: string
    category?: string
    className?: string
}

const ELLIPSIS = Symbol("ellipsis")

const PAGE_LINK_CLASS =
    "flex h-9 min-w-[36px] items-center justify-center rounded-lg text-[14px] font-medium transition-colors"

const NAV_BUTTON_CLASS =
    "flex items-center gap-1 rounded-lg px-3 py-2 text-[14px] transition-colors"

export function Pagination({
    currentPage,
    totalPages,
    basePath,
    category,
    className,
}: PaginationProps) {
    if (totalPages <= 1) {
        return null
    }

    function buildHref(page: number): string {
        const params = new URLSearchParams()

        if (page > 1) {
            params.set("page", String(page))
        }

        if (category) {
            params.set("category", category)
        }

        const query = params.toString()

        return query
            ? `${basePath}?${query}`
            : basePath
    }

    function getPageNumbers(): Array<number | typeof ELLIPSIS> {
        const pages: Array<
            number | typeof ELLIPSIS
        > = []

        const delta = 1

        for (
            let page = 1;
            page <= totalPages;
            page++
        ) {
            if (
                page === 1 ||
                page === totalPages ||
                (page >=
                    currentPage - delta &&
                    page <=
                        currentPage + delta)
            ) {
                pages.push(page)
            } else if (
                pages[
                    pages.length - 1
                ] !== ELLIPSIS
            ) {
                pages.push(ELLIPSIS)
            }
        }

        return pages
    }

    const pages = getPageNumbers()

    return (
        <nav
            aria-label="Blog pagination"
            className={cn(
                "flex items-center justify-center gap-1.5",
                className,
            )}
        >
            {currentPage > 1 ? (
                <Link
                    href={buildHref(
                        currentPage - 1,
                    )}
                    prefetch={false}
                    aria-label="Previous page"
                    className={cn(
                        NAV_BUTTON_CLASS,
                        "text-foreground/60 hover:bg-white/4 hover:text-foreground",
                    )}
                >
                    <ChevronLeft size={16} />
                    <span className="hidden sm:inline">
                        Previous
                    </span>
                </Link>
            ) : (
                <span
                    aria-disabled="true"
                    className={cn(
                        NAV_BUTTON_CLASS,
                        "cursor-not-allowed text-foreground/20",
                    )}
                >
                    <ChevronLeft size={16} />
                    <span className="hidden sm:inline">
                        Previous
                    </span>
                </span>
            )}

            {pages.map((page, index) => {
                if (page === ELLIPSIS) {
                    return (
                        <span
                            key={`ellipsis-${index}`}
                            aria-hidden="true"
                            className="px-2 py-2 text-[14px] text-foreground/30"
                        >
                            …
                        </span>
                    )
                }

                const active =
                    page === currentPage

                return (
                    <Link
                        key={page}
                        href={buildHref(page)}
                        prefetch={false}
                        aria-current={
                            active
                                ? "page"
                                : undefined
                        }
                        aria-label={`Page ${page}`}
                        className={cn(
                            PAGE_LINK_CLASS,
                            active
                                ? "bg-indigo-600 text-white"
                                : "text-foreground/60 hover:bg-white/4 hover:text-foreground",
                        )}
                    >
                        {page}
                    </Link>
                )
            })}

            {currentPage <
            totalPages ? (
                <Link
                    href={buildHref(
                        currentPage + 1,
                    )}
                    prefetch={false}
                    aria-label="Next page"
                    className={cn(
                        NAV_BUTTON_CLASS,
                        "text-foreground/60 hover:bg-white/4 hover:text-foreground",
                    )}
                >
                    <span className="hidden sm:inline">
                        Next
                    </span>
                    <ChevronRight size={16} />
                </Link>
            ) : (
                <span
                    aria-disabled="true"
                    className={cn(
                        NAV_BUTTON_CLASS,
                        "cursor-not-allowed text-foreground/20",
                    )}
                >
                    <span className="hidden sm:inline">
                        Next
                    </span>
                    <ChevronRight size={16} />
                </span>
            )}
        </nav>
    )
}