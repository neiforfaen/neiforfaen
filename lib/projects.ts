"use server"

import { promises as fs } from "node:fs"
import path from "node:path"

export interface ProjectMedia {
  video: string | null
  screenshot: string | null
}

export interface Project {
  slug: string
  title: string
  shortDescription: string
  description: string
  tech: string[]
  github: string
  demo: string | null
  media: ProjectMedia
}

export interface ProjectsData {
  projects: Project[]
}

let cachedProjects: Project[] | null = null

const loadProjectsData = async (): Promise<ProjectsData> => {
  const filePath = path.join(process.cwd(), "content", "projects.json")
  const content = await fs.readFile(filePath, "utf-8")
  return JSON.parse(content) as ProjectsData
}

export const loadProjects = async (): Promise<Project[]> => {
  if (cachedProjects !== null) {
    return cachedProjects
  }

  const data = await loadProjectsData()
  cachedProjects = data.projects
  return cachedProjects
}

export const getProjectBySlug = async (
  slug: string
): Promise<Project | null> => {
  const projects = await loadProjects()
  return projects.find((p) => p.slug === slug) ?? null
}

export const isValidSlug = (slug: string): boolean =>
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(slug)

export const getMediaSource = (media: ProjectMedia): string | null =>
  media.video || media.screenshot
