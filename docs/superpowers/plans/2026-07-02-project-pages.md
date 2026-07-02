# Project Detail Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build individual project pages at `/project/[slug]` that display project details (media, description, tech stack, links) while updating the homepage to link to these detail pages instead of GitHub.

**Architecture:** Store all project metadata in a single JSON file (`content/projects.json`). Create a utility module to load and parse projects with type safety. Build a reusable detail layout component. Create a dynamic route handler for individual projects. Update the existing ProjectList component to link to detail pages.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, JSON for data storage

## Global Constraints

- Follow existing code style and patterns (Tailwind for styling, cursor provider pattern for interactivity)
- All project slugs must be URL-safe (lowercase, hyphens only)
- Media paths should be relative to `public/` (e.g., `/projects/screenshot.png`)
- Metadata generation uses existing `createMetadata` utility from `lib/metadata`
- No new dependencies; use native Next.js / React features
- GitHub link is always required; demo link is optional
- Video takes priority over screenshot when both exist

---

## File Structure

**Create:**

- `content/projects.json` — project metadata
- `lib/projects.ts` — project loading/validation utilities
- `components/project/detail.tsx` — reusable detail page layout
- `app/project/[slug]/page.tsx` — dynamic route handler

**Modify:**

- `components/project.tsx` — update ProjectList to link to `/project/[slug]`

**Media assets** (create placeholder paths, user will add images/videos later):

- `public/projects/` — directory for media files

---

## Task 1: Create projects.json with migrated data

**Files:**

- Create: `content/projects.json`

**Interfaces:**

- Produces: Project data array with slug, title, shortDescription, description, tech, github, demo, media

**Steps:**

- [ ] **Step 1: Create projects.json with 4 projects**

Create `/Users/kaiden/code/neiforfaen/content/projects.json`:

```json
{
  "projects": [
    {
      "slug": "neiforfaen",
      "title": "neiforfaen/neiforfaen",
      "shortDescription": "Personal site and portfolio, doubling as a working sample of my frontend craft.",
      "description": "This is my personal portfolio and blog — a place to showcase my frontend work and share thoughts on web development. Built with Next.js, React, and Tailwind CSS. It serves as both a professional portfolio and an ongoing experiment with modern web technologies.",
      "tech": ["Next.js", "React", "TypeScript", "Tailwind CSS"],
      "github": "https://github.com/neiforfaen/neiforfaen",
      "demo": "https://kaiden.dev",
      "media": {
        "video": null,
        "screenshot": "/projects/neiforfaen-screenshot.png"
      }
    },
    {
      "slug": "braglist-llm",
      "title": "neiforfaen/braglist-llm",
      "shortDescription": "Knowledge base of my achievements, following Andrej Karpathy's LLM Wiki pattern.",
      "description": "A knowledge base system for tracking accomplishments and learnings, inspired by Andrej Karpathy's approach to documenting technical expertise. Built to help organize and retrieve professional achievements in a structured format.",
      "tech": ["JavaScript", "Node.js"],
      "github": "https://github.com/neiforfaen/braglist-llm",
      "demo": null,
      "media": {
        "video": null,
        "screenshot": "/projects/braglist-llm-screenshot.png"
      }
    },
    {
      "slug": "kosei",
      "title": "neiforfaen/kosei",
      "shortDescription": "Extensible local environment switcher for javascript/typescript projects.",
      "description": "A CLI tool that makes it easy to switch between different local environments for JavaScript and TypeScript projects. Supports environment configuration, variable management, and quick switching between development contexts.",
      "tech": ["TypeScript", "Node.js", "CLI"],
      "github": "https://github.com/neiforfaen/kosei-cli",
      "demo": null,
      "media": {
        "video": null,
        "screenshot": "/projects/kosei-screenshot.png"
      }
    },
    {
      "slug": "raiu",
      "title": "neiforfaen/raiu",
      "shortDescription": "Valorant rank lookup API for stream chatbots, fetch and format in a single request.",
      "description": "An API service that provides Valorant player rank lookups optimized for stream chatbots. Fetches player data, formats rankings, and delivers results in a single request with caching for performance.",
      "tech": ["TypeScript", "Node.js", "API", "Valorant"],
      "github": "https://github.com/neiforfaen/raiu",
      "demo": null,
      "media": {
        "video": null,
        "screenshot": "/projects/raiu-screenshot.png"
      }
    }
  ]
}
```

