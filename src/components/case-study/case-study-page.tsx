import type { ProjectFrontmatter } from "@/types/project";
import { CaseStudyHero } from "./case-study-hero";
import { ProjectAccentStyle } from "./project-accent-style";
import { CaseStudyFooterNav } from "./case-study-footer-nav";

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
        <>
            <ProjectAccentStyle accent={project.accent} />

            <article data-page="case-study">
                <CaseStudyHero project={project} />
            </article>

            <CaseStudyFooterNav prev={prev} next={next} />
        </>
    )
}