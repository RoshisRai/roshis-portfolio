import type { MetadataRoute } from "next"
import { getAllProjects } from "@/lib/projects"

const SITE_URL = "https://roshis.dev"

export default function sitemap(): MetadataRoute.Sitemap {
    const projects = getAllProjects()
    
    const projectPages = projects.map((project) => ({
        url: `${SITE_URL}/projects/${project.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.9,
    }))

    return [
        {
            url: SITE_URL,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${SITE_URL}/chat`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        ...projectPages,
    ]
    }