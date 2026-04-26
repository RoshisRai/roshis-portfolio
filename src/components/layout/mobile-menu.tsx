'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import { useActiveSection } from '@/hooks/use-active-section'
import { useSmoothScroll } from '@/hooks/use-smooth-scroll'
import { Button } from '../ui/button'
import { SocialIconButton } from '../ui/social-icon-button'
import { socialLinks } from '@/lib/constants'
import Link from 'next/link'

interface NavLink {
    label: string
    href: string
}

interface MobileMenuProps {
    links: NavLink[]
}

export function MobileMenu({ links }: MobileMenuProps) {
    const pathname = usePathname()
    const router = useRouter()
    const activeSection = useActiveSection()
    const isHome = pathname === '/'
    const scrollTo = useSmoothScroll()

    const isOpenRef = useRef(false)
    const overlayRef = useRef<HTMLDivElement>(null)
    const backdropRef = useRef<HTMLDivElement>(null)
    const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])
    const ctaRef = useRef<HTMLButtonElement>(null)
    const tlRef = useRef<gsap.core.Timeline | null>(null)
    const socialLinkRefs = useRef<(HTMLAnchorElement | null)[]>([])

    
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
        const socialLinkEls = socialLinkRefs.current.filter(Boolean)

        if (!overlay || !backdrop) return

        gsap.set(overlay, { yPercent: -100, display: 'none' })
        gsap.set(backdrop, { opacity: 0, display: 'none' })
        gsap.set([linkEls, cta], { opacity: 0, y: 24 })
        // gsap.set([cta], { opacity: 0, y: 24 })
        gsap.set([socialLinkEls, cta], { opacity: 0})

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
            .to(socialLinkEls, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: 'expo.out',
                stagger: 0.09,
            }, '-=0.28')

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

    const handleLinkClick = (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        close()

        if (isHome) {
            setTimeout(() => scrollTo(href), 300)
            console.log(`Scrolling to ${href}`)
        } else {
            const sectionId = href.replace('/', '')
            router.push(`/`)
            setTimeout(() => {
                scrollTo(`${sectionId}`)
            }, 350)
        }
    }

    return (
        <>
            {/* Hamburger */}
            <Button
                onClick={toggle}
                aria-label="Toggle menu"
                variant="icon"
                className={cn('h-9 px-2.5 cursor-pointer')}
            >
                <Menu size={16} />
            </Button>

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
                <Button
                    onClick={close}
                    aria-label="Close menu"
                    variant='icon'
                    className={cn(
                        'absolute top-4 right-6',
                        'h-9 px-2.5 cursor-pointer',
                    )}
                >
                    <X size={16} />
                </Button>

                {/* Nav links */}
                <nav className="flex flex-col items-center gap-2 w-full px-8">
                    {links.map((link, i) => {
                        const sectionId = link.href.replace('/#', '')
                        const isActive = isHome && activeSection === sectionId

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                ref={(el) => { linkRefs.current[i] = el }}
                                onClick={handleLinkClick(link.href)}
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
                            </Link>
                        )
                    })}
                </nav>

                {/* CTA */}
                <Button
                    ref={ctaRef}
                    onClick={() => handleLinkClick('/#contact')}
                    variant='primary'
                    className={cn('mt-8 text-lg')}
                >
                    Let&apos;s Talk
                </Button>

                {/* Social Icons */}
                <div
                    className='flex items-center justify-center gap-5 absolute bottom-12'
                >
                    {socialLinks.map((link, i) => (
                        <SocialIconButton
                            key={link.href}
                            ref={(el) => { socialLinkRefs.current[i] = el }}
                            href={link.href}
                            label={link.label}
                            icon={<link.icon size={16} />}
                        />
                    ))}
                </div>
            </div>
        </>
    )
}