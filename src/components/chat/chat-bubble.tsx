'use client'

import { useState, useEffect } from "react";
import { Check, Copy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils"
import { renderCodeToHtml } from "@/lib/shiki";
import { SourcePills } from "./source-pills";
import { useTheme } from "@/providers/theme-provider";

interface Source {
    section: string
    title: string
}

interface ChatBubbleProps {
    role: "user" | "assistant"
    content: string
    sources?: Source[]
    isStreaming?: boolean
}

export function ChatBubble({
    role,
    content,
    sources,
    isStreaming = false,
}: ChatBubbleProps) {
    const isUser = role === 'user'
    const { theme } = useTheme()

    return (
        <div className={cn(
            "flex w-full", 
            isUser ? "justify-end" : "justify-start"
        )}>
            <div className={cn(
                "sm:max-w-[80%] max-w-full px-4 py-3 text-[15px] leading-relaxed",
                isUser
                    ? "bg-accent text-white rounded-[16px_16px_4px_16px]"
                    : "bg-text-primary/4 border border-text-primary/6 text-text-primary rounded-[16px_16px_16px_4px]"
            )}>
                {isUser ? (
                    <p className="whitespace-pre-wrap wrap-break-word">
                        {content}
                    </p>
                ): (
                    <div 
                        className={cn(
                            "prose max-w-none overflow-hidden",
                            theme === "dark" && "prose-invert",
                        )}
                    >
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={markdownComponents}
                        >
                            {content}
                        </ReactMarkdown>
                    </div>
                )}

                {!isUser && 
                    sources && 
                    sources.length > 0 && 
                    !isStreaming && (
                        <div className="mt-3 pt-2 border-t border-text-primary/6 flex flex-wrap gap-2">
                            <SourcePills sources={sources} />
                        </div>
                )}
            </div>
        </div>
    )
}

const markdownComponents = {
    code({ 
        className, 
        children, 
        ...props 
    }: {
        className?: string
        children?: React.ReactNode
    }) {
        const codeText = String(children ?? "")
        
        const isInline = 
            !className &&
            !codeText.includes("\n")

        if (isInline) {
            return (
                <code
                    className="px-1.5 py-0.5 rounded bg-text-primary/6 text-[13px] font-mono"
                    {...props}
                >
                    {children}
                </code>
            )
        }
        return (
            <CodeBlock className={className}>
                {children}
            </CodeBlock>
        )
    },
    a({ 
        href, 
        children 
    }: {
        href?: string
        children?: React.ReactNode
    }) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline underline-offset-2 hover:text-accent-hover transition-colors"
            >
                {children}
            </a>
        )
    }
}

interface CodeBlockProps {
    className?: string
    children?: React.ReactNode
}

function CodeBlock ({
    className,
    children
}: CodeBlockProps) {
    const [copied, setCopied] = useState(false);
    const [highlightedHtml, setHighlightedHtml] = useState<string>("");
    
    const code = String(children).replace(/\n$/, "");
    const language = className?.replace("language-", "") || "text";

    // Asynchronously compile the dual-theme token string on component mount
    useEffect(() => {
        let isMounted = true;
        renderCodeToHtml(code, language).then((html) => {
            if (isMounted) setHighlightedHtml(html);
        });
        return () => { isMounted = false; };
    }, [code, language]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="relative group">
            {highlightedHtml ? (
                <div 
                    className="shiki-wrapper rounded-lg overflow-x-auto text-[13px] max-w-full"
                    dangerouslySetInnerHTML={{ __html: highlightedHtml }} 
                />
            ) : (
                <pre className="rounded-lg bg-black/40 overflow-x-auto text-[13px]">
                    <code className={className}>{code}</code>
                </pre>
            )}
            <button
                type="button"
                onClick={handleCopy}
                className="absolute top-0 -right-1 p-1.5 rounded-md text-text-primary bg-text-primary/5 opacity-100 sm:opacity-50 group-hover:opacity-100 cursor-pointer z-10 transition-opacity"
                aria-label="Copy code"
            >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>
        </div>
    )
}