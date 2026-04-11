import { defineConfig, defineCollection, s } from 'velite'
import rehypeSlug from 'rehype-slug'
import rehypePrettyCode from 'rehype-pretty-code'

const projects = defineCollection({
  name: 'Project',
  pattern: 'projects/**/*.mdx',
  schema: s.object({
    title: s.string(),
    slug: s.slug('projects'),
    description: s.string(),
    date: s.string(),
    role: s.string(),
    timeline: s.string(),
    stack: s.array(s.string()),
    featured: s.boolean().default(false),
    thumbnail: s.string(),
    heroImage: s.string(),
    metrics: s.array(
      s.object({
        value: s.string(),
        label: s.string(),
      })
    ).optional(),
    order: s.number().default(0),
    body: s.mdx(),
  }),
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