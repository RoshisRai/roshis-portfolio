'use client'

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ChatFab } from "@/components/chat/chat-fab"

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isChatPage = pathname.startsWith("/chat")

  return (
    <>
      <Navbar />
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
