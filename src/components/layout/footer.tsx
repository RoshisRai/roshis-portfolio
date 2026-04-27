'use client'

import { FOOTER_VT_NAME } from "@/lib/project-transition"
import { ViewTransition } from "react" 

export function Footer() {
    return (
        <ViewTransition name={FOOTER_VT_NAME}>
            <footer className="bg-primary flex justify-center items-center text-primary-foreground py-6">
                <div className="container text-center">
                    <p className="text-sm">&copy; {new Date().getFullYear()} Roshni S. All rights reserved.</p>
                </div>
            </footer>
        </ViewTransition>
    )
}