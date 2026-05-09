import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "@neiforfaen/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { App } from "./App.tsx"

// biome-ignore lint/style/noNonNullAssertion: Element guaranteed to exist.
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ThemeProvider>
			<App />
		</ThemeProvider>
	</StrictMode>,
)
