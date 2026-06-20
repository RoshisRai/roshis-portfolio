import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schema"
import { sanityConfig } from "./env"

export default defineConfig({
    name: "roshis-dev",
    title: "Roshis Dev",

    projectId: sanityConfig.projectId,
    dataset: sanityConfig.dataset,

    plugins: [
        structureTool(),
        visionTool(),
    ],
    schema: {
        types: schemaTypes
    }
})