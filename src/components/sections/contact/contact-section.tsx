'use client'

import { SectionWrapper } from "@/components/layout/section-wrapper"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef } from "react"
import { CopyEmailButton } from "./copy-email-button"
import { SocialLinks } from "./social-links"
import { ContactForm } from "./contact-form"
import { Globe } from "./globe"

export const ContactSection = () => {
    const containerRef = useRef<HTMLDivElement>(null)

    useGSAP(
        () => {
            const mm = gsap.matchMedia();

            mm.add("(prefers-reduced-motion: no-preference)", () => {
                const elements = containerRef?.current?.querySelectorAll(".contact-animate")
                if (!elements) return;

                gsap.from(elements, {
                    autoAlpha: 0,
                    y: 24,
                    duration: 0.7,
                    stagger: 0.12,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 80%",
                        once: true,
                    }
                })
            })
        },
        { scope: containerRef }
    )
    return (
        <SectionWrapper
            title="Let&rsquo;s build something together."
            subtitle="Have a project in mind, or just want to chat? I&rsquo;d love to hear
            from you."
            id="contact"
            headingAlign="center"
            className="bg-linear-to-b from-surface to-transparent overflow-hidden"
        >
            <div 
                ref={containerRef}
                className="w-full"
            >
                {/* Email  */}
                <div className="contact-animate mb-10">
                    <CopyEmailButton />
                </div>

                {/* Divider  */}
                <div className="contact-animate flex items-center gap-4 mb-10">
                    <div className="flex-1 h-px bg-white/6" />
                    <span className="text-xs text-foreground/30 uppercase tracking-widest">
                        or
                    </span>
                    <div className="flex-1 h-px bg-white/6" />
                </div>

                {/* Contact Form + Image  */}
                <div className="contact-animate flex flex-col lg:flex-row gap-4">
                    <ContactForm />
                    <Globe />
                </div>

                {/* Social Links  */}
                <div className="contact-animate mt-14">
                    <SocialLinks />
                </div>

            </div>
        </SectionWrapper>
    )
}