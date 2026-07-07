import {
    PortableText,
    type PortableTextComponents,
    type PortableTextComponentProps,
} from "@portabletext/react"
import type {
    PortableTextBlock,
    PortableTextSpan,
} from "@portabletext/types"

import type { CustomBlockContent } from "@/types/blog"

import { CodeBlock } from "./portable-text/code-block"
import { Callout } from "./portable-text/callout"
import { ImageBlock } from "./portable-text/image-block"

import { slugify } from "@/lib/blog-utils"
import { cn } from "@/lib/utils"

interface PostBodyProps {
    body: CustomBlockContent
    className?: string
}

/**
 * Safely extracts plain text from a Portable Text block.
 */
function extractText(
    value?: PortableTextBlock,
): string {
    if (!value?.children) return ""

    return value.children
        .filter(
            (
                child,
            ): child is PortableTextSpan =>
                child._type === "span" &&
                "text" in child,
        )
        .map((child) => child.text)
        .join("")
}

/**
 * Shared heading renderer factory.
 */
function createHeading(
    level: 2 | 3 | 4,
) {
    const base =
        {
            2: "text-[24px] font-bold mt-12 mb-4",
            3: "text-[20px] font-semibold mt-8 mb-3",
            4: "text-[17px] font-semibold mt-6 mb-2",
        }[level]

    const Tag = `h${level}` as const

    const Heading = ({
        children,
        value,
    }: PortableTextComponentProps<PortableTextBlock>) => {
        const text = extractText(value)
        const id = slugify(text)

        return (
            <Tag
                id={id}
                className={cn(
                    "scroll-mt-24",
                    base,
                )}
            >
                {children}
            </Tag>
        )
    }

    Heading.displayName = `PortableTextHeading${level}`

    return Heading
}

const components: PortableTextComponents = {
    block: {
        h2: createHeading(2),
        h3: createHeading(3),
        h4: createHeading(4),

        normal: ({ children }) => (
            <p className="mb-4 text-[16px] leading-[1.8] text-foreground/80">
                {children}
            </p>
        ),

        blockquote: ({ children }) => (
            <blockquote className="my-6 border-l-2 border-indigo-500/40 pl-4 italic text-foreground/60">
                {children}
            </blockquote>
        ),
    },

    list: {
        bullet: ({ children }) => (
            <ul className="my-4 list-disc space-y-2 pl-5 text-[16px] text-foreground/80">
                {children}
            </ul>
        ),

        number: ({ children }) => (
            <ol className="my-4 list-decimal space-y-2 pl-5 text-[16px] text-foreground/80">
                {children}
            </ol>
        ),
    },

    listItem: {
        bullet: ({ children }) => (
            <li className="leading-[1.7]">
                {children}
            </li>
        ),

        number: ({ children }) => (
            <li className="leading-[1.7]">
                {children}
            </li>
        ),
    },

    marks: {
        strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
                {children}
            </strong>
        ),

        em: ({ children }) => (
            <em>{children}</em>
        ),

        code: ({ children }) => (
            <code className="rounded bg-white/6 px-1.5 py-0.5 font-mono text-[14px] text-indigo-300">
                {children}
            </code>
        ),

        "strike-through": ({
            children,
        }) => (
            <span className="line-through opacity-70">
                {children}
            </span>
        ),

        link: ({
            children,
            value,
        }) => {
            const href =
                value?.href ?? ""

            const isExternal =
                href.startsWith("http")

            return (
                <a
                    href={href}
                    target={
                        isExternal
                            ? "_blank"
                            : undefined
                    }
                    rel={
                        isExternal
                            ? "noopener noreferrer"
                            : undefined
                    }
                    className="text-indigo-400 underline decoration-indigo-400/30 underline-offset-2 transition-colors hover:decoration-indigo-400"
                >
                    {children}
                </a>
            )
        },
    },

    types: {
        codeBlock: CodeBlock,
        callout: Callout,
        image: ImageBlock,
    },
}

export function PostBody({
    body,
    className,
}: PostBodyProps) {
    return (
        <div
            className={cn(
                "prose-custom",
                className,
            )}
        >
            <PortableText
                value={body}
                components={components}
            />
        </div>
    )
}