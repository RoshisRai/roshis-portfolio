'use client'

import { SectionWrapper } from "@/components/layout/section-wrapper"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef } from "react"

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
        >
            <div 
                ref={containerRef}
                className="w-full"
            >
                {/* Email  */}
                <div className="contact-animate mb-10">
                    <span>roshis.awai@gmail.com</span>
                </div>

                {/* Divider  */}
                <div className="contact-animate flex items-center gap-4 mb-10">
                    <div className="flex-1 h-px bg-white/6" />
                    <span className="text-xs text-foreground/30 uppercase tracking-widest">
                        or
                    </span>
                    <div className="flex-1 h-px bg-white/6" />
                </div>

                {/* Contact Form  */}
                <div className="contact-animate">
                    <form>
                        <h3>Contact Form</h3>
                        <div className="input-field">
                            <label htmlFor="name">Name:</label>
                            <input type="text" id="name"/>
                        </div>
                        <div className="input-field">
                            <label htmlFor="email">Email:</label>
                            <input type="email" id="email"/>
                        </div>
                    </form>
                </div>

                {/* Social Links  */}
                <div className="contact-animate">
                    <span className="inline-block mt-8 w-full text-center">Social Links</span>
                </div>

            </div>
        </SectionWrapper>
    )
}