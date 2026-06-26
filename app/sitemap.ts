import type { MetadataRoute } from "next"

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
]

export default sitemap
