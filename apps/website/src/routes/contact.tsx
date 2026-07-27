import { createFileRoute } from "@tanstack/react-router"

const Contact = () => <div>contact</div>

export const Route = createFileRoute("/contact")({
  component: Contact,
})
