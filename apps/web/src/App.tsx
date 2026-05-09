import { About, Footer, Header, Project, Work } from "./components"

function App() {
	return (
		<main className="animate-[fadeBlur_1.5s_ease-in-out_forwards] relative z-10 mx-auto grid w-full max-w-2xl gap-16 sm:gap-24 px-4 py-16 sm:py-32">
			<Header />
			<About />
			<Work />
			<Project />
			<Footer />
		</main>
	)
}

export default App
