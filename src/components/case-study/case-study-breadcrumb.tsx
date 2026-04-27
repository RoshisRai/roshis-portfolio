'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { disableProjectSharedVTForNextNav, navBack } from '@/lib/project-transition'
import { useSmoothScroll } from '@/hooks/use-smooth-scroll'
import { CursorZone } from '../global/cursor/cursor-zone'

interface CaseStudyBreadcrumbProps {
    title: string
}

export const CaseStudyBreadcrumb = ({ title }: CaseStudyBreadcrumbProps) => {

    const scrollTo = useSmoothScroll()

    const handleBack = () => {
        disableProjectSharedVTForNextNav()
        scrollTo('/#projects')
    }
    return (
        <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-[13px] text-text-secondary"
        >
            <CursorZone variant='button'>
                <Link
                    href='/'
                    transitionTypes={navBack}
                    onClick={handleBack}
                    className="hover:text-text-primary transition-colors"
                >
                    Projects
                </Link>
            </CursorZone>
            <ChevronRight size={14} className="opacity-50" />
            <span className="text-text-primary line-clamp-1">{title}</span>
        </nav>
    )
}