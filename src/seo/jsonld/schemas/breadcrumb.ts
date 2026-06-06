import { siteConfig } from "@/seo/config/site";

export function getBreadcrumbJsonLd(project: {
    title: string;
    slug: string;
}) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",

        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: siteConfig.url,
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Projects",
                item: `${siteConfig.url}/#projects`,
            },
            {
                "@type": "ListItem",
                position: 3,
                name: project.title,
                item: `${siteConfig.url}/projects/${project.slug}`,
            },
        ],
    };
}