import { defineConfig, defineCollection, s } from 'velite'
import rehypeSlug from 'rehype-slug'
import rehypePrettyCode from 'rehype-pretty-code'

const projects = defineCollection({
  name: 'Project',
  pattern: 'projects/**/*.mdx',
  schema: s.object({
    slug: s.slug('projects'),
    title: s.string().max(80),
    summary: s.string().max(180),
    intro: s.string().max(400),
    featured: s.boolean().default(false),
    order: s.number().default(999),
    cardSize: s.enum(['hero', 'wide', 'standard', 'compact']).default('standard'),
    accent: s.string().regex(/^#([0-9a-fA-F]{6})$/),
    tags: s.array(s.string()).default([]),
    role: s.string(),
    timeline: s.string(),
    stack: s.array(s.string()).default([]),
    quote: s.string().optional(),
    problem: s.string().optional(),
    media: s.object({
      cover: s.string(),
      video: s.string().optional(),
      poster: s.string().optional(),
      alt: s.string(),
      aspect: s.enum([
        '16/10',
        '16/9',
        '4/3',
        '1/1'
      ]).default('16/10')
    }),
    metrics: s.array(
      s.object({
        value: s.string(),
        label: s.string(),
        countTo: s.number().optional(),
        prefix: s.string().optional(),
        suffix: s.string().optional()
      })
    ).optional(),
    architecture: s.object({
      description: s.string().optional(),
      diagram: s.string(),
      layers: s.array(s.string()),
    }).optional(),
    implementation: s.array(
      s.object({
        title: s.string(),
        body: s.string(),
        flip: s.boolean().optional(),
        media: s.union([
          s.object({
            kind: s.literal('code'),
            language: s.string(),
            filename: s.string().optional(),
            code: s.string()
          }),
          s.object({
            kind: s.literal('image'),
            src: s.string(),
            alt: s.string()
          })
        ])
      })
    ).optional(),
    reflection: s.string().optional(),
    nextSlug: s.string().optional().nullable(),
    links: s.array(
      s.object({
        label: s.string(),
        href: s.string().url()
      })
    ).optional(),
    body: s.mdx(),
  }).transform((data) => ({ ...data })),
})

export default defineConfig({
    root: 'content',
    output: {
        data: '.velite',
        assets: 'public/static',
        base: '/static/',
        name: '[name].[hash:6].[ext]',
        clean: true,
    },
    collections: { projects },
    mdx: {
        rehypePlugins: [
            rehypeSlug,
            [rehypePrettyCode, {
                theme: {
                    dark: 'one-dark-pro',
                    light: 'github-light',
                }
            }]
        ]
    }
})