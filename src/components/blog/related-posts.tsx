import type { BlogPostCard } from "@/types/blog";
import { PostCard } from "./post-card";

interface RelatedPostsProps {
  posts?: BlogPostCard[] | null;
  title?: string;
}

export function RelatedPosts({
  posts,
  title = "Related Articles",
}: RelatedPostsProps) {
  if (!posts?.length) return null;

  return (
    <section
      aria-labelledby="related-heading"
      className="mt-16 pt-12 border-t border-white/6"
    >
      <h2
        id="related-heading"
        className="text-[20px] font-semibold text-foreground mb-6"
      >
        {title}
      </h2>

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        role="list"
      >
        {posts.map((post) => (
          <div key={post._id} role="listitem">
            <PostCard post={post} showImage={false} />
          </div>
        ))}
      </div>
    </section>
  );
}