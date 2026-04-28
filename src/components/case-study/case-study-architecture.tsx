import type { ProjectArchitecture } from "@/types/project";
import { ArchitectureDiagram } from "./architecture-diagram";

interface CaseStudyArchitectureProps {
    architecture?: ProjectArchitecture
}

export const CaseStudyArchitecture = ({ architecture }: CaseStudyArchitectureProps) => {
    if (!architecture) return null

    return (
        <section
            id="cs-architecture"
            aria-labelledby="cs-architecture-heading"
            className="py-(--spacing-case-study-section-mobile) md:py-(--spacing-case-study-section)"
        >
            <div className="mx-auto max-w-(--max-width-content)">
                <h2 id="cs-architecture-heading" className="text-center text-[clamp(1.5rem,4vw,2rem)] font-display font-bold text-text-primary mb-6">
                    Architecture
                </h2>

                {architecture.description && (
                    <p className="text-center mx-auto max-w-prose text-[16px] text-text-secondary leading-relaxed mb-12">
                        {architecture.description}
                    </p>
                )}

                <ArchitectureDiagram
                    src={architecture.diagram}
                    layers={architecture.layers}
                />

            </div>
        </section>
    )
}