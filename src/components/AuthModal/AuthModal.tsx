"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { LogIn, UserPlus, Mail, Lock, User, Phone, X, Eye, EyeOff } from "lucide-react"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialTab?: "login" | "signup"
}

export default function AuthModal({ isOpen, onClose, initialTab = "login" }: AuthModalProps) {
  const { login, signup, isLoading } = useAuth()
  const [tab, setTab] = useState<"login" | "signup">(initialTab)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  const [signupName, setSignupName] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPhone, setSignupPhone] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [signupConfirm, setSignupConfirm] = useState("")

  useEffect(() => {
    if (isOpen) {
      setError("")
      setShowPassword(false)
      setLoginEmail("")
      setLoginPassword("")
      setSignupName("")
      setSignupEmail("")
      setSignupPhone("")
      setSignupPassword("")
      setSignupConfirm("")
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  useEffect(() => {
    setTab(initialTab)
  }, [initialTab])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [isOpen, onClose])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setError("Please fill in all fields.")
      return
    }

    const result = await login(loginEmail.trim(), loginPassword)
    if (result.success) {
      onClose()
    } else {
      setError(result.error || "Login failed.")
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      setError("Please fill in all required fields.")
      return
    }

    if (signupPassword.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }

    if (signupPassword !== signupConfirm) {
      setError("Passwords do not match.")
      return
    }

    const result = await signup(signupName.trim(), signupEmail.trim(), signupPassword, signupPhone.trim())
    if (result.success) {
      onClose()
    } else {
      setError(result.error || "Registration failed.")
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  if (!isOpen) return null

  return (
    <div className="auth-overlay" onClick={handleBackdropClick} role="dialog" aria-modal="true" aria-label="Authentication">
      <div className="auth-modal">
        <button className="auth-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div className="auth-header">
          <div className="auth-brand-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <h2 className="auth-title">
            {tab === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="auth-subtitle">
            {tab === "login"
              ? "Sign in to track orders and manage your account"
              : "Join Abdelatif Furnishings for order tracking and more"}
          </p>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${tab === "login" ? "active" : ""}`}
            onClick={() => { setTab("login"); setError("") }}
          >
            <LogIn size={15} />
            Sign In
          </button>
          <button
            className={`auth-tab ${tab === "signup" ? "active" : ""}`}
            onClick={() => { setTab("signup"); setError("") }}
          >
            <UserPlus size={15} />
            Register
          </button>
        </div>

        {error && <div className="auth-error">{error}</div>}

        {tab === "login" ? (
          <form onSubmit={handleLogin} className="auth-form">
            <div className="auth-field">
              <label htmlFor="login-email">Email</label>
              <div className="auth-input-wrap">
                <Mail size={16} className="auth-input-icon" />
                <input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="login-password">Password</label>
              <div className="auth-input-wrap">
                <Lock size={16} className="auth-input-icon" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-submit" disabled={isLoading}>
              {isLoading ? (
                <span className="auth-spinner" />
              ) : (
                <>
                  <LogIn size={16} />
                  Sign In
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="auth-form">
            <div className="auth-field">
              <label htmlFor="signup-name">Full Name *</label>
              <div className="auth-input-wrap">
                <User size={16} className="auth-input-icon" />
                <input
                  id="signup-name"
                  type="text"
                  placeholder="Your full name"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="signup-email">Email *</label>
              <div className="auth-input-wrap">
                <Mail size={16} className="auth-input-icon" />
                <input
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="signup-phone">Phone (optional)</label>
              <div className="auth-input-wrap">
                <Phone size={16} className="auth-input-icon" />
                <input
                  id="signup-phone"
                  type="tel"
                  placeholder="+212 600 000 000"
                  value={signupPhone}
                  onChange={(e) => setSignupPhone(e.target.value)}
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="auth-row-2">
              <div className="auth-field">
                <label htmlFor="signup-password">Password *</label>
                <div className="auth-input-wrap">
                  <Lock size={16} className="auth-input-icon" />
                  <input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 8 characters"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="signup-confirm">Confirm *</label>
                <div className="auth-input-wrap">
                  <Lock size={16} className="auth-input-icon" />
                  <input
                    id="signup-confirm"
                    type={showPassword ? "text" : "password"}
                    placeholder="Repeat password"
                    value={signupConfirm}
                    onChange={(e) => setSignupConfirm(e.target.value)}
                    autoComplete="new-password"
                    required
                    minLength={8}
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="auth-submit" disabled={isLoading}>
              {isLoading ? (
                <span className="auth-spinner" />
              ) : (
                <>
                  <UserPlus size={16} />
                  Create Account
                </>
              )}
            </button>
          </form>
        )}

        <p className="auth-footer-text">
          {tab === "login" ? (
            <>
              New here?{" "}
              <button className="auth-link-btn" onClick={() => { setTab("signup"); setError("") }}>
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button className="auth-link-btn" onClick={() => { setTab("login"); setError("") }}>
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
