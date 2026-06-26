import { Fragment } from "react"

import { cn } from "@/lib/utils"

const labels: Record<"label" | "url", string>[] = [
  { label: "kaiden", url: "" },
  { label: "0x424", url: "/" },
]

export const Header = () => (
  <header className="flex flex-row justify-between items-center max-w-sm pb-12">
    <div className="flex gap-2 text-sm">
      {labels.map(({ label, url }, index) => {
        const showSeparator = index > 0 && index < labels.length

        return (
          <Fragment key={label}>
            {showSeparator && <span>/</span>}
            {index === 0 ? (
              <span className="font-medium text-foreground/75">{label}</span>
            ) : (
              <a
                className="font-medium text-foreground/75 underline underline-offset-4"
                href={url}
              >
                {label}
              </a>
            )}
          </Fragment>
        )
      })}
    </div>
    <span className="text-xs flex items-center gap-2">
      looking for work
      <span className={cn("inline-flex h-3 w-3 relative", "bg-emerald-400/75")}>
        <span
          className={cn(
            "inline-flex h-3 w-3 animate-ping opacity-75",
            "bg-emerald-400"
          )}
        />
      </span>
    </span>
  </header>
)
