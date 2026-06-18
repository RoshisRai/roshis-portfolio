import { defineType, defineField } from "sanity"

export const tag = defineType({
    name: "tag",
    title: "Tag",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Title",
            type: "string",
            validation: (Rule) => Rule.required().min(2).max(50),
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
    ],
    preview: {
        select: { title: "title" },
    },
})