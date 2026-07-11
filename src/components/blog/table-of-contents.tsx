'use client';

import { useEffect, useState } from 'react';

import type { TableOfContentsItem } from '@/types/blog';
import { cn } from '@/lib/utils';
import { CursorZone } from '../global/cursor/cursor-zone';

interface TableOfContentsProps {
    items: TableOfContentsItem[];
    className?: string;
}

export function TableOfContents({ items, className }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState('');

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

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

                if (visible.length > 0) {
                    setActiveId(visible[0].target.id);
                }
            },
            {
                rootMargin: '-96px 0px -65% 0px',
                threshold: 0,
            },
        );

        headings.forEach((heading) => observer.observe(heading));

        return () => observer.disconnect();
    }, [items]);

    if (items.length === 0) {
        return null;
    }

    const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

                                        const heading = document.getElementById(item.id);

                                        if (!heading) {
                                            return;
                                        }

                                        heading.scrollIntoView({
                                            behavior: prefersReducedMotion ? 'auto' : 'smooth',
                                            block: 'start',
                                        });

                                        setActiveId(item.id);
                                    }}
                                    className={cn(
                                        'block border-l-2 text-[13px] leading-snug transition-colors duration-150',
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
