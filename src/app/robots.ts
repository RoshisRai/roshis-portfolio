import type { MetadataRoute } from "next";

const SITE_URL = "https://roshis.dev"

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/", 
            disallow: ["/api/", "/studio/"],
        },
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    }
}