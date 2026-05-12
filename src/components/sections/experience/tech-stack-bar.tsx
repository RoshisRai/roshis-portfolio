import { cn } from "@/lib/utils";
import type { TechDistribution } from "@/types/experience";
import { useState } from "react";

interface TechStackBarProps {
    distribution: TechDistribution;
}

const segmentConfig = [
    { key: 'frontend' as const, label: 'Frontend', color: 'bg-cyan-500' },
    { key: 'backend' as const, label: 'Backend', color: 'bg-blue-500' },
    { key: 'infrastructure' as const, label: 'Infrastructure', color: 'bg-purple-500' },
]

export const TechStackBar = ({ distribution }: TechStackBarProps) => {
    const [hoveredSegment, setHoveredSegment] = useState<string | null>(null)

    return (
        <div className="mt-4">
            {/* Bar */}
            <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-border/50">
                {segmentConfig.map(({ key, color })=> {
                    const width = distribution[key]
                    if (width === 0) return null
                    return (
                        <div 
                            key={key}
                            className={cn(
                                'h-full transition-all duration-300',
                                color,
                                hoveredSegment === key ? 'opacity-100' : 'opacity-70',
                                hoveredSegment && hoveredSegment !== key ? 'opacity-30' : '',
                            )}
                            style={{ width: `${width}%` }}
                            onMouseEnter={() => setHoveredSegment(key)}
                            onMouseLeave={() => setHoveredSegment(null)}
                        />
                    )
                })}
            </div>

            {/* Legend */}
            <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1">
                {segmentConfig.map(({ key, label, color }) => {
                    const width = distribution[key]
                    if (width === 0) return null
                    return (
                        <div
                            key={key}
                            className={cn(
                                'flex items-center gap-1.5 transition-opacity duration-200',
                                hoveredSegment && hoveredSegment !== key ? 'opacity-40' : 'opacity-100',
                            )}
                        >
                            <div className={cn('h-2 w-2 rounded-full', color)} />
                            <span className="text-xs font-medium text-text-secondary">
                                {label} {width}%
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}