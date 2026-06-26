interface ProjectProps {
  title: string
  description: string
  url: string
}

export const Project = ({ title, description, url }: ProjectProps) => (
  <div className="flex flex-col gap-2">
    <h2 className="text-lg font-medium">{title}</h2>
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={url}
      className="text-sm underline underline-offset-4"
    >
      {description}
    </a>
  </div>
)
