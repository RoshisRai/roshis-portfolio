'use client'

import { CursorZone } from '@/components/global/cursor/cursor-zone';
import { cn } from '@/lib/utils';
import { useId, useState } from 'react'

interface FloatingInputProps {
    label: string;
    name: string;
    type?: "text" | "email";
    errors?: string[];
    required?: boolean;
}

export function Floatinginput({
    label,
    name,
    type,
    errors,
    required
}: FloatingInputProps ) {
    const id = useId()
    const [focused, setFocused] = useState(false)
    const [hasValue, setHasValue] = useState(false)
    const isActive = focused || hasValue

    return (
        <CursorZone variant="button" className="relative">
            <input 
                id={id}
                name={name}
                type={type}
                required={required}
                onFocus={() => setFocused(true)}
                onBlur={(e) => {
                    setFocused(false);
                    setHasValue(e.target.value.length > 0);
                }}
                onChange={(e) => setHasValue(e.target.value.length > 0)}
                className={cn(
                    "w-full bg-transparent border-b-2 pt-5 pb-2 text-base text-text-primary",
                    "outline-none transition-colors duration-200",
                    "border-border/50 focus:border-accent",
                    errors?.length && "border-red-500/60 focus:border-red-500"
                )}
                aria-invalid={ errors?.length ? true : undefined }
                aria-describedby={ errors?.length ? `${id}-error` : undefined }
            />
            <label
                htmlFor={id}
                className={cn(
                    "absolute left-0 text-text-primary/80 transition-all duration-200 pointer-events-none",
                    isActive
                        ? "top-0 text-xs text-accent"
                        : "top-5 text-base"
                )}
            >
                {label}
            </label>
            {errors?.map((error) => (
                <p
                    key={error}
                    id={`${id}-error`}
                    className='mt-1.5 text-[13px] text-red-400'
                    role="alert"
                >
                    {error}
                </p>
            ))}
        </CursorZone>
    )
}

interface FloatingTextareaProps {
    label: string;
    name: string;
    rows?: number;
    errors?: string[];
    required?: boolean;
}

export function FloatingTextarea({
    label,
    name,
    rows = 4,
    errors,
    required = true,
}: FloatingTextareaProps) {
    const id = useId()
    const [focused, setFocused] = useState(false)
    const [hasValue, setHasValue] = useState(false)
    const isActive = focused || hasValue

    return (
        <CursorZone variant="button" className="relative">
            <textarea 
                id={id}
                name={name}
                rows={rows}
                required={required}
                onFocus={() => setFocused(true)}
                onBlur={(e) => {
                setFocused(false);
                setHasValue(e.target.value.length > 0);
                }}
                onChange={(e) => setHasValue(e.target.value.length > 0)}
                className={cn(
                    "w-full bg-transparent border-b-2 pt-5 pb-2 text-base text-text-primary resize-none",
                    "outline-none transition-colors duration-200",
                    "border-border/50 focus:border-accent",
                    errors?.length && "border-red-500/60 focus:border-red-500"
                )}
                aria-invalid={errors?.length ? true : undefined}
                aria-describedby={errors?.length ? `${id}-error` : undefined}
            />
            <label
                htmlFor={id}
                className={cn(
                "absolute left-0 text-foreground/50 transition-all duration-200 pointer-events-none",
                isActive
                    ? "top-0 text-[12px] text-indigo-400"
                    : "top-5 text-[16px]"
                )}
            >
                {label}
            </label>
            {errors?.map((error) => (
                <p
                    key={error}
                    id={`${id}-error`}
                    className="mt-1.5 text-[13px] text-red-400"
                    role="alert"
                    >
                    {error}
                </p>
            ))}
        </CursorZone>
    )
}