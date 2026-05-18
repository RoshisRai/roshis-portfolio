import { CursorZone } from "@/components/global/cursor/cursor-zone";
import { socialLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const SocialLinks = () => {
    return (
        <div className="flex items-center justify-center gap-3">
            {socialLinks.map(({ label, href, icon: Icon }) => (
                <CursorZone
                    key={label}
                    variant="button"
                >
                    <Link
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className={cn(
                            "group flex items-center justify-center w-10 h-10 rounded-lg",
                            "border border-border/80 bg-background/60",
                            "transition-all duration-200",
                            "hover:bg-background hover:border-border hover:-translate-y-0.5"
                        )}
                    >
                        <Icon
                            size={18}
                            className="text-text-primary/80 group-hover:text-text-primary transition-colors duration-200"
                        />
                    </Link>
                </CursorZone>
            ))}
        </div>
    )
}