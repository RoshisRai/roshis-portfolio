import type { ProjectMetric } from "@/types/project";
import { ResultStat } from "./result-stat";

interface CaseStudyResultsProps {
    metrics?: ProjectMetric[]
}

export const CaseStudyResults = ({ metrics }: CaseStudyResultsProps) => {

    if (!metrics || metrics.length === 0) return null

    return (
        <section
            id="cs-results"
            aria-labelledby="cs-results-heading"
            className="py-(--spacing-case-study-section-mobile) md:py-(--spacing-case-study-section)"
        >
            <div className="mx-auto max-w-(--max-width-content)">
                <h2 id="cs-results-heading" className="text-center text-[clamp(1.5rem,4vw,2rem)] font-display font-bold text-text-primary mb-6">
                    Results
                </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6">
                {metrics.map((metric) => (
                    <ResultStat key={metric.label} metric={metric} />
                ))}
            </div>
        </section>
    )
}