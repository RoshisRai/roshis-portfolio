import { Tag } from "@/components/ui/tag"
import dynamic from "next/dynamic"
import { GlobePlaceholder } from "./GlobePlaceholder";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { CursorZone } from "@/components/global/cursor/cursor-zone";

const GlobeCanvas = dynamic(
    () => import('./GlobeCanvas').then((mod) => mod.GlobeCanvas),
    { 
        ssr: false,
        loading: () => <GlobePlaceholder />
    }
)

export const Globe = () => {
    const reducedMotion = useReducedMotion()
    return (
        <CursorZone variant="scene" className="w-full lg:w-[45%]">
            <div className="relative flex flex-col items-center justify-center bg-radial from-accent-glow/5 to-transparent backdrop-blur-sm overflow-hidden min-h-75">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-slate-500)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-slate-500)_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_48%_50%_at_50%_50%,#fff_80%,transparent_100%)] opacity-40"></div>

                
                <div className="relative z-10 flex h-48 w-48 items-center justify-center rounded-full">
                    { reducedMotion ? <GlobePlaceholder /> : <GlobeCanvas /> }
                </div>

                <Tag
                    variant="status"
                    statusColor="#4ade80"
                    className="bg-accent-glow/60 border border-[#4ade80]/20 hero-status mt-6"
                >
                    <span className="text-xs text-text-primary/80 z-1">
                        Based in Toronto • Operating Worldwide
                    </span>
                </Tag>
        </div>
        </CursorZone>
    )
}