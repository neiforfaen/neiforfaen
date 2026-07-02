"use client"

import Link from "next/link"
import posthog from "posthog-js"
import { useEffect, useRef, useState } from "react"

import { useCursor } from "@/components/providers/cursor"
import { loadProjects } from "@/lib/projects"
import type { Project } from "@/lib/projects"

const ProjectCard = ({ project }: { project: Project }) => {
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
      <h2 className="text-lg font-medium">{project.title}</h2>
      <Link
        href={`/project/${project.slug}`}
        className="text-sm underline underline-offset-4"
        onClick={() =>
          posthog.capture("project_link_clicked", {
            project_slug: project.slug,
            project_title: project.title,
          })
        }
      >
        {project.shortDescription}
      </Link>
    </div>
  )
}

export const ProjectList = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const { onExitZone } = useCursor()

  useEffect(() => {
    ;(async () => {
      const data = await loadProjects()
      setProjects(data)
      setLoading(false)
    })()
  }, [])

  if (loading) {
    return <section className="flex flex-col gap-8 lg:max-w-sm" />
  }

  return (
    <section
      className="flex flex-col gap-8 lg:max-w-sm"
      onPointerLeave={onExitZone}
    >
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </section>
  )
}
