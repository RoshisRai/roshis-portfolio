'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { useSmoothScroll } from '@/hooks/use-smooth-scroll'
import { LuMouse, LuChevronDown } from "react-icons/lu";

export function ScrollIndicator() {
    const [hidden, setHidden] = useState(false)
    const scrollTo = useSmoothScroll()

    useEffect(() => {
        const onScroll = () => setHidden(window.scrollY > 100)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <button
            aria-label="Scroll to projects"
            onClick={() => scrollTo('/#projects')}
            className={cn(
                'absolute bottom-8 left-1/2 z-20 -translate-x-1/2 transition-opacity duration-300',
                'cursor-pointer',
                hidden ? 'pointer-events-none opacity-0' : 'opacity-100',
            )}
        >
            <div className="relative flex flex-col items-center">
                <div className="block md:hidden animate-bounce">
                    <LuChevronDown size={24} className="text-text-secondary opacity-80" />
                </div>

                <div className="hidden md:block relative">
                    <LuMouse size={32} className="text-text-secondary opacity-80" />
                    <span className="scroll-dot" />
                </div>
                
                <span className="mt-1 md:mt-2 text-[9px] md:text-[10px] font-medium tracking-widest uppercase text-text-secondary animate-text-breath">
                    Scroll
                </span>
            </div>
        </button>
    )
}