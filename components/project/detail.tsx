"use client"

import Image from "next/image"
import posthog from "posthog-js"
import { useRef } from "react"

import { useCursor } from "@/components/providers/cursor"
import type { Project } from "@/lib/projects"
import { getMediaSource } from "@/lib/projects"

interface ProjectDetailProps {
  project: Project
}

export const ProjectDetail = ({ project }: ProjectDetailProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const { onEnter, onLeave } = useCursor()

  const handleLinkClick = (type: "github" | "demo", url: string) => {
    posthog.capture("project_link_clicked", {
      link_type: type,
      project_slug: project.slug,
      url,
    })
  }

  const mediaSource = getMediaSource(project.media)
  const isVideo = project.media.video !== null

  return (
    <main className="flex flex-col gap-12">
      {/* Hero Media */}
      {mediaSource ? (
        <div className="w-full bg-neutral-100 dark:bg-neutral-900 rounded-lg overflow-hidden">
          {isVideo ? (
            <video
              src={mediaSource}
              controls
              className="w-full h-auto max-h-[600px] object-cover"
              aria-label={`${project.title} demo video`}
            >
              <track kind="captions" />
            </video>
          ) : (
            <div className="relative w-full aspect-video">
              <Image
                src={mediaSource}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
        </div>
      ) : (
        <div className="w-full aspect-video bg-neutral-200 dark:bg-neutral-800 rounded-lg flex items-center justify-center">
          <p className="text-neutral-500">Media not available</p>
        </div>
      )}

      {/* Description */}
      <div className="w-full max-w-3xl">
        <p className="text-base leading-relaxed text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">
          {project.description}
        </p>
      </div>

      {/* Meta Section - Split columns on desktop, stack on mobile */}
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
        className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Tech Stack */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-600 dark:text-neutral-400">
            Technologies
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-sm text-neutral-700 dark:text-neutral-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-600 dark:text-neutral-400">
            Links
          </h3>
          <div className="flex flex-col gap-2">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm underline underline-offset-4 text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-400"
              onClick={() => handleLinkClick("github", project.github)}
            >
              GitHub Repository
            </a>
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline underline-offset-4 text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-400"
                onClick={() => handleLinkClick("demo", project.demo || "")}
              >
                Live Demo
              </a>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
