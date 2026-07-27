import { Link } from "@tanstack/react-router"
import type { ReactNode } from "react"

interface PageProps {
  children: ReactNode
  header?: boolean
}

const Header = () => (
  <header>
    <div className="group hover:scale-95 transition-transform cursor-pointer size-[clamp(2.5rem,calc(2.5rem+(100vw-(var(--breakpoint-md)))*0.025),3rem)] grid place-items-center bg-[#262626] rounded-full">
      <Link to="/">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="#efefef"
          viewBox="0 0 256 256"
          className="group-hover:scale-95 transition-transform size-[clamp(1.25rem,calc(1.25rem+(100vw-(var(--breakpoint-md)))*0.0125),1.5rem)]"
        >
          <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z" />
        </svg>
      </Link>
    </div>
  </header>
)

export const Page = ({ children, header = false }: PageProps) => {
  const defaultPageStyles =
    "h-full w-full py-[clamp(1.125rem,2.8vw,2.5rem)] px-[clamp(0.875rem,3.1vw,2.75rem)]"
  const withHeaderStyles = "grid grid-rows-[3rem_1fr]"

  const appliedStyles = header
    ? `${defaultPageStyles} ${withHeaderStyles}`
    : defaultPageStyles

  return (
    <section className={appliedStyles}>
      {header && <Header />}
      {children}
    </section>
  )
}
