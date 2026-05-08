import type { ReactNode } from "react"

const Section = ({ children }: { children: ReactNode; space?: number }) => (
	<section className={"grid gap-6"}>{children}</section>
)

const SectionTitle = ({ title }: { title: string }) => (
	<h2 className="font-medium text-muted-foreground pb-6 border-b">{title}</h2>
)

Section.displayName = "Section"
Section.Title = SectionTitle

export { Section }
