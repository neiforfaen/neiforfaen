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

export const isValidSlug = (slug: string): boolean =>
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(slug)

export const getMediaSource = (media: ProjectMedia): string | null =>
  media.video || media.screenshot
