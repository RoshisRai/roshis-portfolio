export interface TechDistribution {
    frontend: number;
    backend: number;
    infrastructure: number;
}

export interface Experience {
    id: string
    dateRange: string
    role: string
    company: string
    companyUrl?: string
    location?: string
    achievements: string[]
    techStack: string[]
    techDistribution: TechDistribution
}