import { cn } from "@/lib/utils";

// ---- Inline Code ----------------------------------------------------------------------
// Using this for small snippets within prose.

type InlineCodeProps = React.HTMLAttributes<HTMLElement>

const InlineCode = ({
    className,
    children,
    ...props
}: InlineCodeProps) => {
    return (
        <code
            className={cn(
                'font-mono text-[13px]',
                'bg-surface-alt text-accent',
                'px-1.5 py-0.5 rounded-md',
                'border border-border',
                className
            )}
            {...props}
        >
            {children}
        </code>
    )
}

// ---- Block Code -----------------------------------------------------------------------
// Wraps pre-rendered Shiki HTML (dangerouslySetInnerHTML) or children.
// Shiki usage: call `codeToHtml` server-side, pass the result as `html`.

interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
    language?: string // Language label shown in the header
    filename?: string // Optional filename shown in the header
    html?: string // Pre-rendered Shiki HTML string
}

const CodeBlock = ({
    language,
    filename,
    html,
    className,
    children,
    ...props
}: CodeBlockProps) => {
    const hasHeader = filename || language

    return (
        <div
            className={cn(
                'rounded-xl overflow-hidden',
                'border border-border',
                'bg-surface',
                className,
            )}
            {...props}
        >
            {/* File header */}
            {hasHeader && (
                <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-border bg-surface">
                    <div className="flex items-center gap-2.5">
                        {filename && (
                            <>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                                </div>
                                <span className="text-[12px] text-text-secondary font-mono">
                                    {filename}
                                </span>
                            </>
                        )}
                    </div>

                    {language && (
                        <span className="text-[11px] text-text-secondary font-mono uppercase tracking-wider">
                            {language}
                        </span>
                    )}
                </div>
            )}

            {/* Code content */}
            { html ? (
                <div
                    className={cn(
                        'overflow-x-auto p-5',
                        '[&_pre]:bg-transparent [&_pre]:m-0 [&_pre]:p-0',
                        '[&_code]:font-mono [&_code]:text-[14px] [&_code]:leading-7',
                        'text-text-primary',
                    )}
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            ): (
                <pre
                    className={cn(
                        'overflow-x-auto p-5 m-0',
                        'font-mono text-[14px] leading-7',
                        'text-text-primary',
                    )}
                >
                    <code>{children}</code>
                </pre>
            )}
        </div>
    )
}

InlineCode.displayName = 'InlineCode'
CodeBlock.displayName = 'CodeBlock'

export { InlineCode, CodeBlock, type InlineCodeProps, type CodeBlockProps }