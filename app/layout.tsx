import { Geist, JetBrains_Mono } from "next/font/google"
import type { ReactNode } from "react"

import "./globals.css"
import { Cursor } from "@/components/cursor"
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
        <Cursor
          cursorColor="var(--foreground)"
          hideDefaultCursor={true}
          parallaxOn
          hoverDuration={0.2}
        />
        <RootProviders>
          <div className="p-6 lg:p-12">
            <div className="flex flex-col gap-12 mx-auto w-full max-w-xl lg:max-w-3xl">
              {children}
            </div>
          </div>
        </RootProviders>
      </body>
    </html>
  )
}
