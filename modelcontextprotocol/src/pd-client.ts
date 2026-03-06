import { createBackendClient } from "@pipedream/sdk"
import { z } from "zod"

const envSchema = z.object({
  PIPEDREAM_CLIENT_ID: z.string({
    required_error: "PIPEDREAM_CLIENT_ID is required",
  }),
  PIPEDREAM_CLIENT_SECRET: z.string({
    required_error: "PIPEDREAM_CLIENT_SECRET is required",
  }),
  PIPEDREAM_PROJECT_ID: z.string({
    required_error: "PIPEDREAM_PROJECT_ID is required",
  }),
  PIPEDREAM_PROJECT_ENVIRONMENT: z.enum(["development", "production"], {
    required_error: "PIPEDREAM_PROJECT_ENVIRONMENT is required",
  }),
})

const envResult = envSchema.safeParse(process.env)

if (!envResult.success) {
  console.error("❌ Invalid environment variables:")
  envResult.error.issues.forEach((issue) => {
    console.error(`  - ${issue.message}`)
  })
  process.exit(1)
}

const env = envResult.data

export const pd = createBackendClient({
  credentials: {
    clientId: env.PIPEDREAM_CLIENT_ID,
    clientSecret: env.PIPEDREAM_CLIENT_SECRET,
  },
  projectId: env.PIPEDREAM_PROJECT_ID,
  environment: env.PIPEDREAM_PROJECT_ENVIRONMENT,
})

export const slackComponents = async () => {
  return await pd.getComponents({
    app: "slack",
    componentType: "action",
  })
}
