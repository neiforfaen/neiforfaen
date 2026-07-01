import { beforeEach, describe, expect, it, vi } from "vitest"

import { createMetadata } from "@/lib/metadata"

describe("createMetadata", () => {
  it("appends the site name to the title", () => {
    const metadata = createMetadata({
      description: "A description",
      title: "Home",
    })

    expect(metadata.title).toBe("Home | kaiden")
  })

  it("falls back to the bare site name when title is empty", () => {
    const metadata = createMetadata({ description: "A description", title: "" })

    expect(metadata.title).toBe("kaiden")
  })

  it("passes the description through to top-level metadata", () => {
    const metadata = createMetadata({
      description: "A description",
      title: "Home",
    })

    expect(metadata.description).toBe("A description")
  })

  it("sets the expected defaults", () => {
    const metadata = createMetadata({
      description: "A description",
      title: "Home",
    })

    expect(metadata.applicationName).toBe("neiforfaen")
    expect(metadata.publisher).toBe("neiforfaen")
    expect(metadata.creator).toBe("Kaiden Riley")
    expect(metadata.authors).toEqual([
      { name: "Kaiden Riley", url: "https://0x424.kr" },
    ])
    expect(metadata.formatDetection).toEqual({ telephone: false })
    expect(metadata.appleWebApp).toEqual({
      capable: true,
      statusBarStyle: "default",
      title: "Home | kaiden",
    })
  })

  it("builds openGraph metadata from the title and description", () => {
    const metadata = createMetadata({
      description: "A description",
      title: "Home",
    })

    expect(metadata.openGraph).toEqual({
      description: "A description",
      locale: "en_US",
      siteName: "neiforfaen",
      title: "Home | kaiden",
      type: "website",
    })
  })

  it("overrides defaults with additional properties", () => {
    const metadata = createMetadata({
      description: "A description",
      openGraph: { type: "article" },
      title: "Home",
    })

    expect(metadata.openGraph).toEqual({ type: "article" })
  })

  it("includes arbitrary Metadata properties passed through", () => {
    const metadata = createMetadata({
      description: "A description",
      robots: "noindex",
      title: "Home",
    })

    expect(metadata.robots).toBe("noindex")
  })

  describe("metadataBase", () => {
    beforeEach(() => {
      vi.unstubAllEnvs()
      vi.resetModules()
    })

    it("is undefined when no production URL is configured", async () => {
      vi.stubEnv("NEXT_PUBLIC_PROJECT_PRODUCTION_URL", "")
      const { createMetadata: createMetadataFresh } =
        await import("@/lib/metadata")

      const metadata = createMetadataFresh({
        description: "A description",
        title: "Home",
      })

      expect(metadata.metadataBase).toBeUndefined()
    })

    it("uses https when NODE_ENV is production", async () => {
      vi.stubEnv("NODE_ENV", "production")
      vi.stubEnv("NEXT_PUBLIC_PROJECT_PRODUCTION_URL", "example.com")
      const { createMetadata: createMetadataFresh } =
        await import("@/lib/metadata")

      const metadata = createMetadataFresh({
        description: "A description",
        title: "Home",
      })

      expect(metadata.metadataBase).toEqual(new URL("https://example.com"))
    })

    it("uses http when NODE_ENV is not production", async () => {
      vi.stubEnv("NODE_ENV", "test")
      vi.stubEnv("NEXT_PUBLIC_PROJECT_PRODUCTION_URL", "example.com")
      const { createMetadata: createMetadataFresh } =
        await import("@/lib/metadata")

      const metadata = createMetadataFresh({
        description: "A description",
        title: "Home",
      })

      expect(metadata.metadataBase).toEqual(new URL("http://example.com"))
    })
  })
})
