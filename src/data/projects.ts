export interface Project {
  name: string;
  description: string;
  url: string;
  badge: string;
}

export const projects: Project[] = [
  {
    name: "Raiu",
    url: "https://github.com/neiforfaen/raiu",
    description: "Ultra fast, minimal API to return formatted in-game ranks.",
    badge: "TypeScript",
  },
  {
    name: "Kosei",
    url: "https://github.com/neiforfaen/kosei-cli",
    description: "Simple, robust local environment switcher.",
    badge: "Rust",
  },
  {
    name: "Goji",
    url: "https://github.com/neiforfaen/goji",
    description: "Lightweight and lightning quick package.json script runner.",
    badge: "Rust",
  },
];
