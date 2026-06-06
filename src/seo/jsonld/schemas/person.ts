import { siteConfig } from "@/seo/config/site";

export function getPersonJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.author,
    url: siteConfig.url,
    jobTitle: "Full-Stack Software Engineer",
    sameAs: [
      "https://github.com/RoshisRai",
      "https://linkedin.com/in/roshis-rai",
    ],
  };
}