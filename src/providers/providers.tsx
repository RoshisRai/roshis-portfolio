'use client'

import { ThemeProvider } from "./theme-provider";
import { GSAPProvider } from "./gsap-provider";
import { LenisProvider } from "./lenis-provider";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <GSAPProvider>
                <LenisProvider>
                    {children}
                </LenisProvider>
            </GSAPProvider>
        </ThemeProvider>
    )
}