import { Badge } from "@neiforfaen/ui"

export const Projects = () => {
	return (
		<section className="grid gap-6">
			<h2 className="font-medium text-muted-foreground pb-6 border-b">
				Projects
			</h2>
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
		</section>
	)
}

interface ProjectItemProps {
	name: string
	description: string
	url: string
	badge?: string
}

const ProjectItem = ({ name, description, url, badge }: ProjectItemProps) => {
	return (
		<a
			className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 no-underline"
			href={url}
			rel="noopener noreferrer"
			target="_blank"
		>
			{badge ? (
				<div className="flex flex-col w-full sm:flex-row sm:justify-between sm:items-center sm:gap-2">
					<div className="sm:flex sm:flex-row sm:items-center sm:gap-2">
						<p className="font-medium text-foreground transition-colors group-hover:text-muted-foreground">
							{name}
						</p>
						<p className="text-sm text-muted-foreground font-light">
							{description}
						</p>
					</div>
					<Badge variant="secondary" className="mt-1 sm:mt-0">
						{badge}
					</Badge>
				</div>
			) : (
				<div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
					<p className="font-medium text-foreground transition-colors group-hover:text-muted-foreground">
						{name}
					</p>
					<p className="text-sm text-muted-foreground font-light">
						{description}
					</p>
				</div>
			)}
		</a>
	)
}
