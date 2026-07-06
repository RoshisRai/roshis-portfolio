import {
    AlertTriangle,
    Info,
    Lightbulb,
    StickyNote,
} from "lucide-react"

import type { LucideIcon } from "lucide-react"

import type { SanityCalloutBlock } from "@/types/blog"
import { cn } from "@/lib/utils"

interface CalloutProps {
    value: SanityCalloutBlock
    className?: string
}

const CALLOUT_VARIANTS = {
    info: {
        icon: Info,
        iconColor: "text-blue-400",
        border: "border-blue-500/30",
        bg: "bg-blue-500/5",
        label: "Info",
        role: "note" as const,
    },

    warning: {
        icon: AlertTriangle,
        iconColor: "text-amber-400",
        border: "border-amber-500/30",
        bg: "bg-amber-500/5",
        label: "Warning",
        role: "alert" as const,
    },

    tip: {
        icon: Lightbulb,
        iconColor: "text-emerald-400",
        border: "border-emerald-500/30",
        bg: "bg-emerald-500/5",
        label: "Tip",
        role: "note" as const,
    },

    note: {
        icon: StickyNote,
        iconColor: "text-purple-400",
        border: "border-purple-500/30",
        bg: "bg-purple-500/5",
        label: "Note",
        role: "note" as const,
    },
} satisfies Record<
    SanityCalloutBlock["type"],
    {
        icon: LucideIcon
        iconColor: string
        border: string
        bg: string
        label: string
        role: "note" | "alert"
    }
>

export function Callout({
    value,
    className,
}: CalloutProps) {
    const variant = CALLOUT_VARIANTS[value.type]
    const Icon = variant.icon

    const headingId = `callout-${value._key}`

    return (
        <aside
            role={variant.role}
            aria-labelledby={headingId}
            className={cn(
                "my-6 rounded-xl border-l-4 p-4",
                variant.border,
                variant.bg,
                className,
            )}
        >
            <div className="flex gap-3">
                <Icon
                    size={18}
                    className={cn(
                        "mt-0.5 shrink-0",
                        variant.iconColor,
                    )}
                    aria-hidden="true"
                />

                <div className="space-y-1">
                    <strong
                        id={headingId}
                        className="block text-sm font-semibold text-foreground"
                    >
                        {variant.label}
                    </strong>

                    <p className="text-sm leading-relaxed text-foreground/80">
                        {value.content}
                    </p>
                </div>
            </div>
        </aside>
    )
}