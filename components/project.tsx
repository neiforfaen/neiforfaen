"use client"

import posthog from "posthog-js"
import { useRef } from "react"

import { useCursor } from "@/components/cursor"

const projects: ProjectProps[] = [
  {
    description:
      "Personal site and portfolio, doubling as a working sample of my frontend craft.",
    title: "neiforfaen/neiforfaen",
    url: "https://github.com/neiforfaen/neiforfaen",
  },
  {
    description:
      "Knowledge base of my achievements, following Andrej Karpathy's LLM Wiki pattern.",
    title: "neiforfaen/braglist-llm",
    url: "https://github.com/neiforfaen/braglist-llm",
  },
  {
    description:
      "Extensible local environment switcher for javascript/typescript projects.",
    title: "neiforfaen/kosei",
    url: "https://github.com/neiforfaen/kosei-cli",
  },
  {
    description:
      "Valorant rank lookup API for stream chatbots, fetch and format in a single request.",
    title: "neiforfaen/raiu",
    url: "https://github.com/neiforfaen/raiu",
  },
]

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

export const ProjectList = () => {
  const { onExitZone } = useCursor()

  return (
    <section className="flex flex-col gap-8" onPointerLeave={onExitZone}>
      {projects.map((project) => (
        <Project
          key={project.title}
          title={project.title}
          description={project.description}
          url={project.url}
        />
      ))}
    </section>
  )
}
