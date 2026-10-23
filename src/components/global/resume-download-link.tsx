'use client'

import { Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { siteConfig } from "@/seo/config/site"
import { CursorZone } from "@/components/global/cursor/cursor-zone"

interface ResumeDownloadLinkProps {
    className?: string
}

const ResumeDownloadLink = ({ className }: ResumeDownloadLinkProps) => {
    return (
        <CursorZone variant="icon" label="📄" className="contents">
            <a
                href={siteConfig.resume}
                download="Roshis-Rai-Resume.pdf"
                className={cn(
                    'inline-flex items-center gap-1.5',
                    'h-8 text-[14px] font-medium',
                    'text-text-secondary cursor-pointer',
                    'transition-colors duration-(--duration-fast)',
                    'hover:text-text-primary',
                    'focus-visible:outline-2 focus-visible:outline-offset-2',
                    'focus-visible:outline-accent',
                    className,
                )}
            >
                <Download
                    size={15}
                    className="text-accent shrink-0"
                    aria-hidden
                />
                Download resume
            </a>
        </CursorZone>
    )
}

ResumeDownloadLink.displayName = "ResumeDownloadLink"

export { ResumeDownloadLink }