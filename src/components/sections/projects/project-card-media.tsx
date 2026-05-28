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
    intersectionThreshold?: number
}

const aspectClass: Record<NonNullable<ProjectMedia['aspect']>, string> = {
    '16/10': 'aspect-16/10',
    '16/9': 'aspect-video',
    '4/3': 'aspect-4/3',
    '1/1': 'aspect-square'
}

function isTouchDevice() {
    return typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches
}

export const ProjectCardMedia = ({
    slug,
    media,
    isHovering,
    sizes = '(max-width: 756px) 100vw, (max-width: 1280) 50vw, 45vw',
    priority = false,
    intersectionThreshold = 0.5,
}: ProjectCardMediaProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const [isIntersecting, setIsIntersecting] = useState(false)
    const [videoReady, setVideoReady] = useState(false)

    useEffect(() => {
        if (!media.video || !isTouchDevice()) return

        const currentTarget = containerRef.current
        if (!media.video || !currentTarget || !isTouchDevice()) return

        const observerOptions: IntersectionObserverInit = {
            root: null,
            threshold: [0, intersectionThreshold]
        }

        const observer = new IntersectionObserver(([entry]) => {
            setIsIntersecting(entry.isIntersecting)
        }, observerOptions)

        observer.observe(currentTarget)
        
        return () => {
            observer.unobserve(currentTarget)
            observer.disconnect()
        }
    }, [media.video, intersectionThreshold])

    useEffect(() => {
        const video = videoRef.current
        if (!video || !media.video) return

        const shouldPlay = (isTouchDevice() ? isIntersecting : isHovering) && videoReady

        if (shouldPlay) {
            void video.play().catch(() => {
                // Auto-play can be blocked; poster image remains visible.
            })
            console.log("start playing")
        } else {
            video.pause()
            console.log("stop playing")
            video.currentTime = 0
        }

        return () => {
            if (!video.paused) video.pause()
        }
    }, [isHovering, isIntersecting, videoReady, media.video])

    const videoVisible = videoReady && (isTouchDevice() ? isIntersecting : isHovering)

    return (
        <div
        ref={containerRef}
        className={cn(
            'relative w-full overflow-hidden rounded-xl',
            aspectClass[media.aspect ?? '16/10'],
        )}
        >
            <Image 
                src={media.cover}
                alt={media.alt}
                fill
                sizes={sizes}
                loading={priority ? 'eager' : 'lazy'}
                data-vt-media
                style={{ viewTransitionName: projectMediaVTName(slug) }}
                className={cn(
                    'object-cover transition-transform duration-(--duration-normal) --ease-out-expo',
                    'group-hover:scale-1.03',
                    videoVisible && 'opacity-0'
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
                    preload="metadata"
                    className={cn(
                        'absolute inset-0 w-full h-full object-cover rounded-xl',
                        'opacity-0 transition-opacity duration-(--duration-fast)',
                        videoVisible && 'opacity-100',
                        //Hide video entirely on touch/coarse pointer devices
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