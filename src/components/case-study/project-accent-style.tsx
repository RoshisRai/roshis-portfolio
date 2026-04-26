'use client'

import { projectAccentStyle } from "@/lib/project-theme"
import { useEffect } from "react"

interface ProjectAccentStyleProps {
    accent: string
}

export const ProjectAccentStyle = ({ accent }: ProjectAccentStyleProps) => {
    useEffect(() => {
        const vars = projectAccentStyle(accent) as Record<string, string>
        const root = document.documentElement
        const previous: Record<string, string> = {}

        // Apply the new accent colors as CSS variables
        for (const key in vars) {
            previous[key] = root.style.getPropertyValue(key)
            root.style.setProperty(key, vars[key])
        }
        
        // Cleanup function to reset to previous values when the component unmounts or accent changes
        return () => {
            for (const key in vars) {
                if (previous[key]) root.style.setProperty(key, previous[key])
                else root.style.removeProperty(key)
            }
        }
    }, [accent])
    return null
}