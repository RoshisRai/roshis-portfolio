import { ScrollToSection } from "@/components/global/scroll-to-section"
import { SectionWrapper } from "@/components/layout/section-wrapper"
import { HeroSection } from "@/components/sections/hero/hero"
import { ProjectsSection } from "@/components/sections/projects/projects-section"

export default function Home() {
    return (
        <>
            <ScrollToSection />

            <HeroSection />

            {/* Projects */}
            <ProjectsSection />
            
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