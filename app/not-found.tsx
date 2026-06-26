import type { Metadata } from "next"
import Link from "next/link"

import { createMetadata } from "@/lib/metadata"

export const metadata: Metadata = createMetadata({
  description: "this page could not be found.",
  title: "not found",
})

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100dvh-3rem)] w-full flex-col items-center justify-center lg:min-h-[calc(100dvh-6rem)]">
      <div className="flex flex-col items-center gap-8 text-center duration-700 fade-in-0">
        <h1 className="flex items-center text-6xl font-medium tracking-tight tabular-nums sm:text-7xl">
          4O4
          <span
            aria-hidden
            className="ml-1 inline-block h-[0.75em] w-[0.5ch] animate-caret-blink bg-foreground motion-reduce:animate-none"
          />
        </h1>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-foreground/75">
            page not found
          </p>
          <p className="max-w-xs text-balance text-sm leading-relaxed text-muted-foreground">
            the page you're looking for doesn't exist or has moved.
          </p>
        </div>

        <Link
          className="flex items-center gap-2 text-sm underline underline-offset-4"
          href="/"
        >
          back home
        </Link>
      </div>
    </main>
  )
}
