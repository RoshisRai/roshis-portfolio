'use client'

import { Bot } from "lucide-react";
import { SuggestedPrompts } from "./suggested-prompts";
import ChatMessages from "./chat-messages";
import { useState } from "react";
import { ChatInput } from "./chat-input";
import { CursorZone } from "../global/cursor/cursor-zone";

export default function ChatInterface() {
    const [hasMessages, setHasMessages] = useState<boolean>(false);
    const [rateLimited, setRateLimited] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [count, setCount] = useState<number>(0);
    const [input, setInput] = useState<string>("");

    const handleSubmit = (e:React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(!input.trim()) return

        const nextCount = count + 1
        setCount(nextCount)
        setHasMessages(true)
        setInput("")

        setIsLoading(true)
        
        setTimeout(() => {
            setIsLoading(false)
            if(nextCount >= 4) setRateLimited(true)  
        }, Math.floor(Math.random() * 4001) + 2000)
    }

    const handlePromptSelect = () => {
        console.log("Select Prompt")
    }
    return (
        <div className="flex flex-col min-h-[calc(100dvh-64px)] mt-16 max-w-180 mx-auto px-4 md:px-0">
            {!hasMessages && (
                <div className="flex-1 flex flex-col">
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
                </div>
            )}

            {hasMessages && 
                <ChatMessages 
                    isLoading={isLoading}
                />
            }

            {rateLimited && (
                <CursorZone variant="copy_email" className="contents" label="✉️">
                    <div className="mx-4 mb-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                        <p className="text-xs text-amber-300">
                            I&rsquo;ve had a lot of conversations today — email Roshis directly
                            at{" "}
                        </p>
                        <a
                            href="mailto:contact@roshis.dev"
                            className="underline underline-offset-2"
                        >
                            contact@roshis.dev
                        </a>
                    </div>
                </CursorZone>
            )}

            <ChatInput
                input={input}
                setInput={setInput}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                disabled={rateLimited}
            />
        </div>
    )
}