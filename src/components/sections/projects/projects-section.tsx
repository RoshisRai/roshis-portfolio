
import { SectionHeading } from "@/components/ui/section-heading";
import { SectionWrapper } from "@/components/layout/section-wrapper"
import { getFeaturedProjects } from "@/lib/projects";
import { ProjectsGrid } from "./projects-grid";

export const ProjectsSection = () => {
    const projects = getFeaturedProjects()

    if (projects.length === 0) return null

    return (
        <SectionWrapper
            id="projects"
            aria-labelledby="projects-heading"
        >
            <SectionHeading
                id="projects-heading"
                title="Featured Projects"
                subtitle="A selection of systems I've designed and built end-to-end."
                align="left"
            />
            <ProjectsGrid projects={projects} />
        </SectionWrapper>
    )
}