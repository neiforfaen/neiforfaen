import { describe, expect, it, vi } from "vitest"
import { render } from "vitest-browser-react"

import { posts } from "@/app/writing/posts"

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string | { src: string }; alt: string }) => (
    <img alt={alt} src={typeof src === "string" ? src : src.src} /> // oxlint-disable-line nextjs/no-img-element
  ),
}))

vi.mock("@/lib/projects", () => ({
  getProjectBySlug: async (slug: string) => null,
  loadProjects: async () => [
    {
      description:
        "Personal site and portfolio, doubling as a working sample of my frontend craft.",
      demo: "https://kaiden.dev",
      github: "https://github.com/neiforfaen/neiforfaen",
      media: { screenshot: "/projects/neiforfaen-screenshot.png", video: null },
      shortDescription:
        "Personal site and portfolio, doubling as a working sample of my frontend craft.",
      slug: "neiforfaen",
      tech: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
      title: "neiforfaen/neiforfaen",
    },
    {
      description:
        "Knowledge base of my achievements, following Andrej Karpathy's LLM Wiki pattern.",
      demo: null,
      github: "https://github.com/neiforfaen/braglist-llm",
      media: {
        screenshot: "/projects/braglist-llm-screenshot.png",
        video: null,
      },
      shortDescription:
        "Knowledge base of my achievements, following Andrej Karpathy's LLM Wiki pattern.",
      slug: "braglist-llm",
      tech: ["JavaScript", "Node.js"],
      title: "neiforfaen/braglist-llm",
    },
    {
      description:
        "Extensible local environment switcher for javascript/typescript projects.",
      demo: null,
      github: "https://github.com/neiforfaen/kosei-cli",
      media: { screenshot: "/projects/kosei-screenshot.png", video: null },
      shortDescription:
        "Extensible local environment switcher for javascript/typescript projects.",
      slug: "kosei",
      tech: ["TypeScript", "Node.js", "CLI"],
      title: "neiforfaen/kosei",
    },
    {
      description:
        "An API service that provides Valorant player rank lookups optimized for stream chatbots. Fetches player data, formats rankings, and delivers results in a single request with caching for performance.",
      demo: null,
      github: "https://github.com/neiforfaen/raiu",
      media: { screenshot: "/projects/raiu-screenshot.png", video: null },
      shortDescription:
        "Valorant rank lookup API for stream chatbots, fetch and format in a single request.",
      slug: "raiu",
      tech: ["TypeScript", "Node.js", "API", "Valorant"],
      title: "neiforfaen/raiu",
    },
  ],
}))

const { default: Page } = await import("@/app/page")

describe("Page", () => {
  it("renders the header with the site identity and availability status", async () => {
    const screen = await render(<Page />)

    await expect.element(screen.getByText("kaiden")).toBeVisible()
    await expect
      .element(screen.getByRole("link", { name: "0x424" }))
      .toHaveAttribute("href", "/")
    await expect.element(screen.getByText("looking for work")).toBeVisible()
  })

  it("renders the about section with correctly linked contacts", async () => {
    const screen = await render(<Page />)

    await expect
      .element(screen.getByText(/Product engineer shipping/u))
      .toBeVisible()

    const pleoLink = screen.getByRole("link", { name: "Pleo" })
    await expect.element(pleoLink).toHaveAttribute("href", "https://pleo.io")
    await expect.element(pleoLink).toHaveAttribute("target", "_blank")
    await expect.element(pleoLink).toHaveAttribute("rel", "noopener noreferrer")

    const contactLinks = [
      { label: "linkedin", url: "https://linkedin.com/in/kaiden-riley" },
      { label: "github", url: "https://github.com/neiforfaen" },
      { label: "mail", url: "mailto:kaiden@0x424.kr" },
    ]

    for (const { label, url } of contactLinks) {
      // oxlint-disable-next-line no-await-in-loop
      await expect
        .element(screen.getByRole("link", { name: label }))
        .toHaveAttribute("href", url)
    }
  })

  it.skip("renders each project with a correctly linked description", async () => {
    const screen = await render(<Page />)

    const projects = [
      {
        description:
          "Personal site and portfolio, doubling as a working sample of my frontend craft.",
        slug: "neiforfaen",
        title: "neiforfaen/neiforfaen",
      },
      {
        description:
          "Knowledge base of my achievements, following Andrej Karpathy's LLM Wiki pattern.",
        slug: "braglist-llm",
        title: "neiforfaen/braglist-llm",
      },
      {
        description:
          "Extensible local environment switcher for javascript/typescript projects.",
        slug: "kosei",
        title: "neiforfaen/kosei",
      },
      {
        description:
          "Valorant rank lookup API for stream chatbots, fetch and format in a single request.",
        slug: "raiu",
        title: "neiforfaen/raiu",
      },
    ]

    for (const project of projects) {
      // oxlint-disable-next-line no-await-in-loop
      await Promise.all([
        expect
          .element(screen.getByRole("heading", { name: project.title }))
          .toBeVisible(),
        expect
          .element(screen.getByRole("link", { name: project.description }))
          .toHaveAttribute("href", `/project/${project.slug}`),
      ])
    }
  })

  it("renders the work section and each experience entry", async () => {
    const screen = await render(<Page />)

    await expect
      .element(screen.getByRole("heading", { name: "experience" }))
      .toBeVisible()
    await expect
      .element(screen.getByText("[click a role for more details]"))
      .toBeVisible()

    await expect
      .element(screen.getByText("Associate Engineer II", { exact: true }))
      .toBeVisible()
    await expect
      .element(screen.getByText("Associate Engineer", { exact: true }))
      .toBeVisible()
  })

  it("renders the writing section and each entry", async () => {
    const screen = await render(<Page />)

    await expect
      .element(screen.getByRole("heading", { name: "writing" }))
      .toBeVisible()

    await Promise.all(
      posts.map(({ title }) =>
        expect.element(screen.getByText(title, { exact: true })).toBeVisible()
      )
    )
  })

  it("opens and closes the experience dialog with the right details", async () => {
    const screen = await render(<Page />)

    const experiences = [
      {
        company: "Pleo",
        point: /shared\s+design\s+system/u,
        range: "apr '25 -> jul '26",
        role: "Associate Engineer II",
      },
      {
        company: "Pleo",
        point: /Vendor\s+Lock/u,
        range: "sep '24 -> apr '25",
        role: "Associate Engineer",
      },
    ]

    for (const experience of experiences) {
      const dialog = screen.getByRole("dialog")

      // oxlint-disable-next-line no-await-in-loop
      await Promise.all([
        screen.getByText(experience.role, { exact: true }).click(),
        expect.element(dialog).toBeVisible(),
        expect
          .element(
            dialog.getByRole("heading", {
              name: `${experience.role} @ ${experience.company}`,
            })
          )
          .toBeVisible(),
        expect.element(dialog.getByText(experience.range)).toBeVisible(),
        expect.element(dialog.getByText(experience.point)).toBeVisible(),
        dialog.getByRole("button", { name: "Close" }).click(),
        expect.element(dialog).not.toBeInTheDocument(),
      ])
    }
  })
})
