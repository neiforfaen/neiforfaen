import { createFileRoute } from "@tanstack/react-router"

const About = () => <div>about</div>

export const Route = createFileRoute("/about")({
  component: About,
})
