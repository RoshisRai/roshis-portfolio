import type { Skill } from "@/types/skill"

interface SkillCardProps {
    skill: Skill
}

export const SkillCard = ({ skill }: SkillCardProps) => {
    return (
        <>
            <span>{skill.name}</span>
        </>
    )
}