import { ScrollToSection } from "@/components/global/scroll-to-section"
import { SectionWrapper } from "@/components/layout/section-wrapper"
import HeroSection from "@/components/sections/hero/hero"
import UIComponentsTest from "@/components/ui/test-ui-components"
import { getFeaturedProjects } from "@/lib/projects"


export default function Home() {
    const projects = getFeaturedProjects()
    return (
        <>
            <ScrollToSection />

            {/* Hero — full bleed, no heading, no section padding */}
            <HeroSection />

            {/* <UIComponentsTest /> */}

            {/* Projects */}
            <SectionWrapper
                id="projects"
                title="Projects"
                subtitle="A selection of things I've built."
                className="bg-surface"
            >
                <pre className="mt-4 p-4 bg-background rounded wrap-break-word w-full overflow-x-auto text-sm">
                    {JSON.stringify(projects, null, 2)}
                </pre>
            </SectionWrapper>

            {/* Skills */}
            <SectionWrapper
                id="skills"
                title="Skills"
                subtitle="Technologies I work with."
                headingAlign="center"
                className="bg-background"
            >
                <p className="text-center text-text-secondary">Skill cards go here</p>
            </SectionWrapper>

            {/* Experience */}
            <SectionWrapper
                id="experience"
                title="Experience"
                subtitle="Where I've worked and what I've done."
                className="bg-surface"
            >
                <p className="text-text-secondary">Experience cards go here</p>
            </SectionWrapper>

            {/* About */}
            <SectionWrapper
                id="about"
                title="About"
                className="bg-background"
            >
                <p className="text-text-secondary">About content goes here</p>
            </SectionWrapper>

            {/* Contact */}
            <SectionWrapper
                id="contact"
                title="Get in Touch"
                subtitle="I'm always open to new opportunities and collaborations."
                headingAlign="center"
                className="bg-surface"
            >
                <p className="text-center text-text-secondary">Contact form goes here</p>
            </SectionWrapper>
        </>
    )
}