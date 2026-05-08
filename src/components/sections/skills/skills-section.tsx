import { SectionWrapper } from "@/components/layout/section-wrapper"
import { skills } from "@/lib/constants"
import type { SkillCategory as SkillCategoryType} from "@/types/skill"
import { SkillCategory } from "./skills-category"

const categoryOrder: SkillCategoryType[] = [
    'Frontend',
    'Backend',
    'DevOps & Infrastructure',
    'AI & Automation',
    'Tools & Workflow'
]

export const SkillsSection = () => {

    const groupedSkills = categoryOrder.map(category => ({
        category,
        skills: skills.filter(skill => skill.category === category),
    }))

    return (
        <SectionWrapper
            id="skills"
            title="Skills &amp; Technologies"
            subtitle="The tools I use to build, deploy, and scale. Hover any skill to see
            where I&apos;ve used it."
            headingAlign="center"
        >
            {/* Category Rows */}
            <div>
                {groupedSkills.map(({ category, skills}, index)=>(
                    <SkillCategory
                        key={category}                        
                        category={category}
                        skills={skills}
                        index={index}
                    />
                ))}
            </div>
        </SectionWrapper>
    )
}