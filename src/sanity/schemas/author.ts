import { defineType, defineField } from "sanity"

export const author = defineType({
    name: "author",
    title: "Author",
    type: "document",
    fields: [
        defineField({
            name: "name",
            title: "Name",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            options: {
                source: "name",
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "image",
            title: "Avatar",
            type: "image",
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: "bio",
            title: "Bio",
            type: "text",
            rows: 3,
        }),
        defineField({
            name: "social",
            title: "Social Links",
            type: "object",
            fields: [
                defineField({
                    name: "twitter",
                    title: "X / Twitter",
                    type: "url",
                }),
                defineField({
                    name: "linkedin",
                    title: "LinkedIn",
                    type: "url",
                }),
                defineField({
                    name: "github",
                    title: "GitHub",
                    type: "url",
                }),
            ],
        }),
    ],
    preview: {
        select: { title: "name", media: "image" },
    },
})