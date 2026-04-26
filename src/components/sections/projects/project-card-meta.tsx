import { Tag } from "@/components/ui/tag"
import { projectTitleVTName } from "@/lib/project-transition"

interface ProjectCardMetaProps {
    slug: string
    title: string
    summary: string
    tags: string[]
}

export const ProjectCardMeta = ({
    slug,
    title,
    summary,
    tags,
}: ProjectCardMetaProps) => {
    return (
        <div className="flex flex-col flex-1 gap-3 p-6">
            <h3
                style={{ viewTransitionName: projectTitleVTName(slug) }}
                className="font-display font-semibold text-[22px] text-text-primary leading-snug"
            >
                {title}
            </h3>
            <p
                className="text-sm text-text-secondary leading-relaxed line-clamp-3"
            >
                {summary}
            </p> 
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-auto">
                    {tags.slice(0, 6).map((tag) => (
                        <Tag key={tag} variant="tech">
                            {tag}
                        </Tag>
                    ))}
                </div>
            )}
        </div>
    )
}