import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getRecentPosts } from "@/lib/sanity/queries";
import { cn } from "@/lib/utils";

import { PostCard } from "../../blog/post-card";
import { CursorZone } from "@/components/global/cursor/cursor-zone";

interface LatestPostsSectionProps {
    className?: string;
}

const MAX_POSTS = 3;

function ViewAllLink({
    mobile = false,
}: {
    mobile?: boolean;
}) {
    return (
        <CursorZone variant="link" className="content">
            <Link
                href="/blog"
                className={cn(
                    "inline-flex items-center gap-1.5 text-[14px] font-medium text-indigo-400 transition-colors hover:text-indigo-300",
                    mobile ? "md:hidden" : "hidden md:inline-flex",
                )}
            >
                View all articles

                <ArrowRight size={14} />
            </Link>
        </CursorZone>
    );
}

export async function LatestPostsSection({
    className,
}: LatestPostsSectionProps) {
    const posts =
        await getRecentPosts(MAX_POSTS);

    if (posts.length === 0) {
        return null;
    }

    return (
        <section
            id="writing"
            aria-labelledby="writing-heading"
            className={cn(
                "py-(--spacing-section-mobile) md:pt-20 md:pb-0",
                "bg-surface",
                className,
            )}
        >
            <div className={cn(
                'mx-auto w-full',
                'max-w-(--max-width-content)',
                'px-6 md:px-12',
            )}>
                <header className="mb-10 flex items-end justify-between gap-8">
                    <div>
                        <h2
                            id="writing-heading"
                            className="text-[28px] font-bold text-foreground md:text-[32px]"
                        >
                            Latest Writing
                        </h2>

                        <p className="mt-2 text-[16px] text-foreground/50">
                            Technical articles on
                            engineering, software
                            architecture, and system
                            design.
                        </p>
                    </div>

                    <ViewAllLink />
                </header>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                        <PostCard
                            key={post._id}
                            post={post}
                        />
                    ))}
                </div>

                <div className="mt-8 flex justify-center">
                    <ViewAllLink mobile />
                </div>
            </div>
        </section>
    );
}