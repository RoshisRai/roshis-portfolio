import { cn } from "@/lib/utils"

interface TagProps extends React.HTMLAttributes<HTMLButtonElement> {
    variant?: 'tech' | 'status' | 'filter'
    active?: boolean
    statusColor?: string
}

const Tag = ({
    variant = 'tech',
    active = false,
    statusColor = '#4ade80',
    className,
    children,
    ...props
}: TagProps) => {
    return (
        <span
            className={cn(
                // Base
                'inline-flex items-center gap-1.5',
                'rounded-[14px] font-medium',
                'transition-all duration-(--duration-fast)',
                'whitespace-nowrap',
                // Variants
                variant === 'tech' && [
                    'h-7 px-3',
                    'text-[11px] uppercase tracking-wider',
                    'bg-surface text-text-secondary border border-border',
                ],
                variant === 'status' && [
                    'h-7 px-3',
                    'text-[12px]',
                    'bg-surface text-text-primary border border-border',
                ],
                variant === 'filter' && [
                    'h-8 px-3.5 cursor-pointer select-none',
                    'text-[14px]',
                    'border',
                    active
                        ? 'bg-accent text-white border-accent'
                        : 'bg-transparent text-text-secondary border-border hover:border-text-secondary hover:text-text-primary',
                ],
                className,
            )}
            {...props}
        >
            {variant === 'status' && (
                <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: statusColor }}
                />
            )}
            {children}
        </span>
    )
}

Tag.displayName = 'Tag'

export { Tag, type TagProps }