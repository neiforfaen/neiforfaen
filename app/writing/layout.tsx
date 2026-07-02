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
      <main className="flex flex-col gap-8 text-sm">{children}</main>
    </>
  )
}
