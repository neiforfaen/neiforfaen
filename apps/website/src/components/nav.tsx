import { Link, useLocation } from "@tanstack/react-router"
import { useMemo } from "react"

const NAV_ITEMS: Record<"title" | "to", string>[] = [
  {
    title: "home",
    to: "/",
  },
  {
    title: "projects",
    to: "/projects",
  },
  {
    title: "about",
    to: "/about",
  },
  {
    title: "contact",
    to: "/contact",
  },
]

export const Nav = () => {
  const location = useLocation()

  const isLinkActive = useMemo(
    () => (v: string) =>
      v === location.pathname ? "text-(--primary-text)" : "text-(--meta)",
    [location.pathname]
  )

  return (
    <nav className="uppercase fixed flex flex-col gap-[0.1em] top-[clamp(1.125rem,2.8vw,2.5rem)] right-[clamp(0.875rem,3.1vw,2.75rem)] text-right">
      {NAV_ITEMS.map(({ title, to }) => (
        <Link
          to={to}
          key={title}
          className={`font-medium duration-300 ease-in-out transition-all hover:-translate-x-1 text-[clamp(0.75em,0.49em+0.28vw,2.25em)] hover:text-(--primary-text) ${isLinkActive(to)}`}
        >
          {title}
        </Link>
      ))}
    </nav>
  )
}
