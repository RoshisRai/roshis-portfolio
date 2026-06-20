import type { SchemaTypeDefinition } from "sanity";
import { author } from "./schemas/author";
import { blockContent } from "./schemas/blockContent";
import { category } from "./schemas/category";
import { post } from "./schemas/post";
import { tag } from "./schemas/tag";

export const schemaTypes: SchemaTypeDefinition[] = [
    author,
    blockContent,
    category,
    post,
    tag,
];