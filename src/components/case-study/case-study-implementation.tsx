import type { ImplementationBlock as Block } from "@/types/project";
import { ImplementationBlock } from "./implementation-block";
import { SectionWrapper } from "../layout/section-wrapper";

interface CaseStudyImplementationProps {
    blocks?: Block[]
}

export const CaseStudyImplementation = ({
    blocks
}: CaseStudyImplementationProps) => {
    if (!blocks || blocks.length === 0) return null;

    return (
        <SectionWrapper 
            id="case-study-implementation"
            title="Implementation"  
        >
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
        </SectionWrapper>
    )
}