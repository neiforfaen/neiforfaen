import type { MetadataRoute } from "next"

const robots = (): MetadataRoute.Robots => ({
  rules: [
    {
      allow: ["/"],
      userAgent: "*",
    },
  ],
  sitemap: `${process.env.NEXT_PUBLIC_PROJECT_PRODUCTION_URL}/sitemap.xml`,
})

export default robots
