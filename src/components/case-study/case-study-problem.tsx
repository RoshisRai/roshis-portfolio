interface CaseStudyProblemProps {
    quote?:string
    body?: string
}

export const CaseStudyProblem = ({
    quote, 
    body,
}: CaseStudyProblemProps) => {
    return (
        <section
            id="cs-problem"
            aria-labelledby="cs-problem-heading"
            className="py-(--spacing-case-study-section-mobile) md:py-(--spacing-case-study-section)"
        >
            <div className="mx-auto max-w-(--max-width-content) px-6">
                <h2 id="cs-problem-heading" className="sr-only">
                    The Problem
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {quote && (
                        <aside className="lg:col-span-6">
                            <div className="lg:sticky lg:top-[30vh]">
                                <p className="border-l-3 border-(--project-accent) pl-6 italic font-display font-semibold text-[clamp(1.2rem,2.4vw,1.5rem)] leading-snug text-text-primary">
                                    “{quote}”
                                </p>
                            </div>
                        </aside>
                    )}

                    {body && (
                        <div className="lg:col-span-6 lg:col-start-7">
                            <p className="text-[17px] leading-1.7 text-text-primary whitespace-pre-line">
                                {body}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}