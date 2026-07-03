import type { ReactNode } from "react"

export default function WritingLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return <main className="flex flex-col gap-8 text-sm">{children}</main>
}
