import { cn } from "@/lib/utils"
import { ArrowUpRight } from "lucide-react"

interface ProjectCardOverlayProps {
    visible: boolean
}

export const ProjectCardOverlay = ({ visible }: ProjectCardOverlayProps) => {
    return (
        <div className={cn(
            'pointer-events-none absolute inset-0 flex items-end justify-center',
            'bg-[rgba(var(--project-accent-rgb),0.15)] backdrop-blur-[1px]',
            'motion-reduce:transition-none',
            visible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4',
            'transition-opacity duration-(--duration-fast), transform duration-(--duration-slow) --ease-out-expo',
            '[@media(hover:none)]:hidden', //Desktop-only
        )}>
            <div className="mb-4 flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[13px] font-medium text-white">
                View Case Study
                <ArrowUpRight size={18} className="ml-1" />
            </div>
        </div>
    )
}