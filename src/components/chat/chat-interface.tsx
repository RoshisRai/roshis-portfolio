'use client'

import { Bot } from "lucide-react";
import { SuggestedPrompts } from "./suggested-prompts";
import ChatMessages from "./chat-messages";
import { useState } from "react";
import { Button } from "../ui/button";

export default function ChatInterface() {
    const [hasMessages, setHasMessages] = useState<boolean>(false);
    const handlePromptSelect = () => {
        console.log("Select Prompt")
    }
    return (
        <div className="flex flex-col min-h-[calc(100dvh-64px)] mt-16 max-w-180 mx-auto">
            {/* Content scrolls with the page */}
            <div className="flex-1 min-h-0 flex flex-col">
                {!hasMessages && (
                    <div className="flex flex-col mt-25">
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20">
                                <Bot size={24} className="text-accent" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-text-primary mb-1">Hi! I&rsquo;m Roshis&rsquo; AI assistant.</h1>
                                <p className="text-[15px] text-text-primary/80 max-w-102">
                                    Ask me anything about his work, experience, projects, or
                                    technical skills. I&rsquo;ll answer based on his actual
                                    background.
                                </p>
                            </div>
                        </div>
                        <SuggestedPrompts onSelect={handlePromptSelect} />
                    </div>
                )}

                {hasMessages && 
                    <ChatMessages />
                }
            </div>

            {/* Sticky input */}
            <div className="sticky bottom-0 shrink-0 flex flex-col items-center justify-center rounded-md px-10 py-2 bg-background border border-accent/40 text-text-primary font-mono">
                <h1 className="text-xl font-bold">Chat Input</h1>
                <p>Chat Input implementation coming soon...</p>
                <Button 
                    variant="primary"
                    onClick={() => setHasMessages(!hasMessages)}
                >
                    {hasMessages ? "Hide Messages": "Show Messages"}
                </Button>
            </div>
        </div>
    )
}