export const GlobePlaceholder = () => {
  return (
    <div className="relative flex h-48 w-48 items-center justify-center rounded-full border border-border p-8 bg-surface/95 shadow-2xl shadow-indigo-500/10">
        
        <span className="absolute top-6 right-6 flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-hover opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent"></span>
        </span>

        <div className="absolute h-[90%] w-[90%] animate-[spin_40s_linear_infinite] rounded-full border border-dashed border-text-secondary opacity-30" />

        <div className="absolute h-[65%] w-[65%] animate-[spin_15s_linear_infinite_reverse] rounded-full border border-border border-t-accent opacity-80" />

        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-surface-alt shadow-sm">
            <div className="absolute inset-0 animate-pulse rounded-full bg-accent-glow blur-sm" />
            
            <div className="relative h-6 w-6 rounded-full border-2 border-text-secondary opacity-60">
                <div className="absolute inset-0 mx-auto w-0.5 bg-text-secondary" />
                <div className="absolute inset-0 my-auto h-0.5 bg-text-secondary" />
            </div>
        </div>
        
    </div>
  );
};
