import { createFileRoute } from "@tanstack/react-router"

import { Intro } from "../components/home/intro"
import { Meta } from "../components/home/meta"
import { Page } from "../components/page"

const Index = () => (
  <Page>
    <div className="h-full flex flex-col justify-between">
      <Intro />
      <Meta />
    </div>
  </Page>
)

export const Route = createFileRoute("/")({
  component: Index,
})
