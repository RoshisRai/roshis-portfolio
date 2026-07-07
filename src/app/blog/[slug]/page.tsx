import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getPostBySlug,
  getRelatedPosts,
  getAllPostSlugs,
} from "@/lib/sanity/queries";

import { getOgImageUrl } from "@/lib/sanity/image";
import { extractTableOfContents } from "@/lib/blog-utils";

import { PostHeader } from "@/components/blog/post-header";
import { PostBody } from "@/components/blog/post-body";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { RelatedPosts } from "@/components/blog/related-posts";
import { PostFooterCta } from "@/components/blog/post-footer-cta";
import { JsonLd } from "@/components/blog/json-ld";

interface PostPageProps {
  params: { slug: string };
}

/**
 * Pre-generate all blog posts at build time
 */
export async function generateStaticParams() {
  const posts = await getAllPostSlugs();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

/**
 * SEO metadata (server-safe, cached fetch)
 */
export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  const title = post.seo?.metaTitle ?? post.title;
  const description = post.seo?.metaDescription ?? post.excerpt;

  const ogImage = post.seo?.ogImage
    ? getOgImageUrl(post.seo.ogImage)
    : getOgImageUrl(post.coverImage);

  return {
    title: `${title} | Roshis Rai`,
    description,

    authors: post.author?.name ? [{ name: post.author.name }] : undefined,

    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? undefined,
      authors: post.author?.name ? [post.author.name] : [],
      tags: post.tags?.map((t) => t.title) ?? [],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },

    alternates: {
      canonical: `https://roshis.dev/blog/${params.slug}`,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const [relatedPosts, tocItems] = await Promise.all([
    getRelatedPosts(params.slug, post.category?._id ?? "", 3),
    Promise.resolve(extractTableOfContents(post.body ?? [])),
  ]);

  return (
    <>
      <JsonLd post={post} />

      <main className="min-h-screen py-16 md:py-24">
        <div className="mx-auto max-w-275 px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-12">
            {/* Main Content */}
            <article className="max-w-prose">
              <PostHeader post={post} />
              <PostBody body={post.body} />
              <PostFooterCta />
              <RelatedPosts posts={relatedPosts} />
            </article>

            {/* Sidebar TOC */}
            {tocItems.length > 0 && (
              <aside className="hidden lg:block">
                <div className="sticky top-24">
                  <TableOfContents items={tocItems} />
                </div>
              </aside>
            )}
          </div>
        </div>
      </main>
    </>
  );
}