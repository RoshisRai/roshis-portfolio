import { siteConfig } from "@/seo/config/site";

export function getProjectJsonLd(project: {
    title: string;
    summary: string;
    slug: string;
    media: { cover: string };
}) {
    const url = `${siteConfig.url}/projects/${project.slug}`;

    return {
        "@context": "https://schema.org",
        "@type": "Article",

        headline: project.title,
        description: project.summary,
        image: `${siteConfig.url}${project.media.cover}`,

        author: {
            "@type": "Person",
            name: siteConfig.author,
        },

        publisher: {
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url,
        },

        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": url,
        },

        url,
    };
}