export const sanityConfig = {
    projectId:
        process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
        process.env.SANITY_STUDIO_PROJECT_ID!,
    dataset:
        process.env.NEXT_PUBLIC_SANITY_DATASET ||
        process.env.SANITY_STUDIO_DATASET ||
        "production",
    apiVersion: "2026-06-16",
    useCdn: process.env.NODE_ENV === "production",
    token: process.env.SANITY_API_READ_TOKEN,
} as const

if (!sanityConfig.projectId) {
    throw new Error(
        "Missing Sanity project ID. Set NEXT_PUBLIC_SANITY_PROJECT_ID (Next.js) or SANITY_STUDIO_PROJECT_ID (Sanity Studio)."
    )
}