import {
  getAdjacentProjects,
  getAllProjects,
  getProjectBySlug,
} from "@/lib/projects";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CursorZone } from "@/components/global/cursor/cursor-zone";
import { CaseStudyPage } from "@/components/case-study/case-study-page";

import { siteConfig } from "@/seo/config/site";
import { JsonLd } from "@/components/seo/json-ld";
import {
    getProjectJsonLd,
    getBreadcrumbJsonLd
 } from "@/seo/jsonld"

interface PageProps {
  params: Promise<{ slug: string }>;
}

const pathUrl = (slug: string) => `/projects/${slug}`;
const absoluteUrl = (path: string) => `${siteConfig.url}${path}`;

export async function generateStaticParams() {
  return getAllProjects().map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
      description: "The requested case study could not be found.",
    };
  }

  const url = absoluteUrl(pathUrl(project.slug));
  const coverImage = absoluteUrl(project.media.cover);

  return {
    title: `${project.title} Case Study`,
    description: project.summary,

    alternates: {
      canonical: url,
    },

    robots: {
      index: true,
      follow: true,
    },

    authors: [
      {
        name: siteConfig.author,
        url: siteConfig.url,
      },
    ],

    openGraph: {
      title: `${project.title} Case Study`,
      description: project.summary,
      url,
      type: "article",
      siteName: siteConfig.name,
      images: [
        {
          url: coverImage,
          width: 1200,
          height: 630,
          alt: `${project.title} Case Study Cover`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `${project.title} Case Study`,
      description: project.summary,
      images: [coverImage],
    },
  };
}

export default async function ProjectCaseStudyRoute({
  params,
}: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  const { prev, next } = getAdjacentProjects(slug);

  return (
    <>
      <JsonLd data={getProjectJsonLd(project)} />
      <JsonLd data={getBreadcrumbJsonLd(project)} />

      <CursorZone variant="default">
        <CaseStudyPage
          project={project}
          prev={prev ? { slug: prev.slug, title: prev.title } : undefined}
          next={next ? { slug: next.slug, title: next.title } : undefined}
        />
      </CursorZone>
    </>
  );
}