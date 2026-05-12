'use client'

import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

import { AboutContent } from "./about-content"
import { AboutPortrait } from "./about-portrait"

export const AboutSection = () => {
    const sectionRef = useRef<HTMLElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)

    useGSAP(
        () => {
            if (!sectionRef.current || !contentRef.current) return

            const mm = gsap.matchMedia()
            mm.add("(prefers-reduced-motion: no-preference)", () => {
                const elements = contentRef.current?.querySelectorAll('.about-animate')
                if (!elements) return

                gsap.from(elements, {
                    autoAlpha: 0,
                    y: 30,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 75%',
                        once: true,
                    },
                })
            })
        }, { scope: sectionRef }
    )
    return (
        <section
            ref={sectionRef}
            id="about"
            className="relative py-32 bg-linear-to-b from-transparent to-surface"
            aria-labelledby="about-heading"
        >
            <div
                ref={contentRef}
                className="mx-auto w-full max-w-(--max-width-content) px-6 md:px-12"
            >
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-20">
                    <AboutPortrait />
                    <AboutContent />
                </div>
            </div>
        </section>
    )
}