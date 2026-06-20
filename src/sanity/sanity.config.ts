import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { schemaTypes } from "./schema"
import { sanityConfig } from "./env"

export default defineConfig({
    name: "roshis-dev",
    title: "Roshis Dev",

    projectId: sanityConfig.projectId,
    dataset: sanityConfig.dataset,
    
    plugins: [structureTool()],
    schema: {
        types: schemaTypes
    }
})