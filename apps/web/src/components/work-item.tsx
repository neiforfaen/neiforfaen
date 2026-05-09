type WorkItemProps = {
	imgSrc: string
	imgAlt: string
	imgSize?: number
	companyName: string
	jobRole: string | string[]
	dateRange: [string, string]
	description: string
}

export const WorkItem = ({
	imgSrc,
	imgAlt,
	imgSize = 24,
	companyName,
	jobRole,
	dateRange,
	description,
}: WorkItemProps) => (
	<div className="grid sm:grid-cols-[48px_1fr] gap-4 rounded-xl">
		<div className="flex aspect-square w-12 sm:w-full translate-y-0.5 items-center justify-center rounded-lg border text-foreground">
			<img
				className="border-transparent rounded-sm"
				src={imgSrc}
				alt={imgAlt}
				height={imgSize}
				width={imgSize}
			/>
		</div>

		<div className="grid gap-3">
			<div className="flex items-start justify-between gap-4">
				<div className="grid">
					<p className="font-medium text-foreground">{companyName}</p>
					{Array.isArray(jobRole) ? (
						jobRole.map((role) => (
							<p
								key={`job-role-${role}`}
								className="font-light text-muted-foreground"
							>
								{role}
							</p>
						))
					) : (
						<p className="font-light text-muted-foreground">{jobRole}</p>
					)}
				</div>
				<p className="font-light text-muted-foreground">
					{`${dateRange[0]} → ${dateRange[1]}`}
				</p>
			</div>
			<p className="text-muted-foreground font-light">{description}</p>
		</div>
	</div>
)
