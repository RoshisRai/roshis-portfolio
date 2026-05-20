'use client'

import Link from "next/link"
import Image from "next/image"
import { disableProjectSharedVTForNextNav, FOOTER_VT_NAME } from "@/lib/project-transition"
import { ViewTransition, type MouseEvent } from "react"
import { Tag } from "@/components/ui/tag"
import { CursorZone } from "../global/cursor/cursor-zone"
import { usePathname } from "next/navigation"
import { scrollToTop } from "@/lib/animations"
import { useSmoothScroll } from "@/hooks/use-smooth-scroll"

export function Footer() {
  const year = new Date().getFullYear()
  const pathName = usePathname()
  const isHome = pathName === '/'
  const scrollTo = useSmoothScroll()
  
  const handleBrandingClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if(isHome) {
      e.preventDefault()
      scrollToTop()
    } else {
      disableProjectSharedVTForNextNav()
      scrollToTop()
    }
  }

  const handleContactClick = (href: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    if(isHome) {
      e.preventDefault()
      scrollTo(href)
    } else {
      e.preventDefault()
      disableProjectSharedVTForNextNav()
      scrollTo(href)
    }
  }

  return (
    <ViewTransition name={FOOTER_VT_NAME}>
      <footer className="w-full border-t border-border bg-background">
        <div className="max-w-content mx-auto px-6 py-6 flex flex-col gap-4">

          {/* Top row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

            {/* Branding */}
            <CursorZone variant="scene">
              <Link
                href="/"
                onClick={handleBrandingClick}
              >
                <div className="flex items-center gap-2">
                    <Image
                      src="/icon.svg"
                      alt="Roshis Rai"
                      width={20}
                      height={20}
                      className="opacity-80"
                    />
                    <span className="font-mono text-sm font-semibold tracking-tight text-text-primary">
                      roshis.dev
                    </span>
                </div>
              </Link>
            </CursorZone>

            {/* Availability */}
            <CursorZone variant="link">
              <Link 
                href="/#contact"
                onClick={handleContactClick('/#contact')}
              >
                <Tag
                  variant="status"
                  statusColor="#4ade80"
                  className="bg-accent-glow/60 border border-[#4ade80]/20 transition-opacity duration-200 hover:bg-accent-glow/80"
                >
                  <span className="text-xs text-text-primary/80 z-1">
                    Available for work
                  </span>
                </Tag>
              </Link>
            </CursorZone>

          </div>

          {/* Bottom row */}
          <p className="text-xs text-text-secondary opacity-80 text-center sm:text-left selection:text-slate-100 selection:bg-accent">
            Designed & built by Roshis Rai · {year}
          </p>

        </div>
      </footer>
    </ViewTransition>
  )
}