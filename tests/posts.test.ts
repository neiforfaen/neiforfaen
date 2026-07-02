import { existsSync } from "node:fs"

import { describe, expect, it } from "vitest"

import { posts } from "@/app/writing/posts"

describe("posts index", () => {
  it("every slug has a matching page.mdx", () => {
    for (const { slug } of posts) {
      expect(existsSync(`app/writing/${slug}/page.mdx`), slug).toBe(true)
    }
  })
})
