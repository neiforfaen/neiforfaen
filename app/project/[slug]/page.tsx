import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { Header } from "@/components/header"
import { ProjectDetail } from "@/components/project/detail"
import { createMetadata } from "@/lib/metadata"
import { getProjectBySlug, loadProjects } from "@/lib/projects.server"

interface ProjectPageProps {
  params: Promise<{
    slug: string
  }>
}

export const generateStaticParams = async () => {
  const projects = await loadProjects()
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export const generateMetadata = async ({
  params,
}: ProjectPageProps): Promise<Metadata> => {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    return createMetadata({ description: "", title: "Project not found" })
  }

  return createMetadata({
    description: project.shortDescription,
    openGraph: {
      description: project.shortDescription,
      images: project.media.screenshot ? [project.media.screenshot] : undefined,
      title: project.title,
    },
    title: project.title,
  })
}

const ProjectPage = async ({ params }: ProjectPageProps) => {
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

export default ProjectPage
