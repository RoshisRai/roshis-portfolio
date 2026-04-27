'use client'

import { useEffect, useState, ViewTransition, type MouseEvent } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/global/theme-toggle'
import { MobileMenu } from './mobile-menu'
import { useActiveSection } from '@/hooks/use-active-section'
import { useSmoothScroll } from '@/hooks/use-smooth-scroll'
import { scrollToTop } from '@/lib/animations'
import { Button } from '../ui/button'
import Image from 'next/image'
import { Magnetic } from '../global/cursor/magnetic'
import { disableProjectSharedVTForNextNav, HEADER_VT_NAME } from '@/lib/project-transition'

const navLinks = [
    { label: 'Projects',   href: '/#projects'   },
    { label: 'Skills',     href: '/#skills'     },
    { label: 'Experience', href: '/#experience' },
    { label: 'About',      href: '/#about'      },
]

export { navLinks }

export function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const pathname = usePathname()
    const activeSection = useActiveSection()
    const isHome = pathname === '/'
    const scrollTo = useSmoothScroll()

    const handleLogoClick = (e: MouseEvent<HTMLAnchorElement>) => {
        if (isHome) {
            e.preventDefault()
            scrollToTop()
        }
    }

    const handleNavLinkClick = (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (isHome) {
            e.preventDefault()
            scrollTo(href)
        } 
        else {
            e.preventDefault()
            disableProjectSharedVTForNextNav()
            scrollTo(href)
        }
    }

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 100)
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <ViewTransition name={HEADER_VT_NAME}>
            <header
                className={cn(
                    'fixed top-0 z-50 w-full',
                    'transition-[background-color,border-color] duration-300',
                    scrolled
                        ? 'md:border-b md:border-border/50 md:bg-background/80 md:backdrop-blur-xl'
                        : 'bg-transparent',
                )}
            >
                <nav className="mx-auto flex h-16 max-w-(--max-width-content) items-center justify-between px-6">

                    {/* Logo */}
                    <Link
                        href="/"
                        onClick={handleLogoClick}
                        className={cn(
                            'flex items-center',
                            'transition-opacity duration-(--duration-fast)',
                            'hover:opacity-90',
                            'rounded-md overflow-hidden'
                        )}
                    >
                        <Image
                            src="/images/logo.svg"
                            alt="Roshis Rai"
                            width={32}
                            height={32}
                            style={{ width: 32, height: 32 }}
                            priority
                        />
                    </Link>

                    {/* Desktop nav links */}
                    <div className="hidden items-center gap-8 md:flex">
                        {navLinks.map((link) => {
                            const sectionId = link.href.replace('/#', '')
                            const isActive = isHome && activeSection === sectionId

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={handleNavLinkClick(link.href)}
                                    className={cn(
                                        'relative text-sm font-medium',
                                        'transition-colors duration-(--duration-fast)',
                                        'cursor-pointer',
                                        isActive
                                            ? 'text-text-primary'
                                            : 'text-text-secondary hover:text-text-primary',
                                    )}
                                >
                                    {link.label}
                                    <span
                                        className={cn(
                                            'absolute -bottom-1 left-0',
                                            'h-0.5 w-full rounded-full bg-accent',
                                            'transition-all duration-(--duration-fast)',
                                            'origin-left',
                                            isActive
                                                ? 'opacity-100 scale-x-100'
                                                : 'opacity-0 scale-x-0',
                                        )}
                                    />
                                </Link>
                            )
                        })}
                    </div>

                    {/* Right side — theme toggle + CTA */}
                    <div className="hidden items-center gap-3 md:flex">
                        <ThemeToggle />
                        <Magnetic strength={0.6} elementPull={0.2}>
                            <Button size="sm" onClick={() => scrollTo('/#contact')} className='cursor-pointer'>
                                Let&apos;s Talk
                            </Button>
                        </Magnetic>
                    </div>

                    {/* Mobile */}
                    <div className="flex items-center gap-3 md:hidden">
                        <ThemeToggle />
                        <MobileMenu links={navLinks} />
                    </div>

                </nav>
            </header>
        </ViewTransition>
    )
}