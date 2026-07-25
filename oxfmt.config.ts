import { defineConfig } from "oxfmt"

export default defineConfig({
  arrowParens: "always",
  bracketSameLine: false,
  bracketSpacing: true,
  endOfLine: "lf",
  ignorePatterns: [
    "**/node_modules",
    "**/.git",
    "**/dist",
    "**/.cache",
    "**/.vite",
    "**/bun.lock",
    "**/bun.lockb",
    "**/apps/web/components/ui",
    "**/worker-configuration.d.ts",
  ],
  jsxSingleQuote: false,
  printWidth: 80,
  proseWrap: "never",
  quoteProps: "as-needed",
  semi: false,
  singleQuote: false,
  sortImports: {
    ignoreCase: true,
    newlinesBetween: true,
    order: "asc",
  },
  sortPackageJson: true,
  tabWidth: 2,
  trailingComma: "es5",
  useTabs: false,
})
