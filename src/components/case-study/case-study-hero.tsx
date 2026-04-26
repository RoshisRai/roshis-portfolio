import Image from 'next/image'
import type { ProjectFrontmatter } from '@/types/project'
import {
    projectAccentVTName,
    projectMediaVTName,
    projectTitleVTName,
} from '@/lib/project-transition'

interface CaseStudyHeroProps {
    project: ProjectFrontmatter
}

export const CaseStudyHero = ({ project }: CaseStudyHeroProps) => {
    return (
        <section
            id="cs-hero"
            aria-labelledby="cs-hero-title"
            className="relative pt-24 pb-20"
        >
            {/* Page-level accent wash. Shares VT name with the card's wash. */}
            <span
                aria-hidden
                className="cs-bg-wash pointer-events-none absolute inset-x-0 top-0 -z-10 h-[80vh]"
                style={{
                    viewTransitionName: projectAccentVTName(project.slug),
                    background:
                        'radial-gradient(80% 50% at 50% 0%, var(--project-accent-soft), transparent 70%)',
                }}
            />

            <div className="mx-auto max-w-(--max-width-content) px-6 grid grid-cols-1 xl:grid-cols-2 gap-4">
                {/* Morph target — must match VT name from ProjectCardMedia */}
                <div
                    className="relative w-full aspect-video"
                    >
                    <Image
                        src={project.media.cover}
                        alt={project.media.alt}
                        fill
                        priority
                        sizes="(max-width: 1280px) 100vw, 1280px"
                        style={{ viewTransitionName: projectMediaVTName(project.slug) }}
                        className="object-cover overflow-hidden rounded-3xl"
                    />
                </div>

                {/* Title — also a morph target */}
                <div className="project-case-study-content">
                    <h1
                        id="cs-hero-title"
                        data-cs-stagger="2"
                        style={{ viewTransitionName: projectTitleVTName(project.slug) }}
                        className="mt-10 font-display font-extrabold tracking-tight text-text-primary leading-[1.05] text-[clamp(40px,7vw,72px)] max-w-4xl"
                    >
                        {project.title}
                    </h1>

                    <p
                        data-cs-stagger="3"
                        className="my-5 max-w-prose text-[18px] leading-relaxed text-text-secondary"
                    >
                        {project.intro}
                    </p>
                </div>
            </div>
        </section>
    )
}