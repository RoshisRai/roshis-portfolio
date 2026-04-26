'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

export function GSAPProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Set body visible after GSAP is ready to prevent FOUC
        gsap.set('body', { visibility: 'visible' })

        // Ensure ScrollTrigger recalculates after initial layout.
        requestAnimationFrame(() => {
            ScrollTrigger.refresh()
        })
    }, [])

    return <>{children}</>
}