'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Button } from '@/components/ui/button'
import { Tag } from '@/components/ui/tag'
import { useSmoothScroll } from '@/hooks/use-smooth-scroll'
import { ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CursorZone } from '@/components/global/cursor/cursor-zone'
import { Magnetic } from '@/components/global/cursor/magnetic'

// ─── Data ─────────────────────────────────────────────────────────────────────

const ROLES = [
    'Full-Stack Software Engineer',
    'API & Backend Architect',
    'Automation Systems Developer',
    'AI Integration Specialist',
]

const TITLE_LINES = [
    "Hi, I'm Roshis.",
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function HeroContent() {
    const scrollTo = useSmoothScroll()
    const [roleIndex, setRoleIndex] = useState(0)

    // Refs for GSAP targets
    const containerRef  = useRef<HTMLDivElement>(null)
    const statusRef     = useRef<HTMLDivElement>(null)
    const titleRef      = useRef<HTMLHeadingElement>(null)
    const subtitleRef   = useRef<HTMLParagraphElement>(null)
    const roleRef       = useRef<HTMLSpanElement>(null)
    const cursorRef     = useRef<HTMLSpanElement>(null)
    const ctaRef        = useRef<HTMLDivElement>(null)
    const roleWrapperRef = useRef<HTMLDivElement>(null)
    const roleTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)
    const isMountedRef  = useRef(true)

    // ── Initial load timeline ──────────────────────────────────────────────────
    useEffect(() => {
        const ctx = gsap.context(() => {
            const words = titleRef.current?.querySelectorAll('[data-word]') ?? []

            const buttons = ctaRef.current?.children ?? []

            const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

            // Start everything invisible
            gsap.set([words, statusRef.current, subtitleRef.current, roleWrapperRef.current], {
                opacity: 0,
                y: 16,
            })

            gsap.set(buttons, { autoAlpha: 0, opacity: 0})

            tl
                .to(statusRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                })
                .to(words, {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    stagger: 0.07,
                }, '-=0.3')
                .to(subtitleRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                }, '-=0.2')
                .to(
                    roleWrapperRef.current,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                    },
                    '-=0.2')
                .to(buttons, {
                    opacity: 1,
                    autoAlpha: 1,
                    duration: 0.5,
                    stagger: 0.1,
                }, '-=0.1')
        }, containerRef)

        return () => ctx.revert()
    }, [])

    // ── Cursor blink ───────────────────────────────────────────────────────────
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(cursorRef.current, {
                opacity: 0,
                duration: 0.5,
                repeat: -1,
                yoyo: true,
                ease: 'power2.inOut',
            })
        })
        return () => ctx.revert()
    }, [])

    // ── Role rotation ──────────────────────────────────────────────────────────
    useEffect(() => {
        isMountedRef.current = true

        const rotateRole = () => {
            if (!isMountedRef.current || !roleRef.current) return

            // Fade out + slide up
            gsap.to(roleRef.current, {
                opacity: 0,
                y: -10,
                duration: 0.3,
                delay: 1.5,
                ease: 'power2.in',
                onComplete: () => {
                    if (!isMountedRef.current) return

                    setRoleIndex(prev => {
                        const next = (prev + 1) % ROLES.length
                        return next
                    })

                    // Reset position, fade in
                    gsap.fromTo(
                        roleRef.current,
                        { opacity: 0, y: 10 },
                        { opacity: 1, y: 0, duration: 0.4, ease: 'expo.out' },
                    )
                },
            })

            roleTimerRef.current = setTimeout(rotateRole, 2800)
        }

        roleTimerRef.current = setTimeout(rotateRole, 2800)

        return () => {
            isMountedRef.current = false
            if (roleTimerRef.current) clearTimeout(roleTimerRef.current)
        }
    }, [])

    return (
        <div ref={containerRef} className="flex flex-col gap-6">

            {/* Status tag */}
            <div ref={statusRef}>
                <Tag
                    variant="status"
                    statusColor="#4ade80"
                    className="bg-accent/10 border border-[#4ade80]/20 hero-status"
                >
                    <span className="text-[12px] uppercase tracking-[0.05em] text-text-secondary">
                        Available for work
                    </span>
                </Tag>
            </div>

            {/* Title — each word wrapped for stagger */}
            <h1
                ref={titleRef}
                className="font-display text-[clamp(28px,5vw,64px)] font-extrabold leading-[1.1] tracking-tight text-text-primary"
            >
                {TITLE_LINES.map((line, li) => (
                    <span key={li} className="block">
                        {line.split(' ').map((word, wi) => (
                            <span
                                key={wi}
                                data-word
                                className="inline-block mr-[0.25em] will-change-transform bg-linear-to-r from-text-primary to-text-secondary bg-clip-text text-transparent"
                            >
                                {word}
                            </span>
                        ))}
                    </span>
                ))}
            </h1>

            {/* Subtitle */}
            <p
                ref={subtitleRef}
                className="max-w-xl text-xl leading-relaxed text-text-secondary"
            >
                Full-Stack Software Engineer building scalable APIs, SaaS products & AI-integrated web apps.
            </p>

            {/* Rotating role */}
            <div ref={roleWrapperRef} className="flex items-center gap-2 h-7">
                <span 
                    className="text-text-secondary"
                    >
                    &#x2f;&#x2f;
                </span>
                <span
                    className={cn(
                        'inline-flex items-center gap-1.5',
                        'rounded-[14px] font-medium text-[14px]',
                        'h-8 px-3.5 select-none',
                        'border bg-surface/40 text-accent border-border'
                    )}
                    ref={roleRef}
                >
                    {ROLES[roleIndex]}
                </span>
                {/* Blinking cursor */}
                <span
                    ref={cursorRef}
                    className="inline-block w-0.5 h-3.5 bg-accent rounded-full"
                    aria-hidden
                />
            </div>

            {/* CTA buttons */}
            <div
                ref={ctaRef}
                className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center"
            >
                <CursorZone variant='button'>
                    <Button
                        onClick={() => scrollTo('/#projects')}
                        className="group h-12 w-full px-6 text-[15px] cursor-pointer sm:w-auto transition"
                    >
                        View My Work
                        <ArrowDown
                            size={16}
                            className="transition-transform duration-(--duration-fast) group-hover:translate-y-0.5"
                        />
                    </Button>
                </CursorZone>
                <Magnetic strength={0.8} elementPull={0.1}>
                    <CursorZone variant='button'>
                        <Button
                            variant="ghost"
                            onClick={() => scrollTo('/#contact')}
                            className="h-12 w-full px-6 text-[15px] cursor-pointer sm:w-auto transition"
                        >
                            Get In Touch
                        </Button>
                    </CursorZone>
                </Magnetic>
            </div>
        </div>
    )
}