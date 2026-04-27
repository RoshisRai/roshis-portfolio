// Shared-element view transition names
export const projectMediaVTName  = (slug: string) => `project-media-${slug}`
export const projectTitleVTName  = (slug: string) => `project-title-${slug}`
export const projectAccentVTName = (slug: string) => `project-accent-${slug}`

// Navigation direction tags (Next.js Link transitionTypes).
export const navForward: string[] = ['nav-forward']
export const navBack: string[] = ['nav-back']

// Assign a stable VT name to the persistent header, footer and suppress the animation in CSS.
export const HEADER_VT_NAME = 'site-header'
export const FOOTER_VT_NAME = 'site-footer'

const DISABLE_PROJECT_VT_ATTR = 'data-disable-project-vt'

// Returns the right transitionTypes given the link semantic.
export function getNavTypes(direction: 'forward' | 'back') {
    return direction === 'forward' ? navForward : navBack
}

// Temporarily disable project shared-element morphs for one navigation lifecycle.
export function disableProjectSharedVTForNextNav(timeoutMs = 1400) {
    if (typeof document === 'undefined') return

    const root = document.documentElement
    root.setAttribute(DISABLE_PROJECT_VT_ATTR, 'true')

    const clear = () => root.removeAttribute(DISABLE_PROJECT_VT_ATTR)
    const clearOnce = () => {
        clear()
        document.removeEventListener('viewtransitionend', clearOnce)
        document.removeEventListener('viewtransitioncancel', clearOnce)
    }

    document.addEventListener('viewtransitionend', clearOnce, { once: true })
    document.addEventListener('viewtransitioncancel', clearOnce, { once: true })
    window.setTimeout(clear, timeoutMs)
}