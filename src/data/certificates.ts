export interface Certificate {
  name: string;
  url: string;
  status: "COMPLETED" | "IN_PROGRESS";
  completionDate?: string;
}

export const certificates: Certificate[] = [
  {
    name: "AI Agents with MCP & TypeScript",
    url: "https://coursera.org/share/a08d2de273304fbf3da3267fb53c6986",
    status: "COMPLETED",
    completionDate: "April 23, 2026",
  },
  {
    name: "Software Design and Architecture Specialization",
    url: "https://www.coursera.org/specializations/software-design-architecture",
    status: "IN_PROGRESS",
  },
];