- [ ] **Step 2: Verify JSON is valid**

Run: `cat content/projects.json | jq . > /dev/null && echo "Valid JSON"`

Expected: Output "Valid JSON"

---

## Task 2: Create project utilities library

**Files:**

- Create: `lib/projects.ts`

**Interfaces:**

- Produces:
  - Type `Project` with all project fields
  - Function `loadProjects(): Promise<Project[]>`
  - Function `getProjectBySlug(slug: string): Promise<Project | null>`

**Steps:**

- [ ] **Step 1: Create lib/projects.ts with types and utilities**

Create `/Users/kaiden/code/neiforfaen/lib/projects.ts`:

```typescript
import { promises as fs } from "fs"
import path from "path"

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

async function loadProjectsData(): Promise<ProjectsData> {
  const filePath = path.join(process.cwd(), "content", "projects.json")
  const content = await fs.readFile(filePath, "utf-8")
  return JSON.parse(content) as ProjectsData
}

export async function loadProjects(): Promise<Project[]> {
  if (cachedProjects !== null) {
    return cachedProjects
  }

  const data = await loadProjectsData()
  cachedProjects = data.projects
  return cachedProjects
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await loadProjects()
  return projects.find((p) => p.slug === slug) ?? null
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
}

export function getMediaSource(media: ProjectMedia): string | null {
  return media.video || media.screenshot
}
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `bun run typecheck`

Expected: No TypeScript errors

---

## Task 3: Create project detail layout component

**Files:**

- Create: `components/project/detail.tsx`

**Interfaces:**

- Consumes: `Project` type from `lib/projects`
- Produces: React component `ProjectDetail` that renders a project's full detail page

**Steps:**

- [ ] **Step 1: Create components/project/detail.tsx**

Create `/Users/kaiden/code/neiforfaen/components/project/detail.tsx`:

```typescript
"use client"

import Image from "next/image"
import posthog from "posthog-js"
import { useRef } from "react"

import type { Project } from "@/lib/projects"
import { getMediaSource } from "@/lib/projects"
import { useCursor } from "@/components/providers/cursor"

interface ProjectDetailProps {
  project: Project
}

