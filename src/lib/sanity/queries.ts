import { sanityFetch } from "./client";
import {
    POST_CARD_PROJECTION,
    POST_FULL_PROJECTION,
    PUBLISHED_POST_FILTER,
} from "./projections";

import type {
    BlogCategory,
    BlogListingResponse,
    BlogPost,
    BlogPostCard,
} from "@/types/blog";

interface PostSlug {
    slug: string;
    publishedAt: string;
    updatedAt?: string;
}

interface SearchPost {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    tags: string[];
}

interface RssPost {
    title: string;
    slug: string;
    excerpt: string;
    publishedAt: string;
    categoryTitle: string;
}

interface ListingOptions {
    category?: string;
    page?: number;
    pageSize?: number;
    preview?: boolean;
}

export async function getBlogListing({
    category,
    page = 1,
    pageSize = 10,
    preview = false,
}: ListingOptions): Promise<BlogListingResponse> {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    const categoryFilter = category
        ? "&& category->slug.current == $category"
        : "";

    const postsQuery = `
        *[
            ${PUBLISHED_POST_FILTER}
            ${categoryFilter}
        ]
        | order(publishedAt desc)
        [$start...$end]
        ${POST_CARD_PROJECTION}
    `;

    const countQuery = `
        count(
            *[
                ${PUBLISHED_POST_FILTER}
                ${categoryFilter}
            ]
        )
    `;

    const categoriesQuery = `
        *[_type == "category"]
        | order(order asc, title asc)
        {
            _id,
            title,
            "slug": slug.current,
            description,
            color,
            order
        }
    `;

    const params = {
        category,
        start,
        end,
    };

    const [posts, total, categories] = await Promise.all([
        sanityFetch<BlogPostCard[]>(postsQuery, params, { preview }),
        sanityFetch<number>(countQuery, params, { preview }),
        sanityFetch<BlogCategory[]>(categoriesQuery, {}, { preview }),
    ]);

    return {
        posts,
        total,
        categories,
    };
}

export async function getPostBySlug(
    slug: string,
    preview = false,
): Promise<BlogPost | null> {
    return sanityFetch(
        `*[
        ${PUBLISHED_POST_FILTER}
        && slug.current == $slug
        ][0]
        ${POST_FULL_PROJECTION}`,
        { slug },
        { preview },
    );
}

export async function getRelatedPosts(
    currentSlug: string,
    categoryId: string,
    limit = 3,
    preview = false,
): Promise<BlogPostCard[]> {
    return sanityFetch(
        `*[
            ${PUBLISHED_POST_FILTER}
            && slug.current != $currentSlug
            && category._ref == $categoryId
        ]
        | order(publishedAt desc)
        [0...$limit]
        ${POST_CARD_PROJECTION}`,
        {
            currentSlug,
            categoryId,
            limit,
        },
        { preview },
    );
}

export async function getFeaturedPost(
    preview = false,
): Promise<BlogPostCard | null> {
    return sanityFetch(
        `*[
            ${PUBLISHED_POST_FILTER}
            && featured
        ]
        | order(publishedAt desc)
        [0]
        ${POST_CARD_PROJECTION}`,
        {},
        { preview },
    );
}

export async function getRecentPosts(
    limit = 3,
    preview = false,
): Promise<BlogPostCard[]> {
    return sanityFetch(
        `*[
            ${PUBLISHED_POST_FILTER}
        ]
        | order(publishedAt desc)
        [0...$limit]
        ${POST_CARD_PROJECTION}`,
        { limit },
        { preview },
    );
}

export async function getAllPostSlugs(
    preview = false,
): Promise<PostSlug[]> {
    return sanityFetch(
        `*[
            ${PUBLISHED_POST_FILTER}
        ]
        | order(publishedAt desc)
        {
            "slug": slug.current,
            publishedAt,
            updatedAt
        }`,
        {},
        { preview },
    );
}

export async function getAllPostsForSearch(
    preview = false,
): Promise<SearchPost[]> {
    return sanityFetch(
        `*[
            ${PUBLISHED_POST_FILTER}
        ]
        | order(publishedAt desc)
        {
            _id,
            title,
            "slug": slug.current,
            excerpt,
            "category": category->slug.current,
            "tags": tags[]->title
        }`,
        {},
        { preview },
    );
}

export async function getPostsForRss(
    limit = 20,
    preview = false,
): Promise<RssPost[]> {
    return sanityFetch(
        `*[
            ${PUBLISHED_POST_FILTER}
        ]
        | order(publishedAt desc)
        [0...$limit]
        {
            title,
            "slug": slug.current,
            excerpt,
            publishedAt,
            "categoryTitle": category->title
        }`,
        { limit },
        { preview },
    );
}