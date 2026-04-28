import type { ProjectFrontmatter } from "@/types/project";
import { CaseStudyHero } from "./case-study-hero";
import { ProjectAccentStyle } from "./project-accent-style";
import { CaseStudyFooterNav } from "./case-study-footer-nav";
import { CaseStudyProgressNav } from "./case-study-progress-nav";
import { CaseStudyProblem } from "./case-study-problem";

interface CaseStudyPageProps {
    project: ProjectFrontmatter
    prev?: Pick<ProjectFrontmatter, 'slug' | 'title'>
    next?: Pick<ProjectFrontmatter, 'slug' | 'title'>
}

export const CaseStudyPage = ({
    project,
    prev,
    next,
}: CaseStudyPageProps) => {
    return (
        <div className="flex flex-col items-center">
            <ProjectAccentStyle accent={project.accent} />

            <div
                className="mx-auto flex w-full items-start lg:gap-8 gap-0 px-6 lg:max-w-(--max-width-content)"
            >
                <CaseStudyProgressNav />
                <article
                    data-page="case-study"
                    className="min-w-0 flex-1 order-1"
                >
                    <CaseStudyHero project={project} />
                    <CaseStudyProblem quote={project.quote} body={project.problem} />
                </article>

            </div>

            <CaseStudyFooterNav prev={prev} next={next} />
        </div>
    )
}