'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export function useTableOfContentsDrawer() {
    const [isOpen, setIsOpen] = useState(false);

    const previousOverflow = useRef<string>('');

    const open = useCallback(() => {
        setIsOpen(true);
    }, []);

    const close = useCallback(() => {
        setIsOpen(false);
    }, []);

    const toggle = useCallback(() => {
        setIsOpen((previous) => !previous);
    }, []);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        previousOverflow.current = document.body.style.overflow;

        document.body.style.overflow = 'hidden';

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow.current;

            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    return {
        isOpen,
        open,
        close,
        toggle,
    };
}
