import PleoLogoSrc from "../assets/pleo-logo.webp"
import { Section } from "./section"
import { WorkItem } from "./work-item"

export const Work = () => {
	return (
		<Section>
			<Section.Title title="Work" />
			<div className="grid gap-8">
				<WorkItem
					imgSrc={PleoLogoSrc}
					imgAlt="Pleo logo"
					companyName="Pleo"
					jobRole={["Associate Engineer II", "Associate Engineer"]}
					dateRange={["Sep 2024", "Present"]}
					description="Built and maintained subscriptions and recurring vendor features,
				advanced analytics dashboards with filters, virtualized vendor tables,
				and integrated Metabase analytics. Also drove UI/UX improvements across
				the platform with contributions to the company design system."
				/>
			</div>
		</Section>
	)
}
