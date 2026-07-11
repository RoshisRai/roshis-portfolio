import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getRecentPosts } from "@/lib/sanity/queries";
import { cn } from "@/lib/utils";

import { CursorZone } from "@/components/global/cursor/cursor-zone";
import { LatestPostsClient } from "./latest-posts-client";

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
            <LatestPostsClient
                posts={posts}
                viewAllLinkDesktop={<ViewAllLink />}
                viewAllLinkMobile={<ViewAllLink mobile/>}
            />
        </section>
    );
}