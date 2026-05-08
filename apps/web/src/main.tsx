import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { DesignSystemProvider } from "@neiforfaen/design-system"
import App from "./App"

// biome-ignore lint/style/noNonNullAssertion: Element guaranteed to exist.
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<DesignSystemProvider>
			<App />
		</DesignSystemProvider>
	</StrictMode>,
)
