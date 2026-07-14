import { defineCloudflareConfig } from "@opennextjs/cloudflare"

// ponytail: default config, add r2IncrementalCache if ISR/revalidation is needed
export default defineCloudflareConfig()
