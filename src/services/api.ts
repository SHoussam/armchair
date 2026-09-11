export class ApiError extends Error {
  status: number
  message: string
  errors?: Record<string, string[]>
  retryAfter?: number

  constructor(status: number, message: string, errors?: Record<string, string[]>, retryAfter?: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.message = message
    this.errors = errors
    this.retryAfter = retryAfter
  }
}

const BASE_URL = import.meta.env.VITE_API_URL || "/api"

function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("sanctum_token") || localStorage.getItem("sanctum_temp_token")
}

function clearAuth(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("sanctum_token")
  localStorage.removeItem("sanctum_temp_token")
  localStorage.removeItem("local_user")
  window.dispatchEvent(new CustomEvent("auth:unauthorized"))
}

async function request<T>(method: string, path: string, body?: unknown, isFormData = false): Promise<T> {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`
  const headers: Record<string, string> = {
    Accept: "application/json",
  }

  const token = getToken()
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const init: RequestInit = { method, headers }

  if (body) {
    if (isFormData) {
      init.body = body as FormData
    } else {
      headers["Content-Type"] = "application/json"
      init.body = JSON.stringify(body)
    }
  }

  const res = await fetch(url, init)

  if (res.status === 401) {
    clearAuth()
    throw new ApiError(401, "Your session has expired. Please log in again.")
  }

  if (res.status === 429) {
    const retryAfter = parseInt(res.headers.get("Retry-After") || "60", 10)
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("api:ratelimited", { detail: { retryAfter } })
      )
    }
    throw new ApiError(429, `Too many requests. Please wait ${retryAfter} seconds.`, undefined, retryAfter)
  }

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const message = data?.message || `Request failed with status ${res.status}`
    const errors = data?.errors
    throw new ApiError(res.status, message, errors)
  }

  return data as T
}

export const api = {
  get<T>(path: string): Promise<T> {
    return request<T>("GET", path)
  },

  post<T>(path: string, body?: unknown): Promise<T> {
    return request<T>("POST", path, body)
  },

  put<T>(path: string, body?: unknown): Promise<T> {
    return request<T>("PUT", path, body)
  },

  delete<T>(path: string): Promise<T> {
    return request<T>("DELETE", path)
  },

  postForm<T>(path: string, formData: FormData): Promise<T> {
    return request<T>("POST", path, formData, true)
  },
}
