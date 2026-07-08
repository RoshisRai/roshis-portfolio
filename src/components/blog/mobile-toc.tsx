'use client';

import { useId } from 'react';

import { List, X } from 'lucide-react';

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
                className="fixed right-6 bottom-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 transition-transform hover:scale-105 active:scale-95"
            >
                {isOpen ? <X size={20} /> : <List size={20} />}
            </button>

            {isOpen && (
                <>
                    <button
                        type="button"
                        aria-label="Close table of contents"
                        onClick={close}
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                    />

                    <div
                        id={dialogId}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Table of contents"
                        className={cn(
                            'fixed inset-x-0 bottom-0 z-50 max-h-[70vh] overflow-y-auto rounded-t-2xl border-t border-white/8 bg-[#0d0d14] p-6 will-change-transform',
                            prefersReducedMotion
                                ? ''
                                : 'animate-in slide-in-from-bottom duration-300',
                        )}
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <p className="text-foreground/40 text-[13px] font-semibold tracking-wider uppercase">
                                On this page
                            </p>

                            <button
                                type="button"
                                onClick={close}
                                className="text-foreground/50 hover:text-foreground rounded-md p-1 transition-colors hover:bg-white/5"
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

                                            close();

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
                                                ? 'text-foreground/70 pl-2'
                                                : 'text-foreground/50 pl-6',
                                        )}
                                    >
                                        {item.text}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
}
