'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

const ThemeContext = createContext<{
    theme: Theme,
    toggleTheme: () => void
}>({
    theme: 'dark',
    toggleTheme: () => {},
})

export const useTheme = () => useContext(ThemeContext)

export function ThemeProvider({children}: {children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window === 'undefined') return 'dark'
        try {
            const stored = localStorage.getItem('theme') as Theme | null
            const preferred = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
            return stored || preferred
        } catch {
            return 'dark'
        }
    })

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('theme', theme)
    }, [theme])

    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark')

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>  
    )
}