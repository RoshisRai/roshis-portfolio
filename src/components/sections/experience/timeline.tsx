'use client'

import { experiences } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { useRef } from "react"

export const Timeline = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    const lineTrackRef = useRef<HTMLDivElement>(null)
    const lineRef = useRef<HTMLDivElement>(null)

    return (
        <div
            ref={containerRef}
            className="relative"
        >
            {/* Visible only on md+ devices */}
            <div
                ref={lineTrackRef}
                className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-border md:block"
            >
                <div
                    ref={lineRef}
                    className="h-full w-full origin-top bg-accent"
                    style={{ translate: 'scaleY(0)' }}
                />
            </div>

            {/* Mobile: Left edge timeline track */}
            <div className="absolute left-4.75 top-0 h-full w-px bg-border md:hidden">
                <div className="h-full w-full origin-top bg-accent" />
            </div>

            {/* Timeline Entries */}
            <div className="relative space-y-12 md:space-y-16">
                {experiences.map((exp, i) => {
                    const isLeft = i % 2 === 0
                    return (
                        <div
                            key={exp.id}
                            className="relative flex items-start"
                        >
                            {/* DESKTOP: Alternating layout */}
                            <div className="hidden w-full md:flex">
                                {/* Left Node */}
                                <div className="flex w-1/2 justify-end pr-10">
                                    {isLeft && (
                                        <div data-timeline-card className="w-full max-w-md">
                                            <p>{exp.role} - {exp.company}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Center Node */}
                                <div className="relative flex items-start justify-center">
                                    <div
                                        data-timeline-node
                                        className={cn(
                                        'relative z-10 mt-6 flex h-4 w-4 items-center justify-center',
                                        'rounded-full border-[2.5px] border-accent bg-background',
                                        'shadow-[0_0_0_4px_var(--color-background)]',
                                        )}
                                    >
                                        {/* Inner dot */}
                                        <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                                    </div>
                                </div>
                                
                                {/* Right Node */}
                                <div className="flex w-1/2 pl-10">
                                    {!isLeft && (
                                        <div data-timeline-card className="w-full max-w-md">
                                            <p>{exp.role} - {exp.company}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* MOBILE: Single Column layout */}
                            <div className="flex w-full items-start md:hidden">
                                {/* Node */}
                                <div className="relative z-10 mx-3 mt-5 shrink-0">
                                    <div
                                        data-timeline-node
                                        className={cn(
                                        'flex h-3.5 w-3.5 items-center justify-center',
                                        'rounded-full border-2 border-accent bg-background',
                                        'shadow-[0_0_0_3px_var(--color-background)]',
                                        )}
                                    >
                                        <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                                    </div>
                                </div>

                                {/* Card */}
                                <div data-timeline-card className="flex-1">
                                        <p>{exp.role} - {exp.company}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}