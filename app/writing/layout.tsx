import type { ReactNode } from "react"

export default function WritingLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return <div className="flex flex-col gap-8 text-sm">{children}</div>
}
