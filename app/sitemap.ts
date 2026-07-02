import type { MetadataRoute } from "next"

import { posts } from "./writing/posts"

const protocol = process.env.NODE_ENV === "production" ? "https" : "http"
const productionUrl = process.env.NEXT_PUBLIC_PROJECT_PRODUCTION_URL ?? ""
const baseUrl = productionUrl ? `${protocol}://${productionUrl}` : ""

const sitemap = (): MetadataRoute.Sitemap => [
  {
    changeFrequency: "monthly",
    lastModified: new Date(),
    priority: 1,
    url: `${baseUrl}/`,
  },
  {
    changeFrequency: "weekly",
    lastModified: new Date(),
    priority: 0.8,
    url: `${baseUrl}/writing`,
  },
  ...posts.map((post) => ({
    changeFrequency: "monthly" as const,
    lastModified: new Date(),
    priority: 0.6,
    url: `${baseUrl}/writing/${post.slug}`,
  })),
]

export default sitemap
