"use client"

import posthog from "posthog-js"
import { useRef } from "react"
import type { ReactNode } from "react"

import { useCursor } from "@/components/cursor"

export const ProjectList = ({ children }: { children: ReactNode }) => {
  const { onExitZone } = useCursor()

  return (
    <section className="flex flex-col gap-12" onPointerLeave={onExitZone}>
      {children}
    </section>
  )
}

interface ProjectProps {
  title: string
  description: string
  url: string
}

export const Project = ({ title, description, url }: ProjectProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const { onEnter, onLeave } = useCursor()

  return (
    <div
      ref={ref}
      onPointerEnter={(e) => {
        if (e.pointerType === "touch") {
          return
        }
        if (ref.current) {
          onEnter(ref.current)
        }
      }}
      onPointerLeave={onLeave}
      className="flex flex-col gap-2"
    >
      <h2 className="text-lg font-medium">{title}</h2>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={url}
        className="text-sm underline underline-offset-4"
        onClick={() =>
          posthog.capture("project_link_clicked", {
            project_title: title,
            project_url: url,
          })
        }
      >
        {description}
      </a>
    </div>
  )
}
