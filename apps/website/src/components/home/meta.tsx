import type { ReactNode } from "react"

interface MetaItemProps {
  title: string
  description: ReactNode
}

const META_ITEMS: MetaItemProps[] = [
  {
    description: "berlin, germany",
    title: "base",
  },
  {
    description: "a11y / performance / design / creativity",
    title: "focus",
  },
  {
    description: (
      <a href="https://peec.ai" target="_blank" rel="noopener noreferrer">
        peec.ai
      </a>
    ),
    title: "building",
  },
]

const MetaItem = ({ title, description }: MetaItemProps) => (
  <div className="sm:border-t sm:border-(--border) pt-2.5 w-55 font-medium">
    <dt className="text-[clamp(0.75em,0.49em+0.28vw,2.25em)] text-(--meta)">
      {title}
    </dt>
    <dd className="text-[clamp(0.8em,0.49em+0.28vw,2.3em)] leading-none mt-2">
      {description}
    </dd>
  </div>
)

export const Meta = () => (
  <dl className="flex flex-col sm:flex-row gap-x-2.5 sm:gap-x-[clamp(0.8em,2vw,1.75em)] uppercase">
    {META_ITEMS.map(({ title, description }) => (
      <MetaItem key={title} title={title} description={description} />
    ))}
  </dl>
)
