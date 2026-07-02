"use server"

import { promises as fs } from "node:fs"
import path from "node:path"

import type { Project } from "./project-types"

interface ProjectsData {
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
