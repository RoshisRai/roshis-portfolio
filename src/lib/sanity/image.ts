import {
    createImageUrlBuilder,
    type SanityImageSource,
} from "@sanity/image-url"
import { sanityClient } from "./client"

const imageBuilder = createImageUrlBuilder(sanityClient)

const OPEN_GRAPH_IMAGE = {
    width: 1200,
    height: 630,
} as const

function urlFor(source: SanityImageSource) {
    return imageBuilder.image(source).auto("format").fit("max")
}

export function getCoverImageUrl(
    source: SanityImageSource | null | undefined,
    width = 800,
): string {
    if (!source) return ""
    return urlFor(source).width(width).quality(85).url()
}

export function getOgImageUrl(
    source: SanityImageSource | null | undefined,
): string {
    if (!source) return "";
    return urlFor(source)
        .width(OPEN_GRAPH_IMAGE.width)
        .height(OPEN_GRAPH_IMAGE.height)
        .fit("crop")
        .quality(80)
        .url()
}

export function getBlurDataUrl(
    source: SanityImageSource | null | undefined,
): string {
    if (!source) return ""
    return urlFor(source)
        .width(24)
        .height(24)
        .blur(10)
        .quality(30)
        .url()
}
