import { getAdjacentProjects, getAllProjects, getProjectBySlug } from "@/lib/projects";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { CursorZone } from "@/components/global/cursor/cursor-zone";
import { CaseStudyPage } from "@/components/case-study/case-study-page";

interface PageProps {
    params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
    return getAllProjects().map((project) => ({
        slug: project.slug
    }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params
    const project = getProjectBySlug(slug)
    if (!project) return {}

    return {
        title: `${project.title} - Case Study`,
        description: project.summary,
        openGraph: {
            title: project.title,
            description: project.summary,
            images: [
                {
                    url: project.media.cover,
                    width: 1200,
                    height: 630,
                    alt: `${project.title} cover image`
                }
            ],
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            images: [project.media.cover],
        }
    }
}

export default async function ProjectCaseStudyRoute({ params }: PageProps) {
    const { slug } = await params;

    const project = getProjectBySlug(slug)
    if (!project) notFound()

    const { prev, next } = getAdjacentProjects(slug) 

    return (
        <CursorZone variant='default'>
            <CaseStudyPage 
                project={project} 
                prev={prev ? { slug: prev.slug, title: prev.title } : undefined} 
                next={next ? { slug: next.slug, title: next.title } : undefined} 
            />
        </CursorZone>
    )
}