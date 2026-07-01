import { describe, expect, it, vi } from "vitest"
import { render } from "vitest-browser-react"

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string | { src: string }; alt: string }) => (
    <img alt={alt} src={typeof src === "string" ? src : src.src} /> // oxlint-disable-line nextjs/no-img-element
  ),
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
      .element(screen.getByText(/ex-Frontend Engineer at/u))
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

  it("renders each project with a correctly linked description", async () => {
    const screen = await render(<Page />)

    const projects = [
      {
        description:
          "Knowledge base of my achievements, following Andrej Karpathy's LLM Wiki pattern.",
        title: "neiforfaen/braglist-llm",
        url: "https://github.com/neiforfaen/braglist-llm",
      },
      {
        description:
          "Extensible local environment switcher for javascript/typescript projects.",
        title: "neiforfaen/kosei",
        url: "https://github.com/neiforfaen/kosei-cli",
      },
      {
        description:
          "Valorant rank lookup API for stream chatbots, fetch and format in a single request.",
        title: "neiforfaen/raiu",
        url: "https://github.com/neiforfaen/raiu",
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
          .toHaveAttribute("href", project.url),
        expect
          .element(screen.getByRole("link", { name: project.description }))
          .toHaveAttribute("target", "_blank"),
        expect
          .element(screen.getByRole("link", { name: project.description }))
          .toHaveAttribute("rel", "noopener noreferrer"),
      ])
    }
  })

  it("renders the work section and each experience entry", async () => {
    const screen = await render(<Page />)

    await expect
      .element(screen.getByRole("heading", { name: "experience" }))
      .toBeVisible()
    await expect
      .element(screen.getByText("[click any role for details]"))
      .toBeVisible()

    await expect
      .element(screen.getByText("Associate Engineer II", { exact: true }))
      .toBeVisible()
    await expect
      .element(screen.getByText("Associate Engineer", { exact: true }))
      .toBeVisible()
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
