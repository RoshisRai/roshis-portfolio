import { ScrollToSection } from "@/components/global/scroll-to-section"
import { SectionWrapper } from "@/components/layout/section-wrapper"

export default function Home() {
    return (
        <>
            <ScrollToSection />

            {/* Hero — full bleed, no heading, no section padding */}
            <SectionWrapper
                id="hero"
                contained={false}
                className="flex min-h-screen items-center justify-center bg-background py-0"
            >
                <div className="text-center">
                    <h1 className="font-display text-6xl font-bold text-text-primary">
                        Roshis Rai
                    </h1>
                    <p className="mt-4 text-xl text-text-secondary">
                        Full-Stack Software Engineer
                    </p>
                </div>
            </SectionWrapper>

            {/* Projects */}
            <SectionWrapper
                id="projects"
                title="Projects"
                subtitle="A selection of things I've built."
                className="bg-surface"
            >
                <p className="text-text-secondary">Project cards go here</p>
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