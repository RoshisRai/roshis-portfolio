// Shared-element view transition names
// Project media (image/video) transition name.
export function projectMediaVTName(slug: string) {
    return `project-media-${slug}`
}

// Project title transition name.
export function projectTitleVTName(slug: string) {
    return `project-title-${slug}`
}

// Project accent (colored elements) transition name.
export function projectAccentVTName(slug: string) {
    return `project-accent-${slug}`
}

// Navigation direction tags (Next.js Link transitionTypes).
export const navForward: string[] = ['nav-forward']
export const navBack: string[] = ['nav-back']