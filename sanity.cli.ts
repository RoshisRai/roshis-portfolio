import { loadEnvConfig } from "@next/env"
import { defineCliConfig } from "sanity/cli"

loadEnvConfig(process.cwd())

export default defineCliConfig({
    api: {
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
    },
})