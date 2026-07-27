import { createFileRoute } from "@tanstack/react-router"

import { Page } from "../components/page"

const Contact = () => (
  <Page header>
    <div>contact</div>
  </Page>
)

export const Route = createFileRoute("/contact")({
  component: Contact,
})
