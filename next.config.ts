import createMDX from "@next/mdx"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    qualities: [100, 75],
  },
  pageExtensions: ["ts", "tsx", "mdx"],
  rewrites() {
    return [
      {
        destination: "https://eu-assets.i.posthog.com/static/:path*",
        source: "/ingest/static/:path*",
      },
      {
        destination: "https://eu-assets.i.posthog.com/array/:path*",
        source: "/ingest/array/:path*",
      },
      {
        destination: "https://eu.i.posthog.com/:path*",
        source: "/ingest/:path*",
      },
    ]
  },
  skipTrailingSlashRedirect: true,
}

export default createMDX()(nextConfig)
