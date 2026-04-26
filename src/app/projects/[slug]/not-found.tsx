'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSmoothScroll } from '@/hooks/use-smooth-scroll'
import { CursorZone } from '@/components/global/cursor/cursor-zone'

export default function NotFound() {

    const router = useRouter()
    const scrollTo = useSmoothScroll()

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        router.push('/')
        console.log('Navigating back to projects section')
        setTimeout(() => {
            console.log('Scrolling to projects section')
            scrollTo('#projects')
        }, 350)
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
            <p className="font-mono text-[12px] uppercase tracking-wider text-text-secondary mb-3">
                404
            </p>
            <h1 className="font-display font-bold text-[clamp(28px,4vw,40px)] text-text-primary mb-4">
                Project not found
            </h1>
            <p className="text-text-secondary max-w-md mb-8">
                The project you&rsquo;re looking for doesn&rsquo;t exist or has been moved.
            </p>
            <CursorZone variant='button'>
                <Link
                    href="/#projects"
                    onClick={handleClick}
                    className="text-[color:var(--color-accent)] hover:text-[color:var(--color-accent-hover)] transition-colors"
                >
                    ← Back to projects
                </Link>
            </CursorZone>
        </div>
    )
}