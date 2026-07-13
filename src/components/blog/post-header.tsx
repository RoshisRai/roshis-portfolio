import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/types/blog";
import { getCoverImageUrl, getBlurDataUrl } from "@/lib/sanity/image";
import { formatDate } from "@/lib/blog-utils";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { blogCoverVTName } from "@/lib/project-transition";
import { CursorZone } from "../global/cursor/cursor-zone";
import { Tag } from "../ui/tag";

interface PostHeaderProps {
  post: BlogPost;
}

const CATEGORY_COLORS: Record<string, string> = {
  blue: "bg-blue-500/10 text-blue-400",
  purple: "bg-purple-500/10 text-purple-400",
  emerald: "bg-emerald-500/10 text-emerald-400",
  amber: "bg-amber-500/10 text-amber-400",
  rose: "bg-rose-500/10 text-rose-400",
  cyan: "bg-cyan-500/10 text-cyan-400",
};

export function PostHeader({ post }: PostHeaderProps) {
  const categoryKey = post.category?.color ?? "blue";
  const categoryColor = CATEGORY_COLORS[categoryKey] ?? CATEGORY_COLORS.blue;

  const cover = post.coverImage;

  return (
    <header className="mb-10">
      <CursorZone variant="link" className="content">
        <Link
          href="/blog"
          className="group inline-flex items-center gap-1.5 text-[14px] text-foreground/50 hover:text-foreground transition-colors mb-6"
          aria-label="Back to blog"
        >
          <ArrowLeft size={14} className="text-text-primary-80 transition-all duration-200 group-hover:-translate-x-0.5 group-hover:text-text-primary/90" />
          <span className="text-text-primary/80 transition-colors duration-200 group-hover:text-text-primary/90">More Blogs</span>
        </Link>
      </CursorZone>

      <div className="flex flex-wrap items-center gap-2 mb-4 text-[13px] text-text-primary/80">
        <span
          className={cn(
            "px-2.5 py-0.5 rounded-md text-[12px] font-medium",
            categoryColor
          )}
        >
          {post.category?.title ?? "Uncategorized"}
        </span>

        {post.readingTime ? (
          <span>· {post.readingTime} min read</span>
        ) : null}

        <span>
          ·{" "}
          <time dateTime={post.publishedAt}>
            {formatDate(post.publishedAt)}
          </time>
        </span>
      </div>

      <h1 className="text-[30px] md:text-[36px] font-bold leading-tight tracking-tight text-text-primary mb-4">
        {post.title}
      </h1>

      {post.excerpt ? (
        <p className="text-[17px] text-text-primary/80 leading-relaxed mb-8 max-w-160">
          {post.excerpt}
        </p>
      ) : null}

      {cover ? (
        <div className="relative aspect-2/1 rounded-xl overflow-hidden border border-text-secondary/10 mb-6">
          <Image
            src={getCoverImageUrl(cover, 1400)}
            alt={cover.alt ?? post.title}
            fill
            sizes="(max-width: 768px) 100vw, 1000px"
            className="object-cover"
            priority
            placeholder="blur"
            blurDataURL={getBlurDataUrl(cover)}
            style={{ viewTransitionName: blogCoverVTName(post.slug) }}
          />
        </div>
      ) : null}

      {post.tags?.length ? (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Tag variant="tech" key={tag._id}>{tag.title}</Tag>
          ))}
        </div>
      ) : null}
    </header>
  );
}