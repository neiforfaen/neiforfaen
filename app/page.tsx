import type { Metadata } from "next"

import { About } from "@/components/about"
import { Header } from "@/components/header"
import { ProjectList } from "@/components/project"
import { Work } from "@/components/work"
import { Writing } from "@/components/writing"
import { createMetadata } from "@/lib/metadata"

export const metadata: Metadata = createMetadata({
  description:
    "Product engineer shipping across web and mobile — Focused on fast, accessible, high-quality UX.",
  title: "product engineer",
})

export default function Page() {
  return (
    <div className="p-6 lg:p-12">
      <div className="flex flex-col gap-12 mx-auto w-full max-w-xl lg:max-w-3xl">
        <Header />

        <main className="flex flex-col gap-8">
          <About />

          <div className="flex flex-col gap-8 lg:flex-row">
            <ProjectList />

            <Work />
          </div>

          <Writing />
        </main>
      </div>
    </div>
  )
}
