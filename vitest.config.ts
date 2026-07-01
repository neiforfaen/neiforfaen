import react from "@vitejs/plugin-react"
import { playwright } from "@vitest/browser-playwright"
import { defineConfig } from "vitest/config"

const alias = { "@": import.meta.dirname }

export default defineConfig({
  test: {
    projects: [
      {
        resolve: { alias },
        test: {
          environment: "node",
          include: [
            "tests/**/*.test.{ts,tsx}",
            "!tests/**/*.browser.test.{ts,tsx}",
          ],
          name: "unit",
        },
      },
      {
        define: {
          "process.env": {},
        },
        optimizeDeps: {
          exclude: ["next/image"],
        },
        plugins: [react()],
        resolve: { alias },
        test: {
          browser: {
            enabled: true,
            instances: [{ browser: "chromium" }],
            provider: playwright(),
          },
          include: ["tests/**/*.browser.test.{ts,tsx}"],
          name: "browser",
          setupFiles: ["./tests/setup/browser.ts"],
        },
      },
    ],
  },
})
