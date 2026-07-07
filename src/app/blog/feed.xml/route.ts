import { siteConfig } from "@/seo/config/site";
import { getPostsForRss } from "@/lib/sanity/queries";

export const revalidate = 3600;

function escapeXml(value: string): string {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&apos;");
}

function createItem(
    post: Awaited<ReturnType<typeof getPostsForRss>>[number],
) {
    const url = `${siteConfig.url}/blog/${post.slug}`;

    return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
      <category>${escapeXml(post.categoryTitle)}</category>
    </item>`;
}

export async function GET() {
    const posts = await getPostsForRss(30);

    const feed = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0"
    xmlns:atom="http://www.w3.org/2005/Atom">

    <channel>

    <title>${siteConfig.name} Blog</title>

    <link>${siteConfig.url}/blog</link>

    <description>${siteConfig.description}</description>

    <language>en-us</language>

    <generator>Next.js</generator>

    <ttl>60</ttl>

    <lastBuildDate>${new Date(
        posts[0]?.publishedAt ?? Date.now(),
    ).toUTCString()
        }</lastBuildDate>

    <atom:link
    href="${siteConfig.url}/blog/feed.xml"
    rel="self"
    type="application/rss+xml"
    />

    ${posts.map(createItem).join("\n")}

    </channel>

    </rss>`;

    return new Response(feed, {
        headers: new Headers({
            "Content-Type":
                "application/rss+xml; charset=utf-8",
            "Cache-Control":
                "public, s-maxage=3600, stale-while-revalidate=86400",
        }),
    });
}