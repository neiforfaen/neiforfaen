import PleoLogoSrc from "../assets/pleo-logo.webp";
import SiteIcon from "../../public/favicon.ico";
import { useFeatureFlag } from "@/composables/feature-flags";

const isOpenToWork = useFeatureFlag("isOpenToWork");

export interface Job {
  imgSrc: string;
  imgAlt: string;
  imgSize?: number;
  companyName: string;
  jobRoles: string[];
  dateRange: [string, string];
  description: string;
}

const lookingForWorkItem: Job = {
  imgSrc: SiteIcon,
  imgAlt: "looking for work image",
  companyName: "Open to work",
  jobRoles: ["Product Engineer", "Frontend Engineer", "Fullstack Engineer (Frontend Bias)"],
  dateRange: [import.meta.env.OPEN_TO_WORK_DATE_FROM, "Future"],
  description:
    "Currently available for new opportunities. I'm actively seeking my next role and excited to bring my skills and experience to a new team.",
};

export const jobs: Job[] = [
  isOpenToWork && lookingForWorkItem,
  {
    imgSrc: PleoLogoSrc,
    imgAlt: "Pleo logo",
    companyName: "Pleo",
    jobRoles: ["Associate Engineer II", "Associate Engineer"],
    dateRange: ["Sep 2024", "July 2026"],
    description:
      "Built and maintained subscriptions and recurring vendor features, advanced analytics dashboards with filters, virtualized vendor tables, and integrated Metabase analytics. Also drove UI/UX improvements across the platform with contributions to the company design system.",
  },
].filter(Boolean) as Job[];
