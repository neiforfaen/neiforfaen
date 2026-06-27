import posthog from "posthog-js"

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN ?? "", {
  api_host: "/ingest",
  capture_exceptions: true,
  debug: process.env.NODE_ENV === "development",
  defaults: "2026-01-30",
  ui_host: "https://eu.posthog.com",
})
