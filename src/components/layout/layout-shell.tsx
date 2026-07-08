'use client'

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ChatFab } from "@/components/chat/chat-fab"

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isChatPage = pathname.startsWith("/chat")
  const isIndividualBlogPost = pathname.startsWith("/blog/")

  if (isChatPage) {
    return (
      <>
        <Navbar />
        <main>{children}</main>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
      
      {/* Renders everywhere (including /blog) EXCEPT on individual /blog/[slug] posts */}
      {!isIndividualBlogPost && <ChatFab />}
      
      <Footer />
    </>
  )
}
