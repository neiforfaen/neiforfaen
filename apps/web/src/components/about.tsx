import { Section } from "./section"

export const About = () => {
	return (
		<Section>
			<Section.Title title="About" />
			<p>
				I have a deep passion for building elegant, performant user experiences
				and specialize in modern frontend architecture using{" "}
				<span className="text-muted-foreground">React</span> and{" "}
				<span className="text-muted-foreground">TypeScript</span>. My focus is
				on creating intuitive user interfaces, with a particular interest in
				frontend developer tooling.
			</p>
			<p>
				Outside of the visual layer, I'm interested in the systems and decisions
				underneath great products and spend my free time learning beyond pure
				frontend work.
			</p>
		</Section>
	)
}
