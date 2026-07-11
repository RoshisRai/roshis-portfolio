"use client";

import { useState, useCallback, useMemo } from "react";
import type { BlogPostCard } from "@/types/blog";
import { BlogSearch } from "./blog-search";
import { PostCard } from "./post-card";
import { FeaturedPost } from "./featured-post";
import { cn } from "@/lib/utils";

interface SearchablePost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
}

interface BlogListingClientProps {
  posts: BlogPostCard[];
  searchIndex: SearchablePost[];
  featuredPost: BlogPostCard | null;
}

export function BlogListingClient({
  posts,
  searchIndex,
  featuredPost,
}: BlogListingClientProps) {
  const [filteredSlugs, setFilteredSlugs] = useState<string[] | null>(null);

  const handleSearchResults = useCallback((slugs: string[] | null) => {
    setFilteredSlugs(slugs);
  }, []);

  const isSearching = filteredSlugs !== null;

  /**
   * Normalize visible posts
   * - search mode: filter by slug results
   * - default mode: show all posts except featured
   */
  const visiblePosts = useMemo(() => {
    let result = posts;

    if (isSearching && filteredSlugs) {
      const slugSet = new Set(filteredSlugs);
      result = result.filter((p) => slugSet.has(p.slug));
    }

    if (!isSearching && featuredPost) {
      result = result.filter((p) => p._id !== featuredPost._id);
    }

    return result;
  }, [posts, isSearching, filteredSlugs, featuredPost]);

  return (
    <>
      <div className="mb-8">
        <BlogSearch posts={searchIndex} onResults={handleSearchResults} />
      </div>

      {!isSearching && featuredPost && (
        <div className="mb-8">
          <FeaturedPost post={featuredPost} />
        </div>
      )}

      {visiblePosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visiblePosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-[16px] text-foreground/40">
            {isSearching
              ? "No articles match your search."
              : "No articles found."}
          </p>
        </div>
      )}
    </>
  );
}