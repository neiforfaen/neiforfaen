import * as m from "@neiforfaen/i18n/messages"

export const About = () => {
	return (
		<section className="grid gap-6">
			<h2 className="font-medium text-muted-foreground pb-6 border-b">
				{m.about_title()}
			</h2>
			<p>{m.about_section_one({ techOne: "React", techTwo: "TypeScript" })}</p>
			<p>{m.about_section_two()}</p>
		</section>
	)
}
