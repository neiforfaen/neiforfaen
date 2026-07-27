import { createFileRoute } from "@tanstack/react-router"

import { Page } from "../components/page"

const Projects = () => (
  <Page header>
    <div>projects</div>
  </Page>
)

export const Route = createFileRoute("/projects")({
  component: Projects,
})
