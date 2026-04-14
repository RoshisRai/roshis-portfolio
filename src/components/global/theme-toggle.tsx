'use client'

import { cn } from "@/lib/utils"
import { Sun, Moon } from "lucide-react"
import { useTheme } from "@/providers/theme-provider"
import { Button } from "../ui/button"

const ThemeToggle = ({ className }: {className?: string }) => {
    const { theme, toggleTheme } = useTheme()

    return (
        <Button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            variant="icon"
            className='h-9 px-3 cursor-pointer'
        >
            {theme === 'dark' ? 
                <Sun key="sun" size={16} className="animate-theme-toggle"/> : 
                <Moon key="moon" size={16} className="animate-theme-toggle"/>
            }
        </Button>
    )
}

ThemeToggle.displayName = "ThemeToggle"

export { ThemeToggle }