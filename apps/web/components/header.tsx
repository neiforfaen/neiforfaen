"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { ThemeToggle } from "@/components/theme-toggle"

export const Header = () => {
  const path = usePathname()
  const isWritingRoute = (path ?? "").includes("writing")
  const isProjectsRoute = (path ?? "").includes("projects")

  return (
    <header className="flex flex-col gap-2 items-start sm:flex-row sm:justify-between sm:gap-0 sm:items-center">
      <div className="flex gap-2 text-sm">
        <h1 className="font-medium text-foreground/75">kaiden</h1>
        <span>/</span>
        <Link
          className="font-medium text-foreground/75 underline underline-offset-4"
          href="/"
        >
          0x424
        </Link>
        {isWritingRoute && (
          <>
            <span>/</span>
            <Link
              className="font-medium text-foreground/75 underline underline-offset-4"
              href="/writing"
            >
              writing
            </Link>
          </>
        )}
        {isProjectsRoute && (
          <>
            <span>/</span>
            <Link
              className="font-medium text-foreground/75 underline underline-offset-4"
              href="/projects"
            >
              projects
            </Link>
          </>
        )}
      </div>
      <div className="flex flex-row gap-2 items-center justify-between ml-auto">
        <span className="text-xs flex items-center gap-2">
          looking for work
          <span className="inline-flex h-3 w-3 relative bg-emerald-400/75">
            <span className="inline-flex h-3 w-3 animate-ping opacity-75 bg-emerald-400" />
          </span>
        </span>
        <div className="h-4 w-0.25 bg-muted-foreground" />
        <ThemeToggle />
      </div>
    </header>
  )
}
