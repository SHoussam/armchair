import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react"

export interface User {
  id: number
  name: string
  email: string
  phone?: string | null
  createdAt?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (name: string, email: string, password: string, phone: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_KEY = "sanctum_token"
const USER_KEY = "local_user"

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null
    const userRaw = typeof window !== "undefined" ? localStorage.getItem(USER_KEY) : null
    const user = userRaw ? JSON.parse(userRaw) : null
    return { user, token, isLoading: false }
  })

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setState((s) => ({ ...s, isLoading: true }))

    const token = "local_dev_token_" + Date.now()
    const user: User = { id: 1, name: email.split("@")[0], email }
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    setState({ user, token, isLoading: false })
    return { success: true }
  }, [])

  const signup = useCallback(
    async (name: string, email: string, password: string, phone: string): Promise<{ success: boolean; error?: string }> => {
      setState((s) => ({ ...s, isLoading: true }))

      const token = "local_dev_token_" + Date.now()
      const user: User = { id: 1, name, email, phone }
      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(USER_KEY, JSON.stringify(user))
      setState({ user, token, isLoading: false })
      return { success: true }
    },
    []
  )

  const logout = useCallback(async () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setState({ user: null, token: null, isLoading: false })
  }, [])

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
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
