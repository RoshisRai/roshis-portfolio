import type { WithContext, BlogPosting } from "schema-dts";

import type { BlogPost } from "@/types/blog";
import { siteConfig } from "@/seo/config/site";
import { getOgImageUrl } from "@/lib/sanity/image";

interface JsonLdProps {
  post: BlogPost;
}

export function JsonLd({
  post,
}: JsonLdProps) {
  const url = `${siteConfig.url}/blog/${post.slug}`;

  const jsonLd: WithContext<BlogPosting> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",

    headline: post.title,
    description: post.excerpt,

    url,

    image: [getOgImageUrl(post.coverImage)],

    datePublished: post.publishedAt,
    dateModified:
      post.updatedAt ??
      post.publishedAt,

    inLanguage: "en",

    author: {
      "@type": "Person",
      name: post.author.name,
      url: siteConfig.url,
      jobTitle:
        "Full-Stack Software Engineer",
    },

    publisher: {
      "@type": "Organization",
      name: siteConfig.author,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: siteConfig.ogImage,
      },
    },

    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },

    isPartOf: {
      "@type": "Blog",
      name: `${siteConfig.name} Blog`,
      url: `${siteConfig.url}/blog`,
    },

    keywords: post.tags
      .map((tag) => tag.title)
      .join(", "),

    timeRequired: post.readingTime
      ? `PT${post.readingTime}M`
      : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd),
      }}
    />
  );
}