'use client'

import dynamic from "next/dynamic";

import { ThemeProvider } from "./theme-provider";
import { GSAPProvider } from "./gsap-provider";
import { LenisProvider } from "./lenis-provider";
import { CursorProvider } from "./cursor-provider";
// import { Cursor } from "@/components/global/cursor/cursor";

const Cursor = dynamic(
  () => import("@/components/global/cursor/cursor").then(mod => mod.Cursor),
  { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <CursorProvider>
                <GSAPProvider>
                    <LenisProvider>
                        {children}
                        <Cursor />
                    </LenisProvider>
                </GSAPProvider>
            </CursorProvider>
        </ThemeProvider>
    )
}