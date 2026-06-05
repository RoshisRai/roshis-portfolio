import ChatInterface from "@/components/chat/chat-interface";
import type { Metadata } from "next";
import { siteConfig } from "@/seo/config/site";

const url = `${siteConfig.url}/chat`;
const ogImage = `${siteConfig.url}/images/og-chat-preview.png`;

export const metadata: Metadata = {
  title: "Chat with AI Assistant",
  description:
    "Ask questions about Roshis Rai's experience, projects, system design approach, and technical skills using an AI-powered portfolio assistant.",

  alternates: {
    canonical: url,
  },

  openGraph: {
    title: "Chat with Roshis Rai's AI Assistant",
    description:
      "Interact with an AI portfolio assistant trained on Roshis Rai's engineering experience and projects.",
    url,
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "AI Portfolio Chat Interface",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Chat with Roshis Rai's AI Assistant",
    description:
      "Explore engineering experience, projects, and system design through an AI assistant.",
    images: [ogImage],
  },

  robots: {
    index: true,
    follow: true,
  },
}

export default function ChatPage() {
  return (
    <div className="min-h-[calc(100dvh-64px)]">
      <ChatInterface />
    </div>
  )
}