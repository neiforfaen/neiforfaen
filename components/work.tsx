"use client"

import Image from "next/image"
import type { StaticImageData } from "next/image"
import posthog from "posthog-js"
import type { ReactElement } from "react"
import { useId } from "react"

import pleoLogo from "@/assets/pleo-logo.webp"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"

interface WorkExperience {
  company: string
  start: string
  end?: string
  role: string
  logoSrc: StaticImageData
  description: ReactElement
}

const Description = ({ points }: { points: string[] }) => (
  <div className="flex flex-col gap-2 text-xs">
    {points.map((p) => {
      const id = useId()

      return (
        <div key={id} className="flex flex-row gap-2 items-start">
          <span>{`<>`}</span>
          <p>{p}</p>
        </div>
      )
    })}
  </div>
)

const associate2Points: string[] = [
  `Contributed to components and documentation of the shared
          design system beyond immediate team scope, improving consistency
          across the product surface`,
  `Built internal CLI tooling enabling engineers to switch between
          development and staging environments with a single command, reducing
          local setup friction and improving day-to-day dev experience`,
  `Led the full project lifecycle for an invoices related feature and
          initiated a beta test to gather customer feedback during a controlled
          rollout and iterated rapidly before releasing to the full user base`,
  `Collaborated cross-functionally with product managers, designers, and
          senior engineers to ship cohesive, well-tested features`,
]

const associatePoints: string[] = [
  `Led feature development across React and React Native apps enabling
          users to self-serve missing merchants directly from the "Vendor Lock"
          feature, eliminating a category of support request and reducing
          related CS tickets by ~80%`,
  `Bridged customer pain points and
          technical solutions end-to-end: scoping, building, and shipping across
          both surfaces as a first-year engineer`,
  `Promoted to Associate
          Engineer II after 7 months on the strength of this project`,
]

const experience: WorkExperience[] = [
  {
    company: "Pleo",
    description: <Description points={associate2Points} />,
    end: "jul '26",
    logoSrc: pleoLogo,
    role: "Associate Engineer II",
    start: "apr '25",
  },
  {
    company: "Pleo",
    description: <Description points={associatePoints} />,
    end: "apr '25",
    logoSrc: pleoLogo,
    role: "Associate Engineer",
    start: "sep '24",
  },
]

const WorkItem = ({ item }: { item: WorkExperience }) => (
  <div className="grid grid-cols-[48px_1fr] gap-4">
    <div className="flex aspect-square w-12 sm:w-full translate-y-0.5 items-center justify-center border text-foreground">
      <Image
        className="border-transparent"
        src={item.logoSrc}
        width={24}
        height={24}
        alt="logo"
        quality={100}
      />
    </div>

    <div className="flex flex-col gap-0.5 text-sm">
      <div className="flex justify-between items-center w-full">
        <span className="font-medium">{item.company}</span>
        <span className="font-light text-muted-foreground text-xs">
          {`${item.start} -> ${item.end}`}
        </span>
      </div>

      <span className="font-light text-foreground text-sm">{item.role}</span>
    </div>
  </div>
)

export const Work = () => (
  <section className="flex flex-col">
    <div className="flex flex-row justify-between items-center pb-2">
      <h2 className="text-lg font-medium">experience</h2>
      <span className="text-xs text-muted-foreground">
        [click any role for details]
      </span>
    </div>

    <div className="flex flex-col gap-4">
      {experience.map((we) => (
        <Dialog
          key={`${we.company}-${we.role.split(" ").join("-")}`}
          onOpenChange={(open) => {
            if (open) {
              posthog.capture("work_experience_opened", {
                company: we.company,
                role: we.role,
              })
            }
          }}
        >
          <DialogTrigger nativeButton={false} render={<WorkItem item={we} />} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{`${we.role} @ ${we.company}`}</DialogTitle>
              <DialogDescription>
                {`${we.start} -> ${we.end}`}
              </DialogDescription>
            </DialogHeader>
            <div className="border border-muted-foreground p-2">
              {we.description}
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  </section>
)
