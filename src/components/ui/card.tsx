import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Tag } from "./tag";
import React from 'react';

// ─── Base Card ────────────────────────────────────────────────────────────────

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hoverable?: boolean
}

const Card = ({ 
    hoverable = true, 
    className, 
    children, 
    ...props 
}: CardProps) => {
    return (
        <div
            className={cn(
                'rounded-2xl p-6',
                'bg-surface border border-border',
                'transition-all duration-(--duration-fast)',
                hoverable && [
                    'hover:-translate-y-1',
                    'hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)]',
                    'hover:border-border',
                ],
                className,
            )}
            {...props}
        >
            {children}
        </div>
    )
}

// ─── Project Card ─────────────────────────────────────────────────────────────

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

// ---- Experience Card ────────────────────────────────────────────────────────────────

interface ExperienceCardProps extends React.HTMLAttributes<HTMLDivElement> {
    role: string
    company: string
    period: string
    location?: string
    description?: string
    tags?: string[]
    isLast?: boolean
}

const ExperienceCard = ({
    role,
    company,
    period,
    location,
    description,
    tags = [],
    isLast = false,
    className,
    ...props
}: ExperienceCardProps) => {
    return (
        <div
            className={cn(
                'relative flex gap-6',
                !isLast && 'mb-6',
                className,
            )}
            {...props}
        >
            {/* Timeline spine */}
            <div className="flex flex-col items-center shrink-0 pt-5.5">
                <div className="w-2.5 h-2.5 rounded-full bg-accent ring-4 ring-accent/20 shrink-0" />
                {!isLast && (
                    <div className="w-px flex-1 bg-border mt-2" />
                )}
            </div>
            {/* Card body */}
            <div
                className={cn(
                    'flex-1 rounded-2xl p-6',
                    'bg-surface border border-border',
                )}
            >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-3">
                    <div>
                        <h3 className="font-display font-semibold text-[17px] text-text-primary">
                            {role}
                        </h3>
                        <p className="text-[14px] text-accent font-medium mt-0.5">{company}</p>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-0.5 shrink-0">
                        <span className="text-[12px] text-text-secondary font-mono">{period}</span>
                        {location && (
                            <span className="text-[12px] text-text-secondary">{location}</span>
                        )}
                    </div>
                </div>

                {description && (
                    <p className="text-[14px] text-text-secondary leading-relaxed mb-3">
                        {description}
                    </p>
                )}

                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {tags.map((tag) => (
                            <Tag key={tag} variant="tech">{tag}</Tag>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

// ---- Skill Card ────────────────────────────────────────────────────────────────

interface SkillCardProps extends React.HTMLAttributes<HTMLDivElement> {
    icon: React.ReactNode
    label: string
    sublabel?: string
}

const SkillCard = ({
    icon,
    label,
    sublabel,
    className,
    ...props
}: SkillCardProps) => {
    return (
        <div
            className={cn(
                'group flex flex-col items-center justify-center gap-3',
                'w-30 h-30',
                'rounded-2xl p-4',
                'bg-surface border border-border',
                'transition-all duration-(--duration-fast)',
                'hover:-translate-y-1 hover:border-accent/40',
                'hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)]',
                'cursor-default select-none',
                className,
            )}
            {...props}
        >
            <div className="text-text-secondary group-hover:text-accent transition-colors">
                {icon}
            </div>
            <div className="text-center">
                <p className="text-[12px] font-medium text-text-primary leading-tight">{label}</p>
                {sublabel && (
                    <p className="text-[10px] text-text-secondary mt-0.5">{sublabel}</p>
                )}
            </div>
        </div>
    )
}

Card.displayName = 'Card'
ProjectCard.displayName = 'ProjectCard'
ExperienceCard.displayName = 'ExperienceCard'
SkillCard.displayName = 'SkillCard'

export {
    Card,
    ProjectCard,
    ExperienceCard,
    SkillCard,
    type CardProps,
    type ProjectCardProps,
    type ExperienceCardProps,
    type SkillCardProps,
}