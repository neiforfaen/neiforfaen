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
    return createMetadata({ title: "Project not found", description: "" })
  }

  return createMetadata({
    title: project.title,
    description: project.shortDescription,
    openGraph: {
      title: project.title,
      description: project.shortDescription,
      images: project.media.screenshot ? [project.media.screenshot] : undefined,
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
