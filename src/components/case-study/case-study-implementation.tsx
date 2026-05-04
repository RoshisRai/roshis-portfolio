import type { ImplementationBlock as Block } from "@/types/project";
import { ImplementationBlock } from "./implementation-block";

interface CaseStudyImplementationProps {
    blocks?: Block[]
}

export const CaseStudyImplementation = ({
    blocks
}: CaseStudyImplementationProps) => {
    if (!blocks || blocks.length === 0) return null;

    return (
        <section
            id="cs-implementation"
            aria-labelledby="cs-implementation-heading"
            className="py-(--spacing-case-study-section-mobile) md:py-(--spacing-case-study-section)"
        >
            <div className="mx-auto max-w-(--max-width-content)">
                <h2 id="cs-implementation-heading" className="text-center text-[clamp(1.5rem,4vw,2rem)] font-display font-bold text-text-primary mb-6">
                    Implementation
                </h2>

                <div className="flex flex-col gap-20">
                    {blocks.map((block, i) => {
                        return (
                            <ImplementationBlock
                                key={block.title}
                                block={block}
                                flip={block.flip ?? i % 2 === 1}
                            />
                        )
                    })}
                </div>
            </div>
        </section>
    )
}