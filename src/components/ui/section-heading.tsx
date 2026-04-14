import { cn } from "@/lib/utils"

interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string
    subtitle?: string
    align?: 'left' | 'center' | 'right'
    as?: 'h1' | 'h2' | 'h3'
}

const SectionHeading = ({
    title,
    subtitle,
    align = 'left',
    as: Tag = 'h2',
    className,
    ...props
}: SectionHeadingProps) => {
    return (
        <div
            className={cn(
                'flex flex-col',
                // Margin to content (48px). Reduced when subtitle present since
                // the subtitle itself gets mb-2 (8px) and total gap stays ~48px.
                subtitle ? 'mb-10' : 'mb-12',
                align === 'center' && 'items-center text-center',
                align === 'right' && 'items-end text-right',
                className,
            )}
            {...props}
        >
            <Tag
                className={cn(
                    'font-display font-bold text-text-primary leading-[1.1] tracking-tight',
                    // 48px heading
                    'text-[clamp(32px,5vw,48px)]',
                    subtitle ? 'mb-2' : '',
                )}
            >
                {title}
            </Tag>
            {subtitle && (
                <p className="text-[18px] font-normal text-text-secondary leading-relaxed max-width-prose">
                    {subtitle}
                </p>
            )}

        </div>
    )
}

SectionHeading.displayName = 'SectionHeading'

export { SectionHeading, type SectionHeadingProps }