export function TypingIndicator() {
    return (
        <div className="flex items-center gap-1 px-4 py-3">
            <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                    <span
                        key={i}
                        className="w-2 h-2 rounded-full bg-text-primary/30 animate-pulse"
                        style={{ animationDelay: `${i * 150}ms` }}
                    />
                ))}
            </div>
        </div>
    )
}