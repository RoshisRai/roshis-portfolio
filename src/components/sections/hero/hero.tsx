import { SectionWrapper } from "@/components/layout/section-wrapper"
import HeroContent from "./hero-content"
import HeroScene from "./hero-scene"
import { ScrollIndicator } from "./scroll-indicator"


export default function HeroSection() {
    return (
        <SectionWrapper
            id="hero"
            contained={false}
            className="relative min-h-screen overflow-hidden"
        >
            {/* Animated gradient background */}
            <div aria-hidden className="hero-gradient-bg absolute inset-0" />
            <div aria-hidden className="absolute inset-0 bg-background/60" />

            <div className="relative z-10 mx-auto flex max-w-(--max-width-content) flex-col px-6 md:px-12 lg:grid lg:grid-cols-12 lg:gap-4">
                {/* Tablet/Desktop 3D Scene (Hidden on mobile) */}
                <div className="relative order-1 hidden h-[40vh] min-h-75px md:block lg:order-2 lg:col-span-7 lg:h-auto">
                    <div className="absolute inset-0 overflow-hidden rounded-2xl border border-border/60 bg-surface/20">
                        <HeroScene />
                    </div>
                </div>

                {/* Mobile Fallback Visual */}
                <div className="hero-particles order-1 mb-8 h-[35vh] rounded-2xl border border-border/60 bg-surface/20 md:hidden" />


                <div className="order-2 flex flex-col justify-center py-8 lg:order-1 lg:col-span-5 lg:py-0">
                    <HeroContent />
                </div>
            </div>
            {/* Scroll Indicator */}
            <ScrollIndicator />
        </SectionWrapper>
    )
}
