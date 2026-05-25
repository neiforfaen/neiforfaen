const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080"

const TOKEN_KEY = "finance_access_token"

export function getToken(): string | null {
	return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
	localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
	localStorage.removeItem(TOKEN_KEY)
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
	const token = getToken()
	const res = await fetch(`${BASE_URL}${path}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...options.headers,
		},
	})
	if (!res.ok) {
		const err = await res.json().catch(() => ({ message: res.statusText }))
		throw new Error((err as { message?: string }).message ?? res.statusText)
	}
	return res.json() as Promise<T>
}

export const api = {
	get: <T>(path: string) => request<T>(path),
	post: <T>(path: string, body: unknown) =>
		request<T>(path, { method: "POST", body: JSON.stringify(body) }),
	delete: (path: string) => request<void>(path, { method: "DELETE" }),
}
