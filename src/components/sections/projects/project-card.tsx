import { Tag } from "@/components/ui/tag"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"


interface ProjectCardBaseProps {
    title: string
    description: string
    tags?: string[]
    image?: string
    imageAlt?: string
    className?: string
}

type ProjectCardProps = 
    | (ProjectCardBaseProps & { href: string; viewTransitionName: string }) 
    | (ProjectCardBaseProps & { href?: never; viewTransitionName?: never })

const ProjectCard = ({
    title,
    description,
    tags = [],
    image,
    imageAlt,
    href,
    viewTransitionName,
    className
}: ProjectCardProps) => {
    const inner = (
        <>
            {image && (
                <div className="relative w-full aspect-video overflow-hidden">
                    <Image
                        src={image}
                        alt={imageAlt ?? title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className={cn(
                            'object-cover transition-transform duration-(--duration-normal)',
                            href && 'group-hover:scale-[1.03]',
                        )}
                    />
                    {href && (
                        <div className="absolute inset-0 bg-linear-to-t from-surface/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-(--duration-fast)" />
                    )}
                </div>
            )}
            <div className="p-6 flex flex-col gap-3">
                <h3 className="font-display font-semibold text-[18px] text-text-primary leading-snug">
                    {title}
                </h3>
                <p className="text-[14px] text-text-secondary leading-relaxed line-clamp-3">
                    {description}
                </p>
                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                        {tags.map((tag) => (
                            <Tag key={tag} variant="tech">{tag}</Tag>
                        ))}
                    </div>
                )}
            </div>
        </>
    )

    const sharedClass = cn(
        'group block rounded-2xl overflow-hidden',
        'bg-surface border border-border',
        'transition-all duration-(--duration-fast)',
        className,
    )

    if (href) {
        return (
            <Link
                href={href}
                className={cn(
                    sharedClass,
                    'hover:-translate-y-1',
                    'hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)]',
                )}
                style={{ viewTransitionName }}
            >
                {inner}
            </Link>
        )
    }

    return <div className={sharedClass}>{inner}</div>
}

ProjectCard.displayName = 'ProjectCard'

export { ProjectCard, type ProjectCardProps }
