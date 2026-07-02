import type { ReactNode } from "react"

import { TooltipProvider } from "../ui/tooltip"
import { ThemeProvider } from "./theme-provider"

interface RootProvidersProps {
  children: ReactNode
}

export const RootProviders = ({ children }: RootProvidersProps) => (
  <ThemeProvider>
    <TooltipProvider>{children}</TooltipProvider>
  </ThemeProvider>
)
