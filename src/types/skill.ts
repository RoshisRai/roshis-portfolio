export type SkillCategory = 
    | "Frontend"
    | "Backend"
    | "DevOps & Infrastructure"
    | "AI & Automation"
    | "Tools & Workflow"

export interface Skill {
    name: string
    icon: string
    category: SkillCategory
    usedIn: {
        projectName: string
        slug: string
        context: string
    }[]
}