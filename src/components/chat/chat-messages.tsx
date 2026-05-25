'use client'

import { useEffect, useRef } from "react";
import { ChatBubble } from "./chat-bubble"
import { TypingIndicator } from "./typing-indicator";

interface Source {
    section: string
    title: string
}

interface Message {
    id: number;
    role: 'user' | 'assistant'
    content: string
    sources?: Source[]
}

const messages: Message[] = [
    { 
        id: 1, 
        role: 'user', 
        content: 'What projects has Roshis built?' 
    },
    { 
        id: 2, 
        role: 'assistant', 
        content: "Here are a few highlights. Notice the inline code like `Next.js` and `PostgreSQL`.",
    },
    { 
        id: 3, 
        role: 'user', 
        content: 'What\'s his tech stack?' 
    },
    { 
        id: 4, 
        role: 'assistant', 
        content: "Here is a multiline code sample:\n\n```ts\nexport async function getProjects() {\n  return fetch('/api/projects').then((res) => res.json())\n}\n```\n\nAnd a docs link: [View project details](https://roshis.dev#projects).",
        sources: [
            { title: "Technical Skills", section: "Skills" },
            { title: "App Stack Manifest", section: "Documentation" }
        ]
    },
    { 
        id: 5, 
        role: 'user', 
        content: 'Is he open to new opportunities?' 
    },
    { 
        id: 6, 
        role: 'assistant', 
        content: 'Yes! Roshis is actively looking for full-stack and backend engineering roles. He brings 4+ years of experience and a strong foundation in building scalable web applications. Feel free to reach out via the contact section.' 
    },
    { 
        id: 7, 
        role: 'user', 
        content: 'Tell me about his backend experience.' 
    },
    { 
        id: 8, 
        role: 'assistant', 
        content: "Inline code + list example:\n\n- Uses `Node.js` and `Django` for APIs\n- Data in `PostgreSQL` and `Firebase`\n- CI via GitHub Actions\n\nLink test: [Email Roshis](mailto:contact@roshis.dev)",
        sources: [
            { title: "API Systems Design", section: "Projects" },
            { title: "DevOps & Pipelines", section: "Skills" }
        ]
    },
]

interface ChatMessagesProps {
    isLoading: boolean
}

export default function ChatMessages({
    isLoading,
}: ChatMessagesProps) {
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [isLoading])
    return (
        <div className="flex-1 overflow-y-auto py-6 space-y-4">
            {messages.map((message) => (
                <ChatBubble
                    key={message.id}
                    role={message.role}
                    content={message.content}
                    sources={message.sources}
                    isStreaming={false}
                />
            ))}

            {isLoading &&
                messages[messages.length - 1]?.role === "assistant" && (
                    <div className="flex justify-start">
                        <div className="bg-text-primary/4 border border-text-primary/6 rounded-[16px_16px_16px_4px]">
                            <TypingIndicator />
                        </div>
                    </div>
                )
            }

            <div ref={bottomRef} />
        </div>
    )
}