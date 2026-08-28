'use client';

import { useEffect, useState } from 'react';

import type { TableOfContentsItem } from '@/types/blog';
import { getLenis } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { CursorZone } from '../global/cursor/cursor-zone';

interface TableOfContentsProps {
    items: TableOfContentsItem[];
    className?: string;
}

/**
 * Line used both to park a heading after a click and to decide which
 * title is active. Must match visually: just below the 64px navbar.
 * Do not scroll to the heading element itself — Lenis subtracts
 * `scroll-mt-24` from element targets, which lands the heading below
 * this line and keeps the previous section highlighted.
 */
const ACTIVATION_LINE = 96;

export function TableOfContents({ items, className }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState(items[0]?.id ?? '');

    useEffect(() => {
        if (items.length === 0) {
            return;
        }

        const headings = items
            .map((item) => document.getElementById(item.id))
            .filter((element): element is HTMLElement => element !== null);

        if (headings.length === 0) {
            return;
        }

        const updateActive = () => {
            let current = headings[0].id;
            let closest = Number.POSITIVE_INFINITY;

            for (const heading of headings) {
                const distance = Math.abs(
                    heading.getBoundingClientRect().top - ACTIVATION_LINE,
                );

                if (distance < closest) {
                    closest = distance;
                    current = heading.id;
                }
            }

            setActiveId((previous) => (previous === current ? previous : current));
        };

        const lenis = getLenis();

        lenis?.on('scroll', updateActive);
        window.addEventListener('scroll', updateActive, { passive: true });
        updateActive();

        return () => {
            lenis?.off('scroll', updateActive);
            window.removeEventListener('scroll', updateActive);
        };
    }, [items]);

    const scrollToHeading = (id: string) => {
        const heading = document.getElementById(id);

        if (!heading) {
            return;
        }

        const lenis = getLenis();
        const scrollY = lenis?.scroll ?? window.scrollY;
        const top =
            scrollY + heading.getBoundingClientRect().top - ACTIVATION_LINE + 1;

        if (lenis) {
            lenis.start();
            lenis.scrollTo(top, { duration: 1.2 });
            return;
        }

        window.scrollTo({ top, behavior: 'smooth' });
    };

    if (items.length === 0) {
        return null;
    }

    return (
        <nav aria-label="Table of contents" className={cn('space-y-3', className)}>
            <p className="text-foreground/40 text-[12px] font-semibold tracking-wider uppercase">
                On this page
            </p>

            <ul className="space-y-0.5">
                {items.map((item) => {
                    const active = activeId === item.id;

                    return (
                        <li key={item.id} className='mb-3'>
                            <CursorZone variant="project" className='content' label='Go To'>
                                <a
                                    href={`#${item.id}`}
                                    aria-current={active ? 'location' : undefined}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        scrollToHeading(item.id);
                                    }}
                                    className={cn(
                                        'block border-l-2 text-[13px] leading-snug transition-colors duration-300',
                                        item.level === 2 ? 'pl-3' : 'pl-5',
                                        active
                                            ? 'text-text-primary border-indigo-500 font-medium'
                                            : 'text-text-secondary hover:text-text-secondary border-transparent',
                                    )}
                                >
                                    {item.text}
                                </a>
                            </CursorZone>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
