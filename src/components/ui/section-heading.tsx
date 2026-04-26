'use client'

import { cn } from "@/lib/utils"
import { useRef } from "react"
import { useGSAP } from "@gsap/react";
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from "gsap/SplitText";

interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string
    subtitle?: string
    align?: 'left' | 'center' | 'right'
    as?: 'h1' | 'h2' | 'h3'
}

const SectionHeading = ({
    title,
    subtitle,
    align = 'left',
    as: Tag = 'h2',
    className,
    ...props
}: SectionHeadingProps) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const titleRef = useRef<HTMLHeadingElement>(null)
    const subtitleRef = useRef<HTMLParagraphElement>(null)

    useGSAP(() => {
        const container = containerRef.current
        const titleEl = titleRef.current
        if (!container || !titleEl) return

        const splitTitle = new SplitText(titleEl, { type: 'lines, words' })
        const splitSubtitle = subtitleRef.current
            ? new SplitText(subtitleRef.current, { type: 'lines' })
            : null

        // Create GSAP timeline
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container,
                start: 'top 85%',
                toggleActions: 'play none none none',
            }
        })

        // Animation Sequence
        tl.from(splitTitle.words, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.05,
            ease: "power4.out",
        })
        if (splitSubtitle) {
            tl.from(splitSubtitle.lines, {
                y: 20,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power3.out",
            }, "-=0.4")
        }

        return () => {
            tl.kill()
            splitTitle.revert()
            splitSubtitle?.revert()
            ScrollTrigger.refresh()
        }
    }, { scope: containerRef })

    return (
        <div
            ref={containerRef}
            className={cn(
                'flex flex-col',
                // Margin to content (48px). Reduced when subtitle present since
                // the subtitle itself gets mb-2 (8px) and total gap stays ~48px.
                subtitle ? 'mb-10' : 'mb-12',
                align === 'center' && 'items-center text-center',
                align === 'right' && 'items-end text-right',
                className,
            )}
            {...props}
        >
            <Tag
                ref={titleRef}
                className={cn(
                    'font-display font-bold text-text-primary leading-[1.1] tracking-tight',
                    // 48px heading
                    'text-[clamp(32px,5vw,48px)]',
                    subtitle ? 'mb-2' : '',
                )}
            >
                {title}
            </Tag>
            {subtitle && (
                <p
                    ref={subtitleRef}
                    className="text-[18px] font-normal text-text-secondary leading-relaxed max-width-prose"
                >
                    {subtitle}
                </p>
            )}

        </div>
    )
}

SectionHeading.displayName = 'SectionHeading'

export { SectionHeading, type SectionHeadingProps }