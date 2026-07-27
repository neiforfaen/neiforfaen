import { Outlet, createRootRoute } from "@tanstack/react-router"

import { Nav } from "../components/nav"

const RootComponent = () => (
  <>
    <Nav />
    <main className="h-svh w-full">
      <Outlet />
    </main>
  </>
)

export const Route = createRootRoute({
  component: RootComponent,
})
