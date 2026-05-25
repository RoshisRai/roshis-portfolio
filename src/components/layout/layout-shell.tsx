'use client'

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { CursorZone } from "@/components/global/cursor/cursor-zone"
import { ChatFab } from "../chat/chat-fab"

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isChatPage = pathname.startsWith("/chat")

  return (
    <>
      <CursorZone variant="link">
        <Navbar />
      </CursorZone>
      <main>{children}</main>
      {!isChatPage && (
        <>
          <ChatFab />
          <Footer />
        </>
      )}
    </>
  )
}
