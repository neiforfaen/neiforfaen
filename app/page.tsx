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
    <>
      <Header />
      <main className="flex-1 flex flex-col">
        <div className="flex flex-col gap-12 max-w-[24rem] w-full text-left">
          <About />

          <ProjectList />

          <Work />

          <Writing />
        </div>
      </main>
    </>
  )
}
