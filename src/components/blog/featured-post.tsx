import Image from "next/image"
import Link from "next/link"

import type { BlogPostCard } from "@/types/blog"
import { formatDateShort } from "@/lib/blog-utils"
import {
    BLOG_CATEGORY_COLORS,
    DEFAULT_CATEGORY_COLOR,
} from "@/lib/blog/constants"
import {
    getBlurDataUrl,
    getCoverImageUrl,
} from "@/lib/sanity/image"
import { cn } from "@/lib/utils"
import { CursorZone } from "../global/cursor/cursor-zone"

interface FeaturedPostProps {
    post: BlogPostCard
    className?: string
}

export function FeaturedPost({
    post,
    className,
}: FeaturedPostProps) {
    const categoryColor =
        BLOG_CATEGORY_COLORS[
            post.category.color ?? "blue"
        ] ?? DEFAULT_CATEGORY_COLOR

    const imageUrl = getCoverImageUrl(
        post.coverImage,
        960,
    )

    const blurDataUrl = getBlurDataUrl(
        post.coverImage,
    )

    return (
        <article
            className={cn("group max-w-275 mx-auto", className)}
        >
            <CursorZone variant="project" className="content">
                <Link
                    href={`/blog/${post.slug}`}
                    className={cn(
                        "grid lg:grid-cols-2 overflow-hidden rounded-xl", 
                        "border border-border bg-post-bg",
                        "transition-all duration-200", 
                        'hover:-translate-y-1 hover:border-accent/40',
                        'hover:shadow-[0_4px_10px_var(--color-accent-glow)]',
                        'active:-translate-y-1 active:border-accent/40',
                        'active:shadow-[0_4px_10px_var(--color-accent-glow)]',
                    )}
                >
                    <div className="relative aspect-video overflow-hidden lg:aspect-auto">
                        <Image
                            src={imageUrl}
                            alt={post.coverImage.alt}
                            fill
                            priority
                            loading="eager"
                            placeholder="blur"
                            blurDataURL={
                                blurDataUrl
                            }
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                    </div>

                    <div className="relative flex flex-col justify-center p-6 lg:px-5 lg:py-8 lg:pr-8">
                        <div className="mb-3 flex items-center gap-2">
                            <span
                                className={cn(
                                    "rounded-md px-2.5 py-0.5 text-[12px] font-medium",
                                    categoryColor,
                                )}
                            >
                                {
                                    post.category
                                        .title
                                }
                            </span>

                            {post.readingTime && (
                                <span className="text-[13px] text-foreground/40">
                                    &middot;{" "}
                                    {
                                        post.readingTime
                                    }{" "}
                                    min read
                                </span>
                            )}
                        </div>

                        <h2 className="mb-3 text-[22px] font-bold leading-tight text-foreground transition-colors duration-200 group-hover:text-indigo-400 lg:text-[26px]">
                            {post.title}
                        </h2>

                        <p className="mb-4 line-clamp-3 text-[15px] leading-relaxed text-foreground/50">
                            {post.excerpt}
                        </p>

                        <time
                            dateTime={
                                post.publishedAt
                            }
                            className="text-[13px] text-foreground/30"
                        >
                            {formatDateShort(
                                post.publishedAt,
                            )}
                        </time>

                        <div className={cn(
                            'absolute inset-0 opacity-0 transition-opacity duration-300',
                            'bg-linear-to-br from-accent/10 to-transparent',
                            'group-hover:opacity-60',
                        )} />
                    </div>
                </Link>
            </CursorZone>
        </article>
    )
}