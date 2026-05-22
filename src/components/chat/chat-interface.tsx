'use client'

import { Bot } from "lucide-react";
import { SuggestedPrompts } from "./suggested-prompts";

export default function ChatInterface() {
    const hasMessages = false;
    const handlePromptSelect = () => {
        console.log("Select Prompt")
    }
    return (
        <div className="flex flex-col h-[calc(100vh-64px)] mt-16 max-w-180 mx-auto">
            {!hasMessages && (
                <div className="flex-1 flex flex-col mt-25">
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
                    <SuggestedPrompts onSelect={handlePromptSelect}/>
                </div>
            )}
            <div className="flex flex-col items-center justify-center rounded-md h-25 px-10 bg-accent-glow/20 border border-accent/40 text-slate-50 font-mono mb-5">
                <h1 className="text-xl font-bold">Chat Input</h1>
                <p>Chat Input implementation coming soon...</p>
            </div>
        </div>
    )
}