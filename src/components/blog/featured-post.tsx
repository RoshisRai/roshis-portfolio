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
            className={cn("group", className)}
        >
            <Link
                href={`/blog/${post.slug}`}
                className="grid overflow-hidden rounded-xl border border-white/6 bg-white/2 transition-[background-color,border-color] duration-200 hover:border-white/12 hover:bg-white/4 lg:grid-cols-2"
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

                <div className="flex flex-col justify-center p-6 lg:px-5 lg:py-8 lg:pr-8">
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
                </div>
            </Link>
        </article>
    )
}