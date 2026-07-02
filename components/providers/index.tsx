import type { ReactNode } from "react"

import { CursorProvider } from "@/components/providers/cursor"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"

interface RootProvidersProps {
  children: ReactNode
}

export const RootProviders = ({ children }: RootProvidersProps) => (
  <ThemeProvider>
    <TooltipProvider>
      <CursorProvider>{children}</CursorProvider>
    </TooltipProvider>
  </ThemeProvider>
)
