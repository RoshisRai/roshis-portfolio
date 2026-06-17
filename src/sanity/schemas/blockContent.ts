import { defineType, defineField, defineArrayMember } from "sanity";

export const blockContent = defineType({
    name: "blockContent",
    title: "Block Content",
    type: "array",
    of: [
        defineArrayMember({
            type: "block",
            styles: [
                { title: "Normal", value: "normal" },
                { title: "H2", value: "h2" },
                { title: "H3", value: "h3" },
                { title: "H4", value: "h4" },
                { title: "Quote", value: "blockquote" },
            ],
            lists: [
                { title: "Bullet", value: "bullet" },
                { title: "Numbered", value: "number" },
            ],
            marks: {
                decorators: [
                    { title: "Bold", value: "strong" },
                    { title: "Italic", value: "em" },
                    { title: "Code", value: "code" },
                    { title: "Strikethrough", value: "strike-through" },
                ],
                annotations: [
                    {
                        name: "link",
                        title: "Link",
                        type: "object",
                        fields: [
                            defineField({
                                name: "href",
                                title: "URL",
                                type: "url",
                                validation: (Rule) => 
                                    Rule.uri({
                                        allowRelative: true,
                                        scheme: ["http", "https", "mailto", "tel"],
                                    }),
                            }),
                            defineField({
                                name: "openInNewTab",
                                title: "Open in new tab",
                                type: "boolean",
                                initialValue: true,
                            }),
                        ],
                    },
                ],
            },
        }),
        defineArrayMember({
            name: "codeBlock",
            title: "Code Block",
            type: "object",
            fields: [
                defineField({
                    name: "language",
                    type: "string",
                    title: "Language",
                    options: {
                        list: [
                        { title: "TypeScript", value: "typescript" },
                        { title: "JavaScript", value: "javascript" },
                        { title: "Python", value: "python" },
                        { title: "Bash", value: "bash" },
                        { title: "SQL", value: "sql" },
                        { title: "JSON", value: "json" },
                        { title: "YAML", value: "yaml" },
                        { title: "Go", value: "go" },
                        { title: "Rust", value: "rust" },
                        { title: "CSS", value: "css" },
                        { title: "HTML", value: "html" },
                        { title: "Diff", value: "diff" },
                        ],
                    },
                }),
                defineField({
                    name: "code",
                    type: "text",
                    title: "Code",
                    validation: (Rule) => Rule.required(),
                }),
                defineField({
                    name: "filename",
                    type: "string",
                    title: "Filename",
                }),
                defineField({
                    name: "highlightedLines",
                    type: "array",
                    title: "Highlighted Lines",
                    of: [{ type: "number" }],
                }),
            ],
            preview: {
                select: { language: "language", filename: "filename" },
                prepare({ language, filename }) {
                    return {
                        title: filename ?? "Code Block",
                        subtitle: language ?? "plain text",
                    };
                }
            },
        }),
        defineArrayMember({
            type: "image",
            options: { hotspot: true },
            fields: [
                defineField({
                    name: "alt",
                    type: "string",
                    title: "Alt Text",
                    validation: (Rule) => Rule.required(),
                }),
                defineField({
                    name: "caption",
                    type: "string",
                    title: "Caption",
                }),
            ],
        }),
        defineArrayMember({
            name: "callout",
            title: "Callout",
            type: "object",
            fields: [
                defineField({
                    name: "type",
                    type: "string",
                    title: "Type",
                    options: {
                        list: [
                            { title: "Info", value: "info" },
                            { title: "Warning", value: "warning" },
                            { title: "Tip", value: "tip" },
                            { title: "Note", value: "note" },
                        ],
                    },
                    initialValue: "info",
                    validation: (Rule) => Rule.required(),
                }),
                defineField({
                    name: "content",
                    type: "text",
                    title: "Content",
                    validation: (Rule) => Rule.required(),
                }),
            ],
            preview: {
                select: { type: "type", content: "content" },
                prepare({ type, content }) {
                    return {
                        title: `${type?.toUpperCase()}: ${content?.slice(0, 60) ?? ""}`,
                    }
                },
            },
        }),
    ],
})