import { ProjectCardData } from "@/types/project"
import { projectsGridClass } from "@/lib/project-layout";
import { ProjectCard } from "./project-card";

interface ProjectsGridProps {
    projects: ProjectCardData[]
}

export const ProjectsGrid = ({ projects }: ProjectsGridProps) => {
    return (
        <div 
            data-project-grid
            className={projectsGridClass}
        >
            {projects.map((p, i) => (
                <ProjectCard key={p.slug} project={p} priority={i === 0}  />
            ))}
        </div>
    )
}