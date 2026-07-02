import { Geist, JetBrains_Mono } from "next/font/google"
import type { ReactNode } from "react"

import "./globals.css"
import { RootProviders } from "@/components/providers"
import { cn } from "@/lib/utils"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        "scroll-smooth",
        fontSans.variable,
        jetbrainsMono.variable,
        "font-mono"
      )}
    >
      <body>
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  )
}
