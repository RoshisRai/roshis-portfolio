// Parse a hex color into an "r, g, b" string for rgba() use in CSS vars.
function hexToRgbChannel(hex: string) {
    const clean = hex.replace('#', '')
    const r = parseInt(clean.slice(0, 2), 16)
    const g = parseInt(clean.slice(2, 4), 16)
    const b = parseInt(clean.slice(4, 6), 16)
    return `${r}, ${g}, ${b}`
}

export function projectAccentStyle(accent: string): React.CSSProperties {
    const rgb = hexToRgbChannel(accent)
    return {
        ['--project-accent' as string]: accent,
        ['--project-accent-rgb' as string]: rgb,
        ['--project-accent-soft' as string]: `rgba(${rgb}, 0.12)`,
        ['--project-accent-glow' as string]: `rgba(${rgb}, 0.35)`,
    }
}