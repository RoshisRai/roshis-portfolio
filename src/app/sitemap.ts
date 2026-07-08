import type { MetadataRoute } from "next"

import { getAllProjects } from "@/lib/projects"
import { getAllPostSlugs } from "@/lib/sanity/queries"
import { siteConfig } from "@/seo/config/site"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date()

    const projects = getAllProjects()
    const posts = await getAllPostSlugs()
    
    const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
        url: `${siteConfig.url}/projects/${project.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.9,
    }))

    const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
        url: `${siteConfig.url}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt ?? post.publishedAt),
        changeFrequency: "monthly",
        priority: 0.7,
    }))

    return [
        {
            url: siteConfig.url,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${siteConfig.url}/chat`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${siteConfig.url}/blog`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.9,
        },
        ...projectPages,
        ...blogPages
    ]
}