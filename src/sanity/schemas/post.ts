import { defineType, defineField } from "sanity"

export const post = defineType({
    name: "post",
    title: "Post",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Title",
            type: "string",
            validation: (Rule) => Rule.required().min(10).max(120),
            description: "Post headline. Keep under 60 chars for SEO.",
        }),
        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            options: {
                source: "title",
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "excerpt",
            title: "Excerpt",
            type: "text",
            rows: 3,
            validation: (Rule) => Rule.required().min(40).max(200),
            description: "Used in cards, meta descriptions, and OG tags.",
        }),
        defineField({
            name: "body",
            title: "Body",
            type: "blockContent",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "publishedAt",
            title: "Published At",
            type: "datetime",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "updatedAt",
            title: "Updated At",
            type: "datetime",
        }),
        defineField({
            name: "readingTime",
            title: "Reading Time (minutes)",
            type: "number",
            validation: (Rule) => Rule.required().integer().min(1).max(60),
        }),
        defineField({
            name: "category",
            title: "Category",
            type: "reference",
            to: [{ type: "category" }],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "tags",
            title: "Tags",
            type: "array",
            of: [{ type: "reference", to: [{ type: "tag" }] }],
            validation: (Rule) => Rule.required().min(1).max(5),
        }),
        defineField({
            name: "coverImage",
            title: "Cover Image",
            type: "image",
            options: { hotspot: true },
            fields: [
                defineField({
                    name: "alt",
                    title: "Alt Text",
                    type: "string",
                    validation: (Rule) => Rule.required(),
                }),
            ],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "author",
            title: "Author",
            type: "reference",
            to: [{ type: "author" }],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "seo",
            title: "SEO",
            type: "object",
            fields: [
                defineField({
                    name: "metaTitle",
                    title: "Meta Title",
                    type: "string",
                }),
                defineField({
                    name: "metaDescription",
                    title: "Meta Description",
                    type: "text",
                }),
                defineField({
                    name: "ogImage",
                    title: "Open Graph Image",
                    type: "image",
                }),
            ],
        }),
        defineField({
            name: "ragEnabled",
            title: "Include in AI Knowledge Base",
            type: "boolean",
            initialValue: true,
        }),
        defineField({
            name: "featured",
            title: "Featured Post",
            type: "boolean",
            initialValue: false,
        }),
    ],
    orderings: [
        {
            name: "publishedAtDesc",
            title: "Published Date (newest first)",
            by: [{ field: "publishedAt", direction: "desc" }],
        },
    ],
    preview: {
        select: {
            title: "title",
            subtitle: "category.title",
            media: "coverImage",
            date: "publishedAt",
        },
        prepare({ title, subtitle, media, date }) {
            return {
                title,
                subtitle: subtitle
                    ? `${subtitle} - ${date ? new Date(date).toLocaleDateString() : "Draft"}`
                    : undefined,
                media,
            }
        },
    },
})