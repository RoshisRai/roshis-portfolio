'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { useActiveSection } from '@/hooks/use-active-section'
import { useSmoothScroll } from '@/hooks/use-smooth-scroll'

interface NavLink {
    label: string
    href: string
}

interface MobileMenuProps {
    links: NavLink[]
}

export function MobileMenu({ links }: MobileMenuProps) {
    const pathname = usePathname()
    const activeSection = useActiveSection()
    const isHome = pathname === '/'
    const scrollTo = useSmoothScroll()

    const isOpenRef = useRef(false)
    const overlayRef = useRef<HTMLDivElement>(null)
    const backdropRef = useRef<HTMLDivElement>(null)
    const linkRefs = useRef<(HTMLButtonElement | null)[]>([])
    const ctaRef = useRef<HTMLButtonElement>(null)
    const tlRef = useRef<gsap.core.Timeline | null>(null)

    
    const open = () => {
        if (isOpenRef.current) return
        isOpenRef.current = true
        document.body.style.overflow = 'hidden'
        tlRef.current?.play()
    }

    const close = () => {
        if (!isOpenRef.current) return
        isOpenRef.current = false
        document.body.style.overflow = ''
        tlRef.current?.reverse()
    }

    const toggle = () => isOpenRef.current ? close() : open()

    // Build GSAP timeline once on mount
    useEffect(() => {
        const overlay = overlayRef.current
        const backdrop = backdropRef.current
        const linkEls = linkRefs.current.filter(Boolean)
        const cta = ctaRef.current
        if (!overlay || !backdrop) return

        gsap.set(overlay, { yPercent: -100, display: 'none' })
        gsap.set(backdrop, { opacity: 0, display: 'none' })
        gsap.set([linkEls, cta], { opacity: 0, y: 24 })
        // gsap.set([cta], { opacity: 0, y: 24 })

        tlRef.current = gsap.timeline({ paused: true })
            .to(backdrop, {
                display: 'block',
                opacity: 1,
                duration: 0.2,
                ease: 'power2.out',
            })
            .to(overlay, {
                display: 'flex',
                yPercent: 0,
                duration: 0.5,
                ease: 'expo.out',
            }, '<')
            .to(linkEls, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: 'expo.out',
                stagger: 0.09,
            }, '-=0.2')
            .to(cta, {
                opacity: 1,
                y: 0,
                duration: 0,
                ease: 'expo.out',
            }, '-=0.25')

        return () => { tlRef.current?.kill() }
    }, [])

    // Close on route change
    useEffect(() => {
        close()
    }, [pathname])

    // Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') close()
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    const handleLinkClick = (href: string) => {
        close()
        // Small delay so the overlay closes before scrolling
        setTimeout(() => scrollTo(href), 300)
    }

    return (
        <>
            {/* Hamburger */}
            <button
                onClick={toggle}
                aria-label="Toggle menu"
                className={cn(
                    'inline-flex items-center justify-center',
                    'w-9 h-9 rounded-lg',
                    'border border-border text-text-secondary',
                    'bg-transparent',
                    'hover:bg-surface hover:text-text-primary',
                    'transition-all duration-(--duration-fast)',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                )}
            >
                <Menu size={16} />
            </button>

            {/* Backdrop */}
            <div
                ref={backdropRef}
                onClick={close}
                className="fixed inset-0 z-60 bg-background/60 backdrop-blur-sm hidden"
            />

            {/* Fullscreen overlay */}
            <div
                ref={overlayRef}
                className={cn(
                    'fixed inset-0 z-70',
                    'hidden flex-col items-center justify-center',
                    'bg-background',
                )}
            >
                {/* Close button */}
                <button
                    onClick={close}
                    aria-label="Close menu"
                    className={cn(
                        'absolute top-4 right-6',
                        'inline-flex items-center justify-center',
                        'w-9 h-9 rounded-lg',
                        'border border-border text-text-secondary',
                        'hover:bg-surface hover:text-text-primary',
                        'transition-all duration-(--duration-fast)',
                    )}
                >
                    <X size={16} />
                </button>

                {/* Nav links */}
                <nav className="flex flex-col items-center gap-2 w-full px-8">
                    {links.map((link, i) => {
                        const sectionId = link.href.replace('/#', '')
                        const isActive = isHome && activeSection === sectionId

                        return (
                            <button
                                key={link.href}
                                ref={(el) => { linkRefs.current[i] = el }}
                                onClick={() => handleLinkClick(link.href)}
                                className={cn(
                                    'w-full text-center py-4 rounded-xl',
                                    'text-2xl font-display font-semibold',
                                    'transition-colors duration-(--duration-fast)',
                                    isActive
                                        ? 'text-accent'
                                        : 'text-text-primary hover:text-accent',
                                )}
                            >
                                {link.label}
                            </button>
                        )
                    })}
                </nav>

                {/* CTA */}
                <button
                    ref={ctaRef}
                    onClick={() => handleLinkClick('/#contact')}
                    className={cn(
                        'mt-8 inline-flex items-center justify-center',
                        'h-12 px-8 rounded-xl',
                        'text-[15px] font-semibold text-white',
                        'bg-accent',
                        'transition-all duration-(--duration-fast)',
                        'hover:shadow-[0_8px_24px_var(--color-accent-glow)]',
                        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                    )}
                >
                    Let&apos;s Talk
                </button>
            </div>
        </>
    )
}