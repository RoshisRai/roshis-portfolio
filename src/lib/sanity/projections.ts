export const PUBLISHED_POST_FILTER =
    '_type == "post" && defined(publishedAt) && !(_id in path("drafts.**"))';

export const POST_CARD_PROJECTION = `{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    readingTime,
    "category": category->{
        _id,
        title,
        "slug": slug.current,
        description,
        color,
        order
    },
    "tags": tags[]->{
        _id,
        title,
        "slug": slug.current
    },
    coverImage{
        asset,
        hotspot,
        crop,
        alt
    },
    featured
}`;

export const POST_FULL_PROJECTION = `{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    updatedAt,
    readingTime,
    body,
    "category": category->{
        _id,
        title,
        "slug": slug.current,
        description,
        color,
        order
    },
    "tags": tags[]->{
        _id,
        title,
        "slug": slug.current
    },
    coverImage{
        asset,
        hotspot,
        crop,
        alt
    },
    featured,
    "author": author->{
        _id,
        name,
        "slug": slug.current,
        image,
        bio,
        social
    },
    seo,
    ragEnabled
}`;