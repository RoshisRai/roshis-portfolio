import { createClient } from '@sanity/client'
import type { QueryParams } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const apiVersion = '2026-06-16'

export const sanityClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
    perspective: 'published',
})

export const sanityPreviewClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: process.env.SANITY_API_READ_TOKEN,
    perspective: 'previewDrafts',
})

type FetchOptions = {
    preview?: boolean
}

export async function sanityFetch<T>(
    query: string,
    params: QueryParams = {},
    options: FetchOptions = {},
): Promise<T> {
    const client = options.preview ? sanityPreviewClient : sanityClient

    return client.fetch<T>(query, params)
}
