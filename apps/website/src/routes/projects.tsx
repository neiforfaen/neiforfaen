import { createFileRoute } from "@tanstack/react-router"

const Projects = () => <div>projects</div>

export const Route = createFileRoute("/projects")({
  component: Projects,
})
