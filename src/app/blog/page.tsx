import { Suspense } from "react";
import {
  getBlogListing,
  getFeaturedPost,
  getAllPostsForSearch,
} from "@/lib/sanity/queries";

import { CategoryFilter } from "@/components/blog/category-filter";
import { BlogListingClient } from "@/components/blog/blog-listing-client";
import { Pagination } from "@/components/blog/pagination";

import type { Metadata } from "next";
import { siteConfig } from "@/seo/config/site";
import { cn } from "@/lib/utils";

const url = `${siteConfig.url}/blog`;
const ogImage = siteConfig.ogImage;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Thoughts on system design, full-stack engineering, and building software that scales.",

  alternates: {
    canonical: url,
    types: {
      "application/rss+xml": `${siteConfig.url}/blog/feed.xml`,
    },
  },

  openGraph: {
    title: "Blog | " + siteConfig.name,
    description:
      "Thoughts on system design, full-stack engineering, and building software that scales.",
    url,
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} Blog`,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Blog | " + siteConfig.name,
    description:
      "Thoughts on system design, full-stack engineering, and building software that scales.",
    images: [ogImage],
  },

  robots: {
    index: true,
    follow: true,
  },
};

const PAGE_SIZE = 10;

interface BlogPageProps {
  searchParams?: Promise<{
    category?: string;
    page?: string;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = await searchParams;
  const category = resolvedSearchParams?.category;
  const page = Math.max(1, Number(resolvedSearchParams?.page ?? 1));

  const isCategoryFiltered = Boolean(category);

  /**
   * Fetch core blog data in parallel
   */
  const [listing, featuredPost, searchIndex] = await Promise.all([
    getBlogListing({
      category,
      page,
      pageSize: PAGE_SIZE,
    }),

    // Only show featured post on unfiltered view
    isCategoryFiltered
      ? Promise.resolve(null)
      : getFeaturedPost(),

    // Search index always needed for client search
    getAllPostsForSearch(),
  ]);

  const { posts, total, categories } = listing;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <main className="min-h-screen py-20 md:py-28">
      <div className="mx-auto w-full max-w-(--max-width-content) px-6 md:px-12">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className={cn(
            'font-display font-bold text-text-primary leading-[1.1] tracking-tight',
            'text-[clamp(32px,5vw,48px)]',
            'bg-linear-to-r from-text-primary to-text-secondary bg-clip-text text-transparent inline-block',
          )}>
            Writing
          </h1>
          <p className="text-[18px] font-normal text-text-secondary leading-relaxed max-w-130 mx-auto">
            Thoughts on system design, full-stack engineering, and building
            software that scales.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <Suspense fallback={null}>
            <CategoryFilter categories={categories} />
          </Suspense>
        </div>

        {/* Posts + Search */}
        <BlogListingClient
          posts={posts}
          searchIndex={searchIndex}
          featuredPost={featuredPost}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              basePath="/blog"
              category={category}
            />
          </div>
        )}
      </div>
    </main>
  );
}