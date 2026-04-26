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
    priority?: boolean
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
    sizes = '(max-width: 756px) 100vw, (max-width: 1280) 50vw, 45vw',
    priority = false
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
                loading={priority ? 'eager' : 'lazy'}
                className={cn(
                    'object-cover transition-transform duration-(--duration-normal) --ease-out-expo',
                    'group-hover:scale-1.03',
                    videoReady && isHovering && 'opacity-0'
                )}
            />

            { media.video && (
                <video
                    ref={videoRef}
                    src={media.video}
                    poster={media.poster ?? media.cover}
                    muted
                    loop
                    playsInline
                    onCanPlay={() => setVideoReady(true)}
                    className={cn(
                        'absolute inset-0 w-full h-full object-cover rounded-xl',
                        'opacity-0 transition-opacity duration-(--duration-fast)',
                        videoReady && isHovering && 'opacity-100',
                        //Hide video entirely on touch/coarse pointer devices
                        '[@media(hover:none)]:hidden',
                        'motion-reduce:hidden',
                    )}
                />
            )}

            {/* Accent wash that shares its VT name with the case study hero. */}
            <div 
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-linear-to-t from-[rgba(var(--project-accent-rgb),0.25)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-(--duration-fast)"
            />
        </div>
    )
}