import type { ReactNode } from "react"
import { Toaster } from "../components/sonner"
import { TooltipProvider } from "../components/tooltip"
import { ThemeProvider } from "./theme-provider"

interface UIProviderProps {
	children: ReactNode
}

export const UIProvider = ({ children }: UIProviderProps) => {
	return (
		<ThemeProvider>
			<TooltipProvider>{children}</TooltipProvider>
			<Toaster />
		</ThemeProvider>
	)
}
