import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import { UIProvider } from "@neiforfaen/ui"
import { App } from "./App.tsx"

// biome-ignore lint/style/noNonNullAssertion: Element guaranteed to exist.
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<UIProvider>
			<App />
		</UIProvider>
	</StrictMode>,
)
