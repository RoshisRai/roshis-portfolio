import { siteConfig } from "@/seo/config/site";

export function getWebsiteJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "webSite",
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description
    }
}