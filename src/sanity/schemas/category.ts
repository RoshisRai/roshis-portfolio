import { defineType, defineField } from "sanity"

export const category = defineType({
    name: "category",
    title: "Category",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Title",
            type: "string",
            validation: (Rule) => Rule.required().min(2).max(40),
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
            name: "description",
            title: "Description",
            type: "text",
            rows: 2,
        }),
        defineField({
            name: "color",
            title: "Accent Color",
            type: "string",
            options: {
                list: [
                    { title: "Blue", value: "blue" },
                    { title: "Purple", value: "purple" },
                    { title: "Emerald", value: "emerald" },
                    { title: "Amber", value: "amber" },
                    { title: "Rose", value: "rose" },
                    { title: "Cyan", value: "cyan" },
                ],
            },
        }),
        defineField({
            name: "order",
            title: "Display Order",
            type: "number",
            initialValue: 0,
        }),
    ],
    orderings: [
        {
            title: "Display Order",
            name: "orderAsc",
            by: [{ field: "order", direction: "asc" }],
        },
    ],
    preview: {
        select: { title: "title", subtitle: "description" },
    }
})