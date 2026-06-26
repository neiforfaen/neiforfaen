import { Geist, JetBrains_Mono } from "next/font/google"
import type { ReactNode } from "react"

import "./globals.css"
import { CursorProvider } from "@/components/cursor"
import { Header } from "@/components/header"
import { ThemeProvider } from "@/components/theme-provider"
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
      <body className="w-full px-6 lg:px-12 py-6 lg:py-12">
        <ThemeProvider>
          <CursorProvider>
            <Header />
            {children}
          </CursorProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
