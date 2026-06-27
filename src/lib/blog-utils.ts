import type {
    PortableTextBlock,
    PortableTextSpan,
} from "@portabletext/types"

import type {
    CustomBlock,
    CustomBlockContent,
    TableOfContentsItem,
} from "@/types/blog"

const LONG_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
})

const SHORT_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
})

const WORDS_PER_MINUTE = 238
const CODE_BLOCK_WORD_EQUIVALENT = 30

function isPortableTextBlock(
    block: CustomBlock,
): block is PortableTextBlock {
    return block._type === "block"
}

function blockToPlainText(
    block: PortableTextBlock,
): string {
    return (block.children ?? [])
        .filter(
            (
                child,
            ): child is PortableTextSpan =>
                child._type === "span",
        )
        .map((child) => child.text)
        .join("")
}

export function formatDate(
    dateString: string,
): string {
    const date = new Date(dateString)

    if (Number.isNaN(date.getTime())) {
        return ""
    }

    return LONG_DATE_FORMATTER.format(date)
}

export function formatDateShort(
    dateString: string,
): string {
    const date = new Date(dateString)

    if (Number.isNaN(date.getTime())) {
        return ""
    }

    return SHORT_DATE_FORMATTER.format(date)
}

export function slugify(text: string): string {
    return text
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
}

export function extractTableOfContents(
    blocks: CustomBlockContent,
): TableOfContentsItem[] {
    const headings: TableOfContentsItem[] = []

    for (const block of blocks) {
        if (!isPortableTextBlock(block)) {
            continue
        }

        if (
            block.style !== "h2" &&
            block.style !== "h3" &&
            block.style !== "h4"
        ) {
            continue
        }

        const text = blockToPlainText(block)

        if (!text) {
            continue
        }

        headings.push({
            id: slugify(text),
            text,
            level: Number(block.style.slice(1)) as
                | 2
                | 3
                | 4,
        })
    }

    return headings
}

export function estimateReadingTime(
    blocks: CustomBlockContent,
): number {
    let wordCount = 0

    for (const block of blocks) {
        if (isPortableTextBlock(block)) {
            wordCount += blockToPlainText(block)
                .split(/\s+/)
                .filter(Boolean).length

            continue
        }

        if (block._type === "codeBlock") {
            wordCount +=
                CODE_BLOCK_WORD_EQUIVALENT
        }
    }

    return Math.max(
        1,
        Math.ceil(wordCount / WORDS_PER_MINUTE),
    )
}