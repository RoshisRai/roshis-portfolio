"use client"

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";

import { cn } from "@/lib/utils";
import { BlogPostCard } from "@/types/blog";
import { PostCard } from "../../blog/post-card";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";


interface LatestPostsClientProps {
    posts: BlogPostCard[]
    viewAllLinkDesktop: React.ReactNode
    viewAllLinkMobile: React.ReactNode
}

export function LatestPostsClient({
    posts,
    viewAllLinkDesktop,
    viewAllLinkMobile
}: LatestPostsClientProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const titleRef = useRef<HTMLDivElement>(null)
    const subtitleRef = useRef<HTMLDivElement>(null)
    const viewlinksRef = useRef<HTMLDivElement>(null)
    const gridRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        const container = containerRef.current

        const splitTitle = new SplitText(titleRef.current, {
            type: 'lines, words',
            wordsClass: 'bg-linear-to-r from-text-primary to-text-secondary bg-clip-text text-transparent inline-block pb-2'
        })
        const splitSubtitle = new SplitText(subtitleRef.current, { type: 'lines' })

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container,
                start: 'top 85%',
                toggleActions: 'play none none none',
            }
        })

        tl.from(splitTitle.words, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.05,
            ease: "power4.out",
        })
        .from(splitSubtitle.lines, {
            y:20,
            opacity:0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
        }, "-=0.4")
        .from(viewlinksRef.current, {
            x: 20,
            opacity:0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
        }, "-=0.4")

        if (gridRef.current) {
            tl.from(gridRef.current.children, {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "power4.out",
            }, "-=0.7")
        }

        return () => {
            tl.kill()
            splitTitle.revert()
            splitSubtitle.revert()
            ScrollTrigger.refresh()
        }

    }, { scope: containerRef })

    return (
        <div 
            className={cn(
                'mx-auto w-full',
                'max-w-(--max-width-content)',
                'px-6 md:px-12',
            )}
            ref={containerRef}
        >
            <header className="mb-10 flex items-end justify-between gap-8">
                <div>
                    <h2
                        id="writing-heading"
                        className="font-display font-bold text-text-primary leading-[1.1] tracking-tight text-[clamp(32px,5vw,48px)] mb-2"
                        ref={titleRef}
                    >
                        Latest Writing
                    </h2>

                    <p className="text-[18px] font-normal text-text-secondary leading-relaxed max-width-prose" ref={subtitleRef}>
                        Technical articles on
                        engineering, software
                        architecture, and system
                        design.
                    </p>
                </div>

                <div
                    ref={viewlinksRef}
                    className="content"
                >
                    {viewAllLinkDesktop}
                </div>
            </header>

            <div 
                className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                ref={gridRef}
            >
                {posts.map((post) => (
                    <PostCard
                        key={post._id}
                        post={post}
                    />
                ))}
                <div
                    className={cn(
                        "h-105 max-w-100 bg-accent-hover rounded-lg"
                    )}
                >
                </div>
                <div
                    className={cn(
                        "h-105 max-w-100 bg-accent-hover rounded-lg"
                    )}
                >
                </div>
                
            </div>

            <div className="mt-8 flex justify-center">
                {viewAllLinkMobile}
            </div>
        </div>
    )
}