'use client';

import { useEffect, useId, useRef } from 'react';

import { List, X } from 'lucide-react';
import { gsap } from 'gsap';

import type { TableOfContentsItem } from '@/types/blog';

import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useTableOfContentsDrawer } from '@/hooks/use-table-of-contents';

interface MobileTocProps {
    items: TableOfContentsItem[];
}

export function MobileToc({ items }: MobileTocProps) {
    const { isOpen, toggle, close } = useTableOfContentsDrawer();

    const prefersReducedMotion = useReducedMotion();

    const dialogId = useId();

    const isOpenRef = useRef(false);
    const backdropRef = useRef<HTMLButtonElement>(null);
    const drawerRef = useRef<HTMLDivElement>(null);
    const tlRef = useRef<gsap.core.Timeline | null>(null);
    const scrollYRef = useRef(0);

    const handleClose = () => {
        if (!isOpenRef.current) return;
        close();
    };

    useEffect(() => {
        const backdrop = backdropRef.current;
        const drawer = drawerRef.current;

        if (!backdrop || !drawer) return;

        // Set initial states
        gsap.set(backdrop, { opacity: 0, display: 'none' });
        gsap.set(drawer, { yPercent: 100, display: 'none' });

        // Create timeline
        tlRef.current = gsap.timeline({ paused: true })
            .to(backdrop, {
                display: 'block',
                opacity: 1,
                duration: prefersReducedMotion ? 0 : 0.3,
                ease: 'power2.out',
            })
            .to(drawer, {
                display: 'flex',
                yPercent: 0,
                duration: prefersReducedMotion ? 0 : 0.3,
                ease: 'power2.out',
            }, '<');

        return () => {
            tlRef.current?.kill();
        };
    }, [prefersReducedMotion]);

    useEffect(() => {
        if (isOpen) {
            if (isOpenRef.current) return;
            isOpenRef.current = true;
            
            // Disable scrolling
            scrollYRef.current = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollYRef.current}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
            
            // Pause lenis smooth scroll if available
            const lenis = (window as Window & { __lenis?: { stop: () => void } }).__lenis;
            lenis?.stop();
            
            tlRef.current?.play();
        } else {
            if (!isOpenRef.current) return;
            isOpenRef.current = false;
            
            // Re-enable scrolling
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            window.scrollTo(0, scrollYRef.current);
            
            // Resume lenis smooth scroll if available
            const lenis = (window as Window & { __lenis?: { start: () => void } }).__lenis;
            lenis?.start();
            
            tlRef.current?.reverse();
        }
    }, [isOpen]);

    if (items.length === 0) {
        return null;
    }

    return (
        <div className="lg:hidden">
            <button
                type="button"
                onClick={toggle}
                aria-expanded={isOpen}
                aria-controls={dialogId}
                aria-label="Toggle table of contents"
                className="fixed right-6 bottom-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent-glow transition-transform hover:scale-105 active:scale-95"
            >
                {isOpen ? <X size={20} /> : <List size={20} />}
            </button>

            <button
                ref={backdropRef}
                type="button"
                aria-label="Close table of contents"
                onClick={handleClose}
                className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
            />

            <div
                ref={drawerRef}
                id={dialogId}
                role="dialog"
                aria-modal="true"
                aria-label="Table of contents"
                className="fixed inset-x-0 bottom-0 z-50 max-h-[70vh] flex-col overflow-y-auto rounded-t-2xl border-t border-background/8 bg-surface p-6 will-change-transform"
            >
                <div className="mb-4 flex items-center justify-between">
                    <p className="text-primary/40 text-[13px] font-semibold tracking-wider uppercase">
                        On this page
                    </p>

                    <button
                        type="button"
                        onClick={handleClose}
                        className="text-primary/50 hover:text-primary rounded-md p-1 transition-colors hover:bg-surface/5"
                        aria-label="Close table of contents"
                    >
                        <X size={18} />
                    </button>
                </div>

                <ul className="space-y-1">
                    {items.map((item) => (
                        <li key={item.id}>
                            <a
                                href={`#${item.id}`}
                                onClick={(event) => {
                                    event.preventDefault();

                                    handleClose();

                                    requestAnimationFrame(() => {
                                        const heading = document.getElementById(item.id);

                                        heading?.scrollIntoView({
                                            behavior: prefersReducedMotion ? 'auto' : 'smooth',
                                            block: 'start',
                                        });
                                    });
                                }}
                                className={cn(
                                    'hover:text-foreground block py-2 text-[14px] transition-colors',
                                    item.level === 2
                                        ? 'text-text-primary/80 pl-2'
                                        : 'text-text-primary/70 pl-6',
                                )}
                            >
                                {item.text}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