export const ProjectDetail = ({ project }: ProjectDetailProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const { onEnter, onLeave } = useCursor()

  const handleLinkClick = (type: "github" | "demo", url: string) => {
    posthog.capture("project_link_clicked", {
      project_slug: project.slug,
      link_type: type,
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
            />
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
          if (e.pointerType === "touch") return
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
                onClick={() => handleLinkClick("demo", project.demo!)}
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
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `bun run typecheck`

Expected: No TypeScript errors

---

## Task 4: Create dynamic project route handler

**Files:**

- Create: `app/project/[slug]/page.tsx`

**Interfaces:**

- Consumes:
  - `Project` type from `lib/projects`
  - `getProjectBySlug()` from `lib/projects`
  - `ProjectDetail` component from `components/project/detail`
  - `Header` component from `components/header`
  - `createMetadata()` from `lib/metadata`
- Produces: Next.js page component with metadata

**Steps:**

- [ ] **Step 1: Create app/project/[slug]/page.tsx**

Create `/Users/kaiden/code/neiforfaen/app/project/[slug]/page.tsx`:

```typescript
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { Header } from "@/components/header"
import { ProjectDetail } from "@/components/project/detail"
import { createMetadata } from "@/lib/metadata"
import { getProjectBySlug, loadProjects } from "@/lib/projects"

interface ProjectPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const projects = await loadProjects()
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export async function generateMetadata(
  { params }: ProjectPageProps,
): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    return createMetadata({ title: "Project not found" })
  }

  return createMetadata({
    title: project.title,
    description: project.shortDescription,
    og: {
      title: project.title,
      description: project.shortDescription,
      image: project.media.screenshot || undefined,
    },
  })
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  return (
    <>
      <Header />
      <ProjectDetail project={project} />
    </>
  )
}
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `bun run typecheck`

Expected: No TypeScript errors

---

## Task 5: Update ProjectList component to link to detail pages

**Files:**

- Modify: `components/project.tsx`

**Interfaces:**

- Consumes: Projects data (will load from JSON via `loadProjects()`)
- Produces: Updated `ProjectList` that links to `/project/[slug]`

**Steps:**

- [ ] **Step 1: Update components/project.tsx to use projects.json and link to detail pages**

Replace the entire file `/Users/kaiden/code/neiforfaen/components/project.tsx` with:

```typescript
"use client"

import Link from "next/link"
import posthog from "posthog-js"
import { useEffect, useRef, useState } from "react"

import { useCursor } from "@/components/providers/cursor"
import { loadProjects } from "@/lib/projects"
import type { Project } from "@/lib/projects"

export const Project = ({ project }: { project: Project }) => {
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
            project_title: project.title,
            project_slug: project.slug,
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
    loadProjects().then((data) => {
      setProjects(data)
      setLoading(false)
    })
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
        <Project key={project.slug} project={project} />
      ))}
    </section>
  )
}
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `bun run typecheck`

Expected: No TypeScript errors

---

## Task 6: Create public/projects directory and verify build

**Files:**

- Create: `public/projects/.gitkeep` (placeholder for media assets)

**Steps:**

- [ ] **Step 1: Create projects media directory**

Run: `mkdir -p /Users/kaiden/code/neiforfaen/public/projects && touch /Users/kaiden/code/neiforfaen/public/projects/.gitkeep`

Expected: Directory created successfully

- [ ] **Step 2: Build the project to verify no errors**

Run: `bun run build`

Expected: Build completes successfully with no errors

---

## Task 7: Verify feature works end-to-end

**Files:**

- Test: Manual verification in browser

**Steps:**

- [ ] **Step 1: Start development server**

Run: `bun run dev`

Expected: Server starts on http://localhost:3000

- [ ] **Step 2: Visit homepage and verify projects link to detail pages**

Navigate to: `http://localhost:3000`

Verify:

- All 4 projects are listed
- Clicking a project title navigates to `/project/[slug]`

- [ ] **Step 3: Visit a project detail page**

Navigate to: `http://localhost:3000/project/neiforfaen`

Verify:

- Page loads without 404
- Header is visible and clickable (logo goes back to homepage)
- Media placeholder shows (or image if added)
- Description displays
- Tech stack shows as pills
- GitHub and Demo links display correctly

- [ ] **Step 4: Test other projects**

Navigate to each of:

- `http://localhost:3000/project/braglist-llm`
- `http://localhost:3000/project/kosei`
- `http://localhost:3000/project/raiu`

Verify: Each page loads and displays correctly

- [ ] **Step 5: Test invalid project slug**

Navigate to: `http://localhost:3000/project/nonexistent`

Verify: 404 page displays

- [ ] **Step 6: Verify mobile responsiveness**

Open browser DevTools (F12), toggle device toolbar, test mobile view

Verify:

- Meta section stacks to single column on mobile
- All text is readable
- Links are clickable

---

## Success Criteria Checklist

- [ ] Project detail pages render at `/project/[slug]`
- [ ] Homepage project links navigate to detail pages (not GitHub)
- [ ] Media displays correctly (screenshot fallback works)
- [ ] Tech stack and links display in split columns (desktop) / stacked (mobile)
- [ ] Metadata/SEO tags generated correctly (check page source or Inspector)
- [ ] All 4 existing projects have working detail pages
- [ ] Can click header logo to return to homepage from any project page
- [ ] Invalid slugs return 404
- [ ] Build succeeds with no errors
