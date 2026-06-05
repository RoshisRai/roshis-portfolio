import type { Metadata } from "next";

import { ScrollToSection } from "@/components/global/scroll-to-section"
import { AboutSection } from "@/components/sections/about/about-section"
import { ContactSection } from "@/components/sections/contact/contact-section"
import { ExperienceSection } from "@/components/sections/experience/experience-section"
import { HeroSection } from "@/components/sections/hero/hero"
import { ProjectsSection } from "@/components/sections/projects/projects-section"
import { SkillsSection } from "@/components/sections/skills/skills-section"
import { siteConfig } from "@/seo/config/site";

export const metadata: Metadata = {
    title: siteConfig.title,
    description: siteConfig.description,

    openGraph: {
        title: siteConfig.title,
        description: siteConfig.description,
        url: siteConfig.url,
        siteName: siteConfig.name,
        type: "website",
        images: [
        {
            url: siteConfig.ogImage,
            width: 1200,
            height: 630,
            alt: siteConfig.name,
        },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: siteConfig.title,
        description: siteConfig.description,
        images: [siteConfig.ogImage],
    },
};

export default function Home() {
    return (
        <>
            <ScrollToSection />

            <HeroSection />

            {/* Projects */}
            <ProjectsSection />
            
            {/* Skills */}
            <SkillsSection />

            {/* Experience */}
            <ExperienceSection />

            {/* About */}
            <AboutSection />

            {/* Contact */}
            <ContactSection />
        </>
    )
}