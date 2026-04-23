import { projects as allProjects } from '#site/content'
import type { ProjectCardData, ProjectFrontmatter } from '@/types/project'

function sorted(a: ProjectFrontmatter, b: ProjectFrontmatter) {
    return a.order - b.order
}

export function getAllProjects(): ProjectFrontmatter[] {
    return [...(allProjects as ProjectFrontmatter[])].sort(sorted)
}

export function getFeaturedProjects(): ProjectCardData[] {
    return getAllProjects()
        .filter((p) => p.featured)
        .map(({ slug, title, summary, tags, cardSize, accent, media, featured, order }) => ({
            slug,
            title,
            summary,
            tags,
            cardSize,
            accent,
            media,
            featured,
            order,
        }))
}

export function getProjectBySlug(slug: string): ProjectFrontmatter | undefined {
    return getAllProjects().find((p) => p.slug === slug)
}

export function getAdjacentProjects(slug: string) {
    const list = getAllProjects()
    const i = list.findIndex((p) => p.slug === slug)
    if (i === -1) return { prev: null, next: null } // Not found, shouldn't happen if used correctly

    const prev = i > 0 ? list[i - 1] : undefined
    const next = i < list.length - 1 ? list[i + 1] : undefined
    return {
        prev: prev || null,
        next: next || null,
    }
}