interface CaseStudyMetaBarProps {
    role: string
    timeline: string
    stack: string[]
}

export const CaseStudyMetaBar = ({ role, timeline, stack }: CaseStudyMetaBarProps) => {
    const items = [
        { label: 'Role', value: role },
        { label: 'Timeline', value: timeline },
        { label: 'Stack', value: stack.slice(0, 4).join(', ') },
    ]

    return (
        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border bg-border">
            {items.map((item) => (
                <div key={item.label} className="bg-surface px-5 py-4">
                    <dt className="text-[12px] font-mono uppercase tracking-wider text-text-secondary">
                        {item.label}
                    </dt>
                    <dd className="mt-1 text-[15px] font-medium text-text-primary">
                        {item.value}
                    </dd>
                </div>
            ))}
        </dl>
    )
}