import { ScrollToSection } from "@/components/global/scroll-to-section"
import { SectionWrapper } from "@/components/layout/section-wrapper"
import { ExperienceSection } from "@/components/sections/experience/experience-section"
import { HeroSection } from "@/components/sections/hero/hero"
import { ProjectsSection } from "@/components/sections/projects/projects-section"
import { SkillsSection } from "@/components/sections/skills/skills-section"

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