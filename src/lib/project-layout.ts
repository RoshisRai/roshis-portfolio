import type { ProjectCardSize } from "@/types/project";

export const cardSizeClasses: Record<ProjectCardSize, string> = {
    hero: 'md:col-span-2 xl:col-span-7 xl:row-span-2',
    wide: 'md:col-span-2 xl:col-span-5 xl:row-span-2',
    standard: 'md:col-span-1 xl:col-span-5',
    compact: 'md:col-span-1 xl:col-span-2',
}

export const projectGridClass = 
    'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 auto-rows-fr gap-4'