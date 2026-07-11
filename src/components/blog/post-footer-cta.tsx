import Link from "next/link"
import { Mail, MessageCircle } from "lucide-react"

import { siteConfig } from "@/seo/config/site"
import { cn } from "@/lib/utils"
import { CursorZone } from "../global/cursor/cursor-zone"

const BUTTON_BASE_CLASS =
    "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"

export function PostFooterCta() {
    return (
        <section
            aria-labelledby="post-cta-heading"
            className="mt-14 rounded-xl border border-white/6 bg-white/2 p-6"
        >
            <h2
                id="post-cta-heading"
                className="text-lg font-semibold text-foreground"
            >
                Enjoyed this article?
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-7 text-foreground/70">
                If you&apos;d like to discuss software engineering, system design,
                architecture decisions, or potential collaboration, I&apos;d be happy
                to connect.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
                <CursorZone variant="button" className="content">
                    <Link
                        href="/chat"
                        className={cn(
                            BUTTON_BASE_CLASS,
                            "bg-indigo-600 text-white hover:bg-indigo-500",
                        )}
                    >
                        <MessageCircle
                            size={16}
                            aria-hidden="true"
                        />
                        Chat with my AI Assistant
                    </Link>
                </CursorZone>
                <CursorZone variant="button" className="content">
                    <a
                        href={`mailto:${siteConfig.email}`}
                        className={cn(
                            BUTTON_BASE_CLASS,
                            "border border-white/10 text-foreground/70 hover:border-white/20 hover:text-foreground",
                        )}
                    >
                        <Mail
                            size={16}
                            aria-hidden="true"
                        />
                        Email Me
                    </a>
                </CursorZone>
            </div>
        </section>
    )
}