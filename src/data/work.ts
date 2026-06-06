import PleoLogoSrc from "../assets/pleo-logo.webp";

export interface Job {
  imgSrc: string;
  imgAlt: string;
  imgSize?: number;
  companyName: string;
  jobRoles: string[];
  dateRange: [string, string];
  description: string;
}

export const jobs: Job[] = [
  {
    imgSrc: PleoLogoSrc,
    imgAlt: "Pleo logo",
    companyName: "Pleo",
    jobRoles: ["Associate Engineer II", "Associate Engineer"],
    dateRange: ["Sep 2024", "July 2026"],
    description:
      "Built and maintained subscriptions and recurring vendor features, advanced analytics dashboards with filters, virtualized vendor tables, and integrated Metabase analytics. Also drove UI/UX improvements across the platform with contributions to the company design system.",
  },
];
