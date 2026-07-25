import type { MetadataRoute } from "next"

const robots = (): MetadataRoute.Robots => ({
  rules: [
    {
      allow: ["/"],
      userAgent: "*",
    },
  ],
  sitemap: `${process.env.NODE_ENV === "development" ? "http" : "https"}://${process.env.NEXT_PUBLIC_PROJECT_PRODUCTION_URL}/sitemap.xml`,
})

export default robots
