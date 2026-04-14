import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Text Input ───────────────────────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    variant?: 'default' | 'search'
    label?: string
    error?: string
    borderStyle?: 'full' | 'bottom'
}

const Input = ({
    variant = 'default',
    label,
    error,
    borderStyle = 'full',
    className,
    id,
    ...props
}: InputProps) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-') // replace spaces with dashes for id

    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className="text-[13px] font-medium text-text-secondary"
                >
                    {label}
                </label>
            )}
            <div className="relative">
                {variant === 'search' && (
                    <Search
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
                        size={16}
                    />
                )}
                <input
                    id={inputId}
                    className={cn(
                        // Base
                        'w-full h-12',
                        'bg-surface text-text-primary',
                        'text-[15px] font-normal',
                        'placeholder:text-text-secondary',
                        'transition-all duration-(--duration-fast)',
                        'outline-none',
                        'disabled:opacity-40 disabled:pointer-events-none',
                        // Border style
                        borderStyle === 'full' && [
                            'rounded-xl px-4',
                            'border border-border',
                            'focus:border-accent',
                        ],
                        borderStyle === 'bottom' && [
                            'rounded-none px-0',
                            'border-b border-border',
                            'focus:border-b-accent',
                            'bg-transparent',
                        ],
                        // Search padding
                        variant === 'search' && 'pl-10',
                        // Error state
                        error && 'border-red-500 focus:border-red-500',
                        className,
                    )}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-red-400 text-[13px] mt-1">
                    {error}
                </p>
            )}
        </div>
    )
}

// ---- Textarea Input ───────────────────────────────────────────────────────────────

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    error?: string
    borderStyle?: 'full' | 'bottom'
}

const Textarea = ({
    label,
    error,
    borderStyle = 'full',
    className,
    id,
    ...props
}: TextareaProps) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-') // replace spaces with dashes for id

    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className="text-[13px] font-medium text-text-secondary"
                >
                    {label}
                </label>
            )}
            <div className="relative">
                <textarea
                    id={inputId}
                    className={cn(
                        // Base
                        'w-full h-full',
                        'bg-surface text-text-primary',
                        'text-[15px] font-normal',
                        'placeholder:text-text-secondary',
                        'transition-all duration-(--duration-fast)',
                        'outline-none',
                        'disabled:opacity-40 disabled:pointer-events-none',
                        // Border style
                        borderStyle === 'full' && [
                            'rounded-xl px-4 py-3',
                            'border border-border',
                            'focus:border-accent',
                        ],
                        borderStyle === 'bottom' && [
                            'rounded-none px-0 py-1',
                            'border-b border-border',
                            'focus:border-b-accent',
                            'bg-transparent',
                        ],
                        // Error state
                        error && 'border-red-500 focus:border-red-500',
                        className,
                    )}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-red-400 text-[13px] mt-1">
                    {error}
                </p>
            )}
        </div>
    )
}

Input.displayName = 'Input'
Textarea.displayName = 'Textarea'

export { Input, Textarea, type InputProps, type TextareaProps }