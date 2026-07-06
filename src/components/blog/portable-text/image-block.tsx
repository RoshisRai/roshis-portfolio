import Image from "next/image"

import type { SanityInlineImageBlock } from "@/types/blog"

import {
    getBlurDataUrl,
    getCoverImageUrl,
} from "@/lib/sanity/image"
import { cn } from "@/lib/utils"

interface ImageBlockProps {
    value: SanityInlineImageBlock
    className?: string
}

export function ImageBlock({
    value,
    className,
}: ImageBlockProps) {
    const imageUrl = getCoverImageUrl(value, 1200)

    return (
        <figure
            className={cn(
                "my-8",
                className,
            )}
        >
            <div className="relative aspect-16/10 overflow-hidden rounded-xl border border-white/6">
                <Image
                    src={imageUrl}
                    alt={value.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 720px"
                    className="object-cover transition-transform duration-300 hover:scale-[1.01]"
                    placeholder="blur"
                    blurDataURL={getBlurDataUrl(value)}
                    loading="lazy"
                />
            </div>

            {value.caption && (
                <figcaption className="mt-3 text-center text-sm text-foreground/50">
                    {value.caption}
                </figcaption>
            )}
        </figure>
    )
}