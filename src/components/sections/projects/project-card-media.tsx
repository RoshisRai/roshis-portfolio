'use client'

import { cn } from "@/lib/utils";
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import type { ProjectMedia } from '@/types/project'
import { projectMediaVTName } from "@/lib/project-transition";

interface ProjectCardMediaProps {
    slug: string
    media: ProjectMedia
    isHovering: boolean
    sizes?: string
}

const aspectClass: Record<NonNullable<ProjectMedia['aspect']>, string> = {
    '16/10': 'aspect-16/10',
    '16/9': 'aspect-video',
    '4/3': 'aspect-4/3',
    '1/1': 'aspect-square'
}

export const ProjectCardMedia = ({
    slug,
    media,
    isHovering,
    sizes = '(max-width: 756px) 100vw, (max-width: 1280) 50vw, 45vw'
}: ProjectCardMediaProps) => {
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const [videoReady, setVideoReady] = useState(false)

    useEffect(() => {
        const video = videoRef.current
        if (!video || !media.video) return

        if (isHovering) {
            void video.play().catch(() => {
                // Auto-play can be blocked; poster image remains visible.
            })
        } else {
            video.pause()
            video.currentTime = 0
        }

        return () => {
            if (!video.paused) video.pause()
        }
    }, [isHovering, media.video])

    return (
        <div
            className={cn(
                'relative w-full overflow-hidden rounded-xl',
                aspectClass[media.aspect ?? '16/10'],
            )}
            style={{ viewTransitionName: projectMediaVTName(slug) }}
        >
            <Image 
                src={media.cover}
                alt={media.alt}
                fill
                sizes={sizes}
                priority={false}
                className={cn(
                    'object-cover transition-transform duration-(--duration-normal) --ease-out-expo',
                    'group-hover:scale-1.03',
                    videoReady && isHovering && 'opacity-0'
                )}
            />
        </div>
    )
}