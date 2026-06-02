import ChatInterface from "@/components/chat/chat-interface";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Chat with Roshis' AI",
    description:
        "Ask questions about Roshis Rai's experience, projects, and skills. Powered by a custom RAG pipeline.",
    openGraph: {
        title: "Chat with Roshis' AI Assistant",
        description:
        "Interact with a custom RAG pipeline to explore Roshis's engineering background and technical projects.",
    },
};

export default function ChatPage() {
    return (
        <div className="min-h-[calc(100dvh-64px)]">
            <ChatInterface />
        </div>
    )
}