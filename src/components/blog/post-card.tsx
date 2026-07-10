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
import { blogCoverVTName } from "@/lib/project-transition"

interface PostCardProps {
    post: BlogPostCard
    showImage?: boolean
    priority?: boolean
    className?: string
}

export function PostCard({
    post,
    showImage = true,
    priority = false,
    className,
}: PostCardProps) {
    const categoryColor =
        BLOG_CATEGORY_COLORS[
            post.category.color ?? "blue"
        ] ?? DEFAULT_CATEGORY_COLOR

    const imageUrl = getCoverImageUrl(
        post.coverImage,
        640,
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
                className="block overflow-hidden rounded-xl border border-text-secondary/2 bg-post-bg transition-all duration-200 hover:-translate-y-0.5 hover:border-text-secondary/12 hover:bg-post-bg/4 active:-translate-y-0.5 active:border-text-secondary/12 active:bg-post-bg/4 "
            >
                {showImage && (
                    <div className="relative aspect-video overflow-hidden">
                        <Image
                            src={imageUrl}
                            alt={
                                post.coverImage.alt
                            }
                            fill
                            priority={priority}
                            loading={
                                priority
                                    ? "eager"
                                    : "lazy"
                            }
                            placeholder="blur"
                            blurDataURL={
                                blurDataUrl
                            }
                            sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 640px"
                            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                            style={{ viewTransitionName: blogCoverVTName(post.slug) }}
                        />
                    </div>
                )}

                <div className="p-5">
                    <div className="mb-3 flex items-center gap-2">
                        <span
                            className={cn(
                                "rounded-md px-2 py-0.5 text-[11px] font-medium",
                                categoryColor,
                            )}
                        >
                            {
                                post.category
                                    .title
                            }
                        </span>

                        {post.readingTime && (
                            <span className="text-[12px] text-foreground/40">
                                {
                                    post.readingTime
                                }{" "}
                                min read
                            </span>
                        )}
                    </div>

                    <h3 className="mb-2 line-clamp-2 text-[17px] font-semibold leading-snug text-foreground transition-colors duration-200 group-hover:text-indigo-400">
                        {post.title}
                    </h3>

                    <p className="mb-3 line-clamp-2 text-[14px] leading-relaxed text-foreground/50">
                        {post.excerpt}
                    </p>

                    <time
                        dateTime={
                            post.publishedAt
                        }
                        className="text-[12px] text-foreground/30"
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