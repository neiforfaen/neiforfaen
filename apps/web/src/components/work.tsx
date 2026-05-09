import * as m from "@neiforfaen/i18n/messages"
import PleoLogoSrc from "../assets/pleo-logo.webp"

export const Work = () => {
	return (
		<section className="grid gap-6">
			<h2 className="font-medium text-muted-foreground pb-6 border-b">
				{m.work_title()}
			</h2>
			<div className="grid gap-8">
				<WorkItem
					imgSrc={PleoLogoSrc}
					imgAlt="Pleo logo"
					companyName="Pleo"
					jobRoles={["Associate Engineer II", "Associate Engineer"]}
					dateRange={["Sep 2024", "Present"]}
					description={m.pleo_experience()}
				/>
			</div>
		</section>
	)
}

interface WorkItemProps {
	imgSrc: string
	imgAlt: string
	imgSize?: number
	companyName: string
	jobRoles: string[]
	dateRange: [string, string]
	description: string
}

const WorkItem = ({
	imgSrc,
	imgAlt,
	imgSize = 24,
	companyName,
	jobRoles,
	dateRange,
	description,
}: WorkItemProps) => {
	return (
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
						{jobRoles.map((role) => (
							<p
								key={`job-role-${role}`}
								className="font-light text-muted-foreground"
							>
								{role}
							</p>
						))}
					</div>

					<p className="font-light text-muted-foreground">
						{`${dateRange[0]} → ${dateRange[1]}`}
					</p>
				</div>

				<p className="text-muted-foreground font-light">{description}</p>
			</div>
		</div>
	)
}
