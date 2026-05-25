import { createBrowserRouter } from "react-router-dom"
import { AuthLayout } from "@/layouts/AuthLayout"
import { BudgetRoute } from "@/routes/budget"
import { DashboardRoute } from "@/routes/dashboard"
import { LoginRoute } from "@/routes/login"
import { NetWorthRoute } from "@/routes/net-worth"
import { SubscriptionsRoute } from "@/routes/subscriptions"

export const router = createBrowserRouter([
	{ path: "/login", element: <LoginRoute /> },
	{
		element: <AuthLayout />,
		children: [
			{ path: "/", element: <DashboardRoute /> },
			{ path: "/budget", element: <BudgetRoute /> },
			{ path: "/net-worth", element: <NetWorthRoute /> },
			{ path: "/subscriptions", element: <SubscriptionsRoute /> },
		],
	},
])
