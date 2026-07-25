import type { Metadata } from "next"

import { About } from "@/components/about"
import { ProjectList } from "@/components/project"
import { Work } from "@/components/work"
import { Writing } from "@/components/writing"
import { createMetadata } from "@/lib/metadata"

export const metadata: Metadata = createMetadata({
  description:
    "Product engineer shipping fast, accessible software for web and mobile.",
  title: "product engineer",
})

export default function Page() {
  return (
    <div className="flex flex-col gap-12">
      <About />

      <div className="flex flex-col gap-8 lg:flex-row">
        <ProjectList />

        <Work />
      </div>

      <Writing />
    </div>
  )
}
