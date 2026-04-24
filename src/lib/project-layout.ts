import type { ProjectCardSize } from "@/types/project";

export const cardSizeClasses: Record<ProjectCardSize, string> = {
    hero: 'md:col-span-2 xl:col-[1/8] xl:row-[1/3]',
    wide: 'md:col-span-2 xl:col-[8/13] xl:row-[1/3]',
    standard: 'md:col-span-1 xl:col-span-4',
    compact: 'md:col-span-1 xl:col-span-3',
}

export const projectsGridClass = 
    'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 xl:auto-rows-[minmax(16rem,auto)] gap-4'