import { cn } from "@/lib/utils";
import { SectionHeading } from "../ui/section-heading";

interface SectionWrapperProps extends React.HTMLAttributes<HTMLElement> {
    id: string
    //SectionHeading Props (Optional since some sections might not have a heading)
    title?: string
    subtitle?: string
    headingAlign?: 'left' | 'center' | 'right'
    headingAs?: 'h1' | 'h2' | 'h3'
    //Layout
    as?: 'section' | 'div' | 'article'
    contained?: boolean // Whether to wrap children in a max-width container
    className?: string
    innerClassName?: string // Class for the inner container (max-width, padding)
    children: React.ReactNode
}

const SectionWrapper = ({
    id,
    title,
    subtitle,
    headingAlign = 'left',
    headingAs = 'h2',
    as: Tag = 'section',
    contained = true,
    className,
    innerClassName,
    children,
    ...props
}: SectionWrapperProps) => {
    return (
        <Tag
            id={id}
            className={cn(
                // Vertical rhythm — uses CSS custom spacing vars
                'py-(--spacing-section-mobile) md:py-(--spacing-section)',
                className,
            )}
            {...props}
        >
            {contained ? (
                //Contained Layout with max-width and horizontal padding
                <div
                    className={cn(
                        'mx-auto w-full',
                        'max-w-(--max-width-content)',
                        innerClassName,
                    )}
                >
                    {/* Optional Section Heading */}
                    {title && (
                        <SectionHeading
                            title={title}
                            subtitle={subtitle}
                            align={headingAlign}
                            as={headingAs}
                        />
                    )}
                    {children}
                </div>
            ) : (
                //Full-width Layout without max-width or horizontal padding
                <>
                    {title && (
                        <div
                            className={cn(
                                'mx-auto w-full',
                                'max-w-(--max-width-content)',
                                'px-6 md:px-12',
                            )}
                        >
                            <SectionHeading
                                title={title}
                                subtitle={subtitle}
                                align={headingAlign}
                                as={headingAs}
                            />
                        </div>
                    )}
                    <div className={cn('w-full', innerClassName)}>
                        {children}
                    </div>
                </>
            )}
        </Tag>
    )
}

SectionWrapper.displayName = 'SectionWrapper'

export { SectionWrapper, type SectionWrapperProps }