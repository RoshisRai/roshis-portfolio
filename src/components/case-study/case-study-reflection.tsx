interface CaseStudyReflectionProps {
    body?: string
}

export const CaseStudyReflection = ({ body }: CaseStudyReflectionProps) => {
    return (
        <section
            id="cs-reflection"
            aria-labelledby="cs-reflection-heading"
            className="py-(--spacing-case-study-section-mobile) md:py-(--spacing-case-study-section)"
        >
            <div className="mx-auto max-w-(--max-width-content)">
                <h2 id="cs-reflection-heading" className="text-center text-[clamp(1.5rem,4vw,2rem)] font-display font-bold text-text-primary mb-6">
                    Lessons &amp; Growth
                </h2>
                <p className="text-17px leading-1.8 text-text-secondary whitespace-pre-line">
                    {body}
                </p>
            </div>
        </section>
    )
}