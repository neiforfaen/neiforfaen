import { ProjectItem } from "./project-item"
import { Section } from "./section"

export const Project = () => {
	return (
		<Section>
			<Section.Title title="Projects" />
			<div className="grid gap-6 sm:gap-2">
				<ProjectItem
					name="Raiu"
					description="Ultra fast, minimal API to return formatted in-game ranks."
					url="https://github.com/neiforfaen/raiu"
					badge="TypeScript"
				/>
				<ProjectItem
					name="Kosei"
					description="Simple, robust local environment switcher."
					url="https://github.com/neiforfaen/kosei-cli"
					badge="Rust"
				/>
				<ProjectItem
					name="Goji"
					description="Lightweight and lightning quick package.json script runner."
					url="https://github.com/neiforfaen/goji"
					badge="Rust"
				/>
			</div>
		</Section>
	)
}
