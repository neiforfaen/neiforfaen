"use client"

import posthog from "posthog-js"
import { Fragment } from "react"

const links: { label: string; url: string }[] = [
  { label: "linkedin", url: "https://linkedin.com/in/kaiden-riley" },
  { label: "github", url: "https://github.com/neiforfaen" },
  { label: "mail", url: "mailto:kaiden@0x424.kr" },
  { label: "resume", url: "/resume.pdf" },
]

export const About = () => (
  <section className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
    <p className="text-sm leading-relaxed max-w-106 text-balance">
      Product engineer shipping AI-native experiences across mobile and web.
      Originally from Manchester, England; now living in Berlin, Germany. ex-
      {""}
      <a
        href="https://pleo.io"
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-foreground/75 underline underline-offset-4"
      >
        Pleo
      </a>
      .
    </p>
    <div className="flex flex-row gap-2 text-sm max-w-fit">
      {links.map(({ label, url }, index) => {
        const showSeparator = index > 0

        return (
          <Fragment key={label}>
            {showSeparator && <span>/</span>}
            <a
              className="underline underline-offset-4 cursor-target"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                posthog.capture("contact_link_clicked", { label, url })
              }
            >
              {label}
            </a>
          </Fragment>
        )
      })}
    </div>
  </section>
)
