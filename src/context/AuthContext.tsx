import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react"
import { api, ApiError } from "@/services/api"

export interface User {
  id: number
  name: string
  email: string
  phone?: string | null
  createdAt?: string
  email_verified_at?: string | null
  role?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  pending2FA: boolean
  tempToken: string | null
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; twoFactorRequired?: boolean }>
  signup: (name: string, email: string, password: string, phone: string) => Promise<{ success: boolean; error?: string; errors?: Record<string, string[]> }>
  logout: () => Promise<void>
  verifyEmail: (url: string) => Promise<{ success: boolean; error?: string }>
  resendVerificationEmail: () => Promise<{ success: boolean; error?: string; retryAfter?: number }>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_KEY = "sanctum_token"
const USER_KEY = "local_user"
const TEMP_TOKEN_KEY = "sanctum_temp_token"

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null
    const userRaw = typeof window !== "undefined" ? localStorage.getItem(USER_KEY) : null
    const user = userRaw ? JSON.parse(userRaw) : null
    return { user, token, isLoading: false, pending2FA: false, tempToken: null }
  })

  // Session restoration on mount
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) return

    api
      .get<{ user?: User; data?: User }>("/me")
      .then((res) => {
        const user = res.user ?? res.data ?? (res as unknown as User)
        setState((s) => ({ ...s, user, isLoading: false }))
        localStorage.setItem(USER_KEY, JSON.stringify(user))
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
        setState((s) => ({ ...s, user: null, token: null, isLoading: false }))
      })
  }, [])

  // Listen for 401 events from API client
  useEffect(() => {
    const handleUnauthorized = () => {
      setState({ user: null, token: null, isLoading: false, pending2FA: false, tempToken: null })
    }
    window.addEventListener("auth:unauthorized", handleUnauthorized)
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized)
  }, [])

  const login = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string; twoFactorRequired?: boolean }> => {
      setState((s) => ({ ...s, isLoading: true }))
      try {
        const res = await api.post<{
          user?: User
          access_token?: string
          two_factor_required?: boolean
          temp_token?: string
          message?: string
        }>("/login", { email, password })

        if (res.two_factor_required && res.temp_token) {
          localStorage.setItem(TEMP_TOKEN_KEY, res.temp_token)
          setState((s) => ({
            ...s,
            isLoading: false,
            pending2FA: true,
            tempToken: res.temp_token!,
          }))
          return { success: true, twoFactorRequired: true }
        }

        if (res.access_token && res.user) {
          localStorage.setItem(TOKEN_KEY, res.access_token)
          localStorage.setItem(USER_KEY, JSON.stringify(res.user))
          setState((s) => ({
            ...s,
            user: res.user!,
            token: res.access_token!,
            isLoading: false,
            pending2FA: false,
            tempToken: null,
          }))
          return { success: true }
        }

        setState((s) => ({ ...s, isLoading: false }))
        return { success: false, error: res.message || "Login failed." }
      } catch (err) {
        setState((s) => ({ ...s, isLoading: false }))
        if (err instanceof ApiError) {
          return { success: false, error: err.message }
        }
        return { success: false, error: "Network error. Please try again." }
      }
    },
    []
  )

  const signup = useCallback(
    async (name: string, email: string, password: string, phone: string): Promise<{ success: boolean; error?: string; errors?: Record<string, string[]> }> => {
      setState((s) => ({ ...s, isLoading: true }))
      try {
        const res = await api.post<{ user: User; access_token: string }>("/register", {
          name,
          email,
          password,
          phone,
        })

        if (res.access_token && res.user) {
          localStorage.setItem(TOKEN_KEY, res.access_token)
          localStorage.setItem(USER_KEY, JSON.stringify(res.user))
          setState((s) => ({
            ...s,
            user: res.user,
            token: res.access_token,
            isLoading: false,
          }))
          return { success: true }
        }

        setState((s) => ({ ...s, isLoading: false }))
        return { success: false, error: "Registration failed." }
      } catch (err) {
        setState((s) => ({ ...s, isLoading: false }))
        if (err instanceof ApiError) {
          return { success: false, error: err.message, errors: err.errors }
        }
        return { success: false, error: "Network error. Please try again." }
      }
    },
    []
  )

  const logout = useCallback(async () => {
    try {
      await api.post("/logout")
    } catch {
      // Ignore errors on logout
    }
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(TEMP_TOKEN_KEY)
    setState({ user: null, token: null, isLoading: false, pending2FA: false, tempToken: null })
  }, [])

  const verifyEmail = useCallback(async (url: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // The backend email verification is a GET with a signed URL
      await api.get(url)
      // Refresh user data to get updated email_verified_at
      const me = await api.get<{ user?: User; data?: User }>("/me")
      const user = me.user ?? me.data ?? (me as unknown as User)
      localStorage.setItem(USER_KEY, JSON.stringify(user))
      setState((s) => ({ ...s, user }))
      return { success: true }
    } catch (err) {
      if (err instanceof ApiError) {
        return { success: false, error: err.message }
      }
      return { success: false, error: "Verification failed." }
    }
  }, [])

  const resendVerificationEmail = useCallback(async (): Promise<{ success: boolean; error?: string; retryAfter?: number }> => {
    try {
      await api.post("/email/resend")
      return { success: true }
    } catch (err) {
      if (err instanceof ApiError) {
        return { success: false, error: err.message, retryAfter: err.retryAfter }
      }
      return { success: false, error: "Failed to resend verification email." }
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
        verifyEmail,
        resendVerificationEmail,
        isAuthenticated: !!state.user && !!state.token,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
