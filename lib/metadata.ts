import type { Metadata } from "next"

const applicationName = "neiforfaen"
const author: Metadata["authors"] = {
  name: "Kaiden Riley",
  url: "https://0x424.kr",
}
const publisher = "neiforfaen"
const protocol = process.env.NODE_ENV === "production" ? "https" : "http"
const productionUrl = process.env.NEXT_PUBLIC_PROJECT_PRODUCTION_URL ?? ""

type MetadataGenerator = Omit<Metadata, "description" | "title"> & {
  title: string
  description: string
}

export const createMetadata = ({
  title,
  description,
  ...properties
}: MetadataGenerator): Metadata => {
  const parsedTitle = `${title ? `${title} | ` : ""}kaiden`

  const defaultMetadata: Metadata = {
    alternates: {
      types: {
        "application/rss+xml": "https://0x424.kr/rss.xml",
      },
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: parsedTitle,
    },
    applicationName,
    authors: [author],
    creator: author.name,
    description,
    formatDetection: {
      telephone: false,
    },
    metadataBase: productionUrl
      ? new URL(`${protocol}://${productionUrl}`)
      : undefined,
    openGraph: {
      description,
      locale: "en_US",
      siteName: applicationName,
      title: parsedTitle,
      type: "website",
    },
    publisher,
    title: parsedTitle,
  }

  return { ...defaultMetadata, ...properties } satisfies Metadata
}
