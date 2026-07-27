import { createFileRoute } from "@tanstack/react-router"

import { Page } from "../components/page"

const About = () => (
  <Page header>
    <div>about</div>
  </Page>
)

export const Route = createFileRoute("/about")({
  component: About,
})
