import type { ProjectCardSize } from "@/types/project";

export const cardSizeClasses: Record<ProjectCardSize, string> = {
  hero: 'col-span-1 md:col-span-2 xl:col-span-7 row-span-1',
  wide: 'col-span-1 md:col-span-1 xl:col-span-5 row-span-1',
  standard: 'col-span-1 md:col-span-1 xl:col-span-4',
  compact: 'col-span-1 md:col-span-1 xl:col-span-3',
}

export const projectsGridClass =
  'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 auto-rows-[minmax(8.75rem,auto)] md:auto-rows-[minmax(10rem,auto)] xl:auto-rows-[minmax(11.25rem,auto)] gap-4'