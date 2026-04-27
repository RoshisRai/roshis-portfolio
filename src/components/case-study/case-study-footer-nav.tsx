'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { ProjectFrontmatter } from '@/types/project'
import { disableProjectSharedVTForNextNav, navBack, navForward } from '@/lib/project-transition'
import { useSmoothScroll } from '@/hooks/use-smooth-scroll'


interface CaseStudyFooterNavProps {
    prev?: Pick<ProjectFrontmatter, 'slug' | 'title'>
    next?: Pick<ProjectFrontmatter, 'slug' | 'title'>
}

export const CaseStudyFooterNav = ({ prev, next }: CaseStudyFooterNavProps) => {

    const scrollTo = useSmoothScroll()

    const handleBack = () => {
        if (prev === undefined) {
            disableProjectSharedVTForNextNav()
            scrollTo('/#projects')
        }
    }

    return (
        <nav
            aria-label="Project navigation"
            className="border-t border-border py-12"
            style={{ viewTransitionName: 'case-study-footer-nav'}}
        >
            <div className="mx-auto max-w-(--max-width-content) px-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Link
                    href={prev ? `/projects/${prev.slug}` : '/'}
                    transitionTypes={prev ? navBack : undefined}
                    onClick={handleBack}
                    className="group flex items-center gap-3 rounded-2xl border border-border bg-surface p-5 hover:border-[rgba(var(--project-accent-rgb),0.4)] transition-colors duration-(--duration-fast)"
                >
                    <ArrowLeft
                        size={18}
                        className="text-text-secondary group-hover:-translate-x-1 group-hover:text-[color:var(--project-accent)] transition-transform duration-(--duration-fast)"
                    />
                    <div className="flex flex-col">
                        <span className="text-[12px] font-mono uppercase tracking-wider text-text-secondary">
                            Back
                        </span>
                        <span className="text-[15px] font-medium text-text-primary">
                            {prev ? prev.title : 'All Projects'}
                        </span>
                    </div>
                </Link>

                {next && (
                    <Link
                        href={`/projects/${next.slug}`}
                        transitionTypes={navForward}
                        className="group flex items-center justify-end gap-3 rounded-2xl border border-border bg-surface p-5 hover:border-[rgba(var(--project-accent-rgb),0.4)] transition-colors duration-(--duration-fast) text-right"
                    >
                        <div className="flex flex-col items-end">
                            <span className="text-[12px] font-mono uppercase tracking-wider text-text-secondary">
                                Next
                            </span>
                            <span className="text-[15px] font-medium text-text-primary">
                                {next.title}
                            </span>
                        </div>
                        <ArrowRight
                            size={18}
                            className="text-text-secondary group-hover:translate-x-1 group-hover:text-[color:var(--project-accent)] transition-transform duration-(--duration-fast)"
                        />
                    </Link>
                )}
            </div>
        </nav>
    )
}