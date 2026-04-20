export type ProjectCardSize =
    | 'hero'
    | 'wide'
    | 'standard'
    | 'compact'

export type ProjectMedia = {
    cover: string // Static Poster / Cover Image (required)
    video?: string // Optional muted looping video for hover preview
    poster?: string // Optional precise poster frame for match-cut (defaults to `cover`)
    alt: string // Alt text used for ally across card and hero
    aspect?: '16/10' | '16/9' | '4/3' | '1/1' // Intrinsic ratio, defaults to 16:10 per wireframe
}

export type ProjectMetric = {
    value: string // '73%', '<450ms', '1.2M+', etc. (required)
    label: string // 'Engagement Uplift' 
    countTo?: number
    prefix?: string
    suffix?: string
}

export type ImplementationBlock = {
    title: string
    body: string
    media:
        | { kind: 'code'; language: string; filename?: string; code: string }
        | { kind: 'image'; src: string; alt: string }
    flip?: boolean // If true, media is on the left and text on the right (defaults to false)
}

export type ProjectArchitecture = {
    description?: string
    diagram: string // Path to SVG or image file illustrating the architecture
    layers: string[]
}

export type ProjectFrontmatter = {
    slug: string
    title: string
    summary: string
    intro: string
    featured: boolean
    order: number
    cardSize: ProjectCardSize
    accent: string
    media: ProjectMedia
    tags: string[]
    role: string
    timeline: string
    stack: string[]
    quote?: string
    problem?: string
    architecture?: ProjectArchitecture
    implementation?: ImplementationBlock[]
    metrics?: ProjectMetric[]
    reflection?: string
    nextSlug?: string
    links?: { label: string; href: string }[] // Optional external links shown in case study footer.
}

// Project cards on the homepage shape trimmed from full frontmatter 
export type ProjectCardData = Pick<
    ProjectFrontmatter,
        | 'slug'
        | 'title'
        | 'summary'
        | 'tags'
        | 'cardSize'
        | 'accent'
        | 'media'
        | 'featured'
        | 'order'
    >