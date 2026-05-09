import { Badge } from "@neiforfaen/design-system/components/ui/badge"

interface ProjectItemProps {
	name: string
	description: string
	url: string
	badge?: string
}

export const ProjectItem = ({
	name,
	description,
	url,
	badge,
}: ProjectItemProps) => (
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
