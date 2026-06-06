export interface Project {
  name: string;
  description: string;
  url: string;
}

export const projects: Project[] = [
  {
    name: "Raiu",
    url: "https://github.com/neiforfaen/raiu",
    description: "Ultra fast, minimal API to return formatted in-game ranks.",
  },
  {
    name: "Kosei",
    url: "https://github.com/neiforfaen/kosei-cli",
    description: "Simple, robust local environment switcher.",
  },
  {
    name: "Goji",
    url: "https://github.com/neiforfaen/goji",
    description: "Lightweight and lightning quick package.json script runner.",
  },
];
