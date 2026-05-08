import type { ReactNode } from "react"
import { Toaster } from "./components/ui/sonner"
import { TooltipProvider } from "./components/ui/tooltip"

interface DesignSystemProviderProps {
	children: ReactNode
}

export const DesignSystemProvider = ({
	children,
}: DesignSystemProviderProps) => {
	return (
		<>
			<TooltipProvider>{children}</TooltipProvider>
			<Toaster />
		</>
	)
}
