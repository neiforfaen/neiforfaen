import type { PlopTypes } from "@turbo/gen";

export default function generator(plop: PlopTypes.NodePlopAPI): void {
	plop.setGenerator("init", {
		description: "Generate a new package for the Monorepo",
		prompts: [
			{
				type: "input",
				name: "name",
				message:
					"What is the name of the package? (You can skip the `@neiforfaen/` prefix)",
			},
		],
		actions: [
			(answers) => {
				if (
					"name" in answers &&
					typeof answers.name === "string" &&
					answers.name.startsWith("@neiforfaen/")
				) {
					answers.name = answers.name.replace("@neiforfaen/", "");
				}
				return "Config sanitized";
			},
			{
				type: "add",
				path: "packages/{{ name }}/package.json",
				templateFile: "templates/package.json.hbs",
			},
			{
				type: "add",
				path: "packages/{{ name }}/tsconfig.json",
				templateFile: "templates/tsconfig.json.hbs",
			},
			{
				type: "add",
				path: "packages/{{ name }}/biome.jsonc",
				templateFile: "templates/biome.jsonc.hbs",
			},
		],
	});
}
