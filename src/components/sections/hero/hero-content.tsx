'use client'

import { Button } from "@/components/ui/button"
import { Tag } from "@/components/ui/tag"
import { useSmoothScroll } from "@/hooks/use-smooth-scroll"
import { ArrowDown } from "lucide-react"

export default function HeroContent() {
    const scrollTo = useSmoothScroll()

    return (
        <>
            <Tag variant="status" statusColor="#4ade80" className="hero-status">
                <span className="text-[12px] uppercase tracking-[0.05em] text-text-secondary">
                    Available for work
                </span>
            </Tag>
             <h1 className="font-display text-[clamp(32px,6vw,56px)] font-extrabold leading-[1.1] tracking-tight text-text-primary">
                Hi, I&apos;m Roshis.
                <br />
                I build the systems 
                <br />
                behind
                <br />
                the interface.
            </h1>
            <p className="mt-6 max-w-xl text-[clamp(15px,2vw,18px)] leading-relaxed text-text-secondary">
                Full-Stack Software Engineer building scalable web apps,
                APIs & intelligent systems.
            </p>
            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                <Button
                    onClick={() => scrollTo('/#projects')}
                    className="group h-12 w-full px-6 text-[15px] cursor-pointer sm:w-auto"
                >
                    View My Work
                    <ArrowDown
                        size={16}
                        className="transition-transform duration-(--duration-fast) group-hover:translate-y-0.5"
                    />
                </Button>

                <Button
                    variant="ghost"
                    onClick={() => scrollTo('/#contact')}
                    className="h-12 w-full px-6 text-[15px] cursor-pointer sm:w-auto"
                >
                    Get In Touch
                </Button>
            </div>
        </>
    )
}