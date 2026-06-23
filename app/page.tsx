import type { Metadata } from "next"

import { createMetadata } from "@/lib/metadata"

export const metadata: Metadata = createMetadata({
  description:
    "Product engineer shipping across web and mobile — Focused on fast, accessible, high-quality UX.",
  title: "product engineer",
})

export default function Page() {
  return (
    <main className="flex-1 flex flex-col">
      <div className="w-full flex-1 font-mono flex px-6 md:px-12 py-6">
        <div className="flex flex-col gap-12 w-[24rem] text-left">
          neiforfaen
        </div>
      </div>
    </main>
  )
}
