import { createClient } from '@sanity/client'
import type { QueryParams } from '@sanity/client'
import { sanityConfig } from '@/sanity/env' // adjust path to wherever env.ts actually lives

export const sanityClient = createClient({
    projectId: sanityConfig.projectId,
    dataset: sanityConfig.dataset,
    apiVersion: sanityConfig.apiVersion,
    useCdn: true,
    perspective: 'published',
})

export const sanityPreviewClient = createClient({
    projectId: sanityConfig.projectId,
    dataset: sanityConfig.dataset,
    apiVersion: sanityConfig.apiVersion,
    useCdn: false,
    token: sanityConfig.token,
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