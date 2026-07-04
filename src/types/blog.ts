import type { PortableTextBlock } from "@portabletext/types";

export interface SanityImageSource {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  alt?: string;
}

export type CodeLanguage =
  | "typescript"
  | "javascript"
  | "python"
  | "bash"
  | "sql"
  | "json"
  | "yaml"
  | "go"
  | "rust"
  | "css"
  | "html"
  | "diff";

export interface SanityCodeBlock {
  _key: string;
  _type: "codeBlock";
  language?: CodeLanguage;
  code: string;
  filename?: string;
  highlightedLines?: number[];
}

export interface SanityCalloutBlock {
  _key: string;
  _type: "callout";
  type: "info" | "warning" | "tip" | "note";
  content: string;
}

export interface SanityInlineImageBlock
  extends SanityImageSource {
  _key: string;
  _type: "image";
  alt: string;
  caption?: string;
}

export type CustomBlock =
  | PortableTextBlock
  | SanityCodeBlock
  | SanityCalloutBlock
  | SanityInlineImageBlock;

export type CustomBlockContent = CustomBlock[];

export interface BlogCategory {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  color?: string;
  order?: number;
}

export interface BlogTag {
  _id: string;
  title: string;
  slug: string;
}

export interface SocialLinks {
  twitter?: string;
  github?: string;
  linkedin?: string;
}

export interface BlogAuthor {
  _id: string;
  name: string;
  slug: string;
  image?: SanityImageSource;
  bio?: string;
  social?: SocialLinks;
}

export interface BlogPostCard {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  readingTime: number;
  category: BlogCategory;
  tags: BlogTag[];
  coverImage: SanityImageSource & { alt: string };
  featured: boolean;
}

export interface BlogPost extends BlogPostCard {
  body: CustomBlockContent;
  updatedAt?: string;
  author: BlogAuthor;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: SanityImageSource;
  };
  ragEnabled: boolean;
}

export interface BlogListingResponse {
  posts: BlogPostCard[];
  total: number;
  categories: BlogCategory[];
}

export interface TableOfContentsItem {
  id: string;
  text: string;
  level: 2 | 3 | 4;
}

export interface BlogSearchIndex {
    _id: string
    title: string
    slug: string
    excerpt: string
    category: string
    tags: string[]
}