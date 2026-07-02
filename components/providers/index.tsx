import type { ReactNode } from "react"

import { ThemeProvider } from "@/components/providers/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"

interface RootProvidersProps {
  children: ReactNode
}

export const RootProviders = ({ children }: RootProvidersProps) => (
  <ThemeProvider>
    <TooltipProvider>{children}</TooltipProvider>
  </ThemeProvider>
)
