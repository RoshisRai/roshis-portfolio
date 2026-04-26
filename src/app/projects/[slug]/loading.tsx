export default function Loading() {
    return (
        <div className="pt-24 pb-20">
            <div className="mx-auto max-w-(--max-width-content) px-6">
                <div className="h-4 w-40 bg-surface rounded mb-6 animate-pulse" />
                <div className="w-full aspect-video rounded-3xl bg-surface animate-pulse" />
                <div className="mt-10 h-14 w-3/4 bg-surface rounded animate-pulse" />
                <div className="mt-5 h-4 w-2/3 bg-surface rounded animate-pulse" />
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border bg-border">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-surface px-5 py-4 h-20 animate-pulse" />
                    ))}
                </div>
            </div>
        </div>
    )
}