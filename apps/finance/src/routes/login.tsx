import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { api, setToken } from "@/lib/api"

export function LoginRoute() {
	const navigate = useNavigate()
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState("")

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setError("")
		try {
			const res = await api.post<{ access_token: string }>(
				"/api/v1/auth/login",
				{
					email,
					password,
				},
			)
			setToken(res.access_token)
			navigate("/")
		} catch (err) {
			setError(err instanceof Error ? err.message : "Login failed")
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<input
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				placeholder="Email"
				required
			/>
			<input
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				placeholder="Password"
				required
			/>
			{error && <p>{error}</p>}
			<button type="submit">Login</button>
		</form>
	)
}
