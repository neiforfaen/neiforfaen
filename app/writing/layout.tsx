import type { ReactNode } from "react"

import { Header } from "@/components/header"

export default function WritingLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col">
        <div className="flex flex-col gap-8 max-w-[24rem] w-full text-left text-sm">
          {children}
        </div>
      </main>
    </>
  )
}
