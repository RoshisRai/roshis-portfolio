import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'ghost' | 'icon'
    size?: 'default' | 'sm' | 'lg'
    asChild?: boolean
    ref?: React.Ref<HTMLButtonElement>
}

const Button = ({ 
    variant = 'primary', 
    size = 'default',
    className,
    ref,
    ...props 
}: ButtonProps) => {
    return (
        <button 
            ref={ref}
            className={cn(
                // Base styles
                'inline-flex items-center justify-center gap-2',
                'rounded-xl font-semibold',
                'transition-all duration-(--duration-fast)',
                'focus-visible:outline-2 focus-visible:outline-offset-2',
                'focus-visible:outline-accent',
                'disabled:pointer-events-none disabled:opacity-40',
                // Variants
                variant === 'primary' && [
                    'bg-accent text-white',
                    'hover:-translate-y-0.5',
                    'hover:shadow-[0_8px_24px_var(--color-accent-glow)]',
                ],
                variant === 'ghost' && [
                    'border border-border bg-transparent text-text-primary',
                    'hover:bg-surface hover:border-text-secondary',
                ],
                variant === 'icon' && [
                    'border border-border bg-transparent text-text-secondary',
                    'hover:bg-surface hover:text-text-primary',
                ],
                // Sizes
                size === 'default' && 'h-12 px-6 text-[15px]',
                size === 'sm' && 'h-9 px-4 text-[13px]',
                size === 'lg' && 'h-14 px-8 text-base',
                className,
            )}
            {...props}
        />
    )
}

Button.displayName = 'Button'

export { Button, type ButtonProps }

