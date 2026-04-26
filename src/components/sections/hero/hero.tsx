import { SectionWrapper } from "@/components/layout/section-wrapper"
import HeroContent from "./hero-content"
import HeroScene from "./hero-scene"
import { ScrollIndicator } from "./scroll-indicator"
import { CursorZone } from "@/components/global/cursor/cursor-zone"


export const HeroSection = () => {
    return (
        <SectionWrapper
            id="hero"
            contained={false}
            className="relative min-h-screen overflow-hidden md:py-(--spacing-section-mobile) lg:py-(--spacing-section)"
        >
            {/* Animated gradient background */}
            <div aria-hidden className="hero-gradient-bg absolute inset-0" />
            <div aria-hidden className="absolute inset-0 bg-background/60" />
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 z-1 h-32 md:h-44 bg-linear-to-b from-transparent via-background/72 to-background"
            />


            <div className="relative z-10 mx-auto flex max-w-(--max-width-content) flex-col px-6 md:px-12 lg:grid lg:grid-cols-12 lg:gap-4">
                {/* Tablet/Desktop 3D Scene (Hidden on mobile) */}
                <div className="relative order-1 hidden h-[40vh] min-h-75px md:block lg:order-2 lg:col-span-7 lg:h-[50vh] lg:max-h-155 overflow-hidden">
                    <div className="absolute inset-2 rounded-2xl">
                        <HeroScene />
                    </div>
                </div>

                {/* Mobile Fallback Visual */}
                <div className="hero-particles order-1 h-[30vh] rounded-2xl md:hidden" />

                <div className="order-2 flex flex-col justify-center py-8 md:py-0 lg:order-1 lg:col-span-5 lg:py-0 lg:min-h-[60vh]">
                    <HeroContent />
                </div>
            </div>
            {/* Scroll Indicator */}
            <CursorZone variant='button' >
                <ScrollIndicator />
            </CursorZone>
        </SectionWrapper>
    )
}
