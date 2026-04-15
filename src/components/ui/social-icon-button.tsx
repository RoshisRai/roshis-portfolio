import { cn } from "@/lib/utils";

interface SocialIconButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    icon: React.ReactNode
    label: string
    variant?: 'ghost' | 'filled'
    ref?: React.Ref<HTMLAnchorElement>
}

const SocialIconButton = ({
    icon,
    label,
    variant = 'ghost',
    className,
    ...props
}: SocialIconButtonProps) => {
    return (
        <a
            aria-label={label}
            rel="noopener noreferrer"
            {...props}
            target={props.target ?? "_blank"}
            className={cn(
                // Layout
                'inline-flex items-center justify-center',
                'w-10 h-10 rounded-[10px]',
                // Base
                'border border-border text-text-secondary',
                'transition-all duration-(--duration-fast)',
                // Variants
                variant === 'ghost' && [
                    'bg-transparent',
                    'hover:bg-surface hover:text-text-primary hover:border-text-secondary',
                    'hover:-translate-y-0.5',
                ],
                variant === 'filled' && [
                    'bg-surface',
                    'hover:bg-surface-alt hover:text-text-primary hover:border-text-secondary',
                    'hover:-translate-y-0.5',
                ],
                // Focus
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                className,
            )}
        >
            {icon}
        </a>
    )
}

SocialIconButton.displayName = 'SocialIconButton'

export { SocialIconButton, type SocialIconButtonProps }