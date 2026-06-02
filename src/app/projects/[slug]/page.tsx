import { getAdjacentProjects, getAllProjects, getProjectBySlug } from "@/lib/projects";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CursorZone } from "@/components/global/cursor/cursor-zone";
import { CaseStudyPage } from "@/components/case-study/case-study-page";

interface PageProps {
    params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
    return getAllProjects().map((project) => ({
        slug: project.slug,
    }))
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { slug } = await params
    const project = getProjectBySlug(slug)

    if (!project) return {}

    const pathUrl = `/projects/${project.slug}`
    const coverImagePath = project.media.cover

    return {
        title: `${project.title} Case Study`,
        description: project.summary,
        alternates: {
            canonical: pathUrl,
        },
        robots: {
            index: true,
            follow: true,
        },
        authors: [
            {
                name: "Roshis Rai",
                url: "https://roshis.dev",
            },
        ],
        openGraph: {
            title: `${project.title} Case Study`,
            description: project.summary,
            url: pathUrl,
            type: "article",
            images: [
                {
                url: coverImagePath,
                width: 1200,
                height: 630,
                alt: `${project.title} Case Study Cover Preview`,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: `${project.title} Case Study`,
            description: project.summary,
            images: [coverImagePath],
        },
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