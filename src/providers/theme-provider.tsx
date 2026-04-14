'use client'

import { createContext, useContext, useSyncExternalStore } from 'react'

type Theme = 'light' | 'dark'

// ---- External store for theme state ----

const subscribers = new Set<() => void>()

const themeStore = {
    getSnapshot: (): Theme => {
        return (document.documentElement.getAttribute('data-theme') as Theme) ?? 'dark'
    },
    getServerSnapshot: (): Theme => 'dark',
    subscribe: (callback: () => void) => {
        subscribers.add(callback)
        const observer = new MutationObserver(callback)
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme'],
        })
        return () => {
            subscribers.delete(callback)
            observer.disconnect()
        }
    },
    setTheme: (theme: Theme) => {
        document.documentElement.setAttribute('data-theme', theme)
        try { localStorage.setItem('theme', theme) } catch {}
    },
}

// ---- Context provider for theme state ----

const ThemeContext = createContext<{
    theme: Theme,
    toggleTheme: () => void
}>({
    theme: 'dark',
    toggleTheme: () => {},
})

export const useTheme = () => {
    const ctx = useContext(ThemeContext)
    if (!ctx) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return ctx
}

// ---- Provider component ----

export function ThemeProvider({children}: {children: React.ReactNode }) {

    const theme = useSyncExternalStore(
        themeStore.subscribe,
        themeStore.getSnapshot,
        themeStore.getServerSnapshot,
    )

    const toggleTheme = () => {
        themeStore.setTheme(theme === 'light' ? 'dark' : 'light')
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>  
    )
}