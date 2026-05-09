import { SectionWrapper } from "@/components/layout/section-wrapper"
import { Timeline } from "./timeline"

export const ExperienceSection = () => {
    return (
        <SectionWrapper
            id="experience"
            title="Experience"
            subtitle="Where I&apos;ve built, shipped, and scaled."
            headingAlign="center"
        >
            <Timeline />
        </SectionWrapper>
    )
}