import type { Metadata } from "next"

import { About } from "@/components/about"
import { Header } from "@/components/header"
import { Project, ProjectList } from "@/components/project"
import { Work } from "@/components/work"
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
        <div className="flex flex-col gap-12 w-[24rem] text-left">
          <About />

          <ProjectList>
            <Project
              title="neiforfaen/braglist-llm"
              description="Knowledge base of my achievements, following Andrej Karpathy's LLM Wiki pattern."
              url="https://github.com/neiforfaen/braglist-llm"
            />

            <Project
              title="neiforfaen/kosei"
              description="Extensible local environment switcher for javascript/typescript projects."
              url="https://github.com/neiforfaen/kosei-cli"
            />

            <Project
              title="neiforfaen/raiu"
              description="Valorant rank lookup API for stream chatbots, fetch and format in a single request."
              url="https://github.com/neiforfaen/raiu"
            />
          </ProjectList>

          <Work />
        </div>
      </main>
    </>
  )
}
