import { ScrollToSection } from "@/components/global/scroll-to-section"
import { AboutSection } from "@/components/sections/about/about-section"
import { ContactSection } from "@/components/sections/contact/contact-section"
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
            <AboutSection />

            {/* Contact */}
            <ContactSection />
        </>
    )
}