import { useTheme } from "next-themes"
import { useCallback } from "react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme()

  const handleThemeToggle = useCallback(() => {
    setTheme(resolvedTheme === "light" ? "dark" : "light")
  }, [setTheme, resolvedTheme])

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button onClick={handleThemeToggle} className="-ml-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4.5"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
              <path d="M12 3l0 18"></path>
              <path d="M12 9l4.65 -4.65"></path>
              <path d="M12 14.3l7.37 -7.37"></path>
              <path d="M12 19.6l8.85 -8.85"></path>
            </svg>
            <span className="sr-only">theme toggle</span>
          </Button>
        }
      />
      <TooltipContent side="bottom" align="end">
        <p>
          click or press{" "}
          <kbd className="pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-none bg-muted px-1 font-sans text-xs font-medium text-muted-foreground select-none in-data-[slot=tooltip-content]:bg-background/20 in-data-[slot=tooltip-content]:text-background dark:in-data-[slot=tooltip-content]:bg-background/10 [&_svg:not([class*='size-'])]:size-3">
            d
          </kbd>{" "}
          to toggle theme
        </p>
      </TooltipContent>
    </Tooltip>
  )
}
