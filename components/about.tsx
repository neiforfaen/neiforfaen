"use client"

import posthog from "posthog-js"
import { Fragment } from "react"

const links: { label: string; url: string }[] = [
  { label: "linkedin", url: "https://linkedin.com/in/kaiden-riley" },
  { label: "github", url: "https://github.com/neiforfaen" },
  { label: "mail", url: "mailto:kaiden@0x424.kr" },
]

export const About = () => (
  <section className="flex flex-col gap-6">
    <p className="text-balance text-sm leading-relaxed">
      ex-Frontend Engineer at{" "}
      <a
        href="https://pleo.io"
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-foreground/75 underline underline-offset-4"
      >
        Pleo
      </a>
      . Focused on building exceptional user experiences across mobile and web.
    </p>
    <div className="flex flex-row gap-2 text-sm">
      {links.map(({ label, url }, index) => {
        const showSeparator = index > 0 && index < links.length

        return (
          <Fragment key={label}>
            {showSeparator && <span>/</span>}
            <a
              className="underline underline-offset-4"
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
