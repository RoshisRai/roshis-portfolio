'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from "gsap/SplitText";

export function GSAPProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger, SplitText)

        // Set body visible after GSAP is ready to prevent FOUC
        gsap.set('body', { visibility: 'visible' })
    }, [])

    return <>{children}</>
}