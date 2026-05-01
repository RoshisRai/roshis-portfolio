import type { ImplementationBlock as Block } from "@/types/project";
import { CodeBlock } from "../ui/code-block";
import { cn } from "@/lib/utils";
import { renderCodeToHtml } from "@/lib/shiki";
import Image from "next/image";
import { CursorZone } from "../global/cursor/cursor-zone";

interface ImplementationBlockProps {
    block: Block
    flip?: boolean
}

//CHANGE THE PROJECT IMPLEMENTATION BLOCK'S KEY FROM HTML TO CODE

export const ImplementationBlock = async ({
    block,
    flip
}: ImplementationBlockProps) => {
    const codeHtml = block.media.kind === 'code'
        ? await renderCodeToHtml(block.media.code, block.media.language)
        : null;

    const media = (
        <div className={cn(
            'lg:col-span-6',
            flip && 'lg:col-start-7'
        )}>
            {block.media.kind === 'code' ? (
                <CodeBlock
                    language={block.media.language}
                    filename={block.media.filename}
                    code={codeHtml ?? undefined}
                />
            ) : (
                <CursorZone variant="button">
                    <div className="relative w-full aspect-16/10 rounded-xl overflow-hidden border border-border">
                        <Image 
                            src={block.media.src}
                            alt={block.media.alt}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                    </div>
                </CursorZone>
            )}
        </div>
    )

    const text= (
        <div
            className={cn(
                'lg:col-span-6 flex flex-col justify-center',
                flip ? 'lg:col-start-1 lg:row-start-1' : 'lg:col-start-7',
            )}
        >
            <h3 className="font-display font-semibold text-[22px] text-text-primary mb-3">
                {block.title}
            </h3>
            <p className="text-[17px] leading-[1.7] text-text-secondary whitespace-pre-line">
                {block.body}
            </p>
        </div>
    )

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {media}
            {text}
        </div>
    )
}