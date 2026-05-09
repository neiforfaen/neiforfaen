import { About } from "./components/about"
import { Footer } from "./components/footer"
import { Header } from "./components/header"
import { Projects } from "./components/projects"
import { Work } from "./components/work"

export function App() {
	return (
		<main className="animate-[fadeBlur_1.5s_ease-in-out_forwards] relative z-10 mx-auto grid w-full max-w-2xl gap-16 sm:gap-24 px-4 py-16 sm:py-32">
			<Header />
			<About />
			<Work />
			<Projects />
			<Footer />
		</main>
	)
}
