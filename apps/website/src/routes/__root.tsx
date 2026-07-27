import { Outlet, createRootRoute } from "@tanstack/react-router"

const RootComponent = () => (
  <main className="h-svh w-full">
    <Outlet />
  </main>
)

export const Route = createRootRoute({
  component: RootComponent,
})
