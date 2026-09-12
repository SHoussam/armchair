import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/context/AuthContext"
import { useCart } from "@/context/CartContext"
import { api, ApiError } from "@/services/api"
import {
  LogIn,
  UserPlus,
  Mail,
  Lock,
  User,
  Phone,
  X,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  Copy,
  CheckCircle2,
} from "lucide-react"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialTab?: "login" | "signup"
}

type AuthView = "login" | "signup" | "forgot" | "forgot-sent" | "reset" | "reset-success" | "2fa-challenge"

export default function AuthModal({ isOpen, onClose, initialTab = "login" }: AuthModalProps) {
  const { login, signup, isLoading, pending2FA, tempToken } = useAuth()
  const { showToast } = useCart()
  const [view, setView] = useState<AuthView>(initialTab)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  // Login fields
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Signup fields
  const [signupName, setSignupName] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPhone, setSignupPhone] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [signupConfirm, setSignupConfirm] = useState("")

  // Forgot password fields
  const [forgotEmail, setForgotEmail] = useState("")
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotRetryAfter, setForgotRetryAfter] = useState(0)

  // Reset password fields
  const [resetToken, setResetToken] = useState("")
  const [resetEmail, setResetEmail] = useState("")
  const [resetPassword, setResetPassword] = useState("")
  const [resetConfirm, setResetConfirm] = useState("")
  const [resetLoading, setResetLoading] = useState(false)

  // 2FA fields
  const [twoFACode, setTwoFACode] = useState("")
  const [twoFALoading, setTwoFALoading] = useState(false)
  const [twoFAUseRecovery, setTwoFAUseRecovery] = useState(false)

  // Parse URL params for password reset on mount
  useEffect(() => {
    if (isOpen && window.location.pathname === "/reset-password") {
      const params = new URLSearchParams(window.location.search)
      const tokenParam = params.get("token")
      const emailParam = params.get("email")
      if (tokenParam && emailParam) {
        setResetToken(tokenParam)
        setResetEmail(emailParam)
        setView("reset")
      }
    }
  }, [isOpen])

  // Countdown timer for forgot password rate limit
  useEffect(() => {
    if (forgotRetryAfter <= 0) return
    const timer = setInterval(() => {
      setForgotRetryAfter((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [forgotRetryAfter])

  // Check if we need to show 2FA challenge
  useEffect(() => {
    if (pending2FA && isOpen) {
      setView("2fa-challenge")
      setTwoFACode("")
      setTwoFAUseRecovery(false)
    }
  }, [pending2FA, isOpen])

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement
      setError("")
      setShowPassword(false)
      setLoginEmail("")
      setLoginPassword("")
      setSignupName("")
      setSignupEmail("")
      setSignupPhone("")
      setSignupPassword("")
      setSignupConfirm("")
      setForgotEmail("")
      setForgotLoading(false)
      setForgotRetryAfter(0)
      setTwoFACode("")
      setTwoFALoading(false)
      setTwoFAUseRecovery(false)
      if (!pending2FA) {
        setView(initialTab)
      }
      document.body.style.overflow = "hidden"
      setTimeout(() => {
        const firstInput = modalRef.current?.querySelector(
          'input, button, [tabindex]:not([tabindex="-1"])'
        ) as HTMLElement | null
        firstInput?.focus()
      }, 50)
    } else {
      document.body.style.overflow = ""
      if (previousFocusRef.current) previousFocusRef.current.focus()
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  useEffect(() => {
    if (!pending2FA) setView(initialTab)
  }, [initialTab, pending2FA])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) handleClose()
      if (e.key === "Tab" && isOpen && modalRef.current) {
        const focusables = Array.from(
          modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ) as HTMLElement[]
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
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
      if (result.twoFactorRequired) {
        setView("2fa-challenge")
      } else {
        showToast("Welcome back! You are now logged in.")
        handleClose()
      }
    } else {
      setError(result.error || "Login failed.")
    }
  }

  const validatePasswordRules = (pwd: string): string | null => {
    if (pwd.length < 8) {
      return "Password must be at least 8 characters."
    }
    if (!/[A-Z]/.test(pwd)) {
      return "Password must contain at least one uppercase letter (A-Z)."
    }
    if (!/[0-9]/.test(pwd)) {
      return "Password must contain at least one number (0-9)."
    }
    if (!/[@$!%*#?&]/.test(pwd)) {
      return "Password must contain at least one special character (@$!%*#?&)."
    }
    return null
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      setError("Please fill in all required fields.")
      return
    }

    const pwdError = validatePasswordRules(signupPassword)
    if (pwdError) {
      setError(pwdError)
      return
    }

    if (signupPassword !== signupConfirm) {
      setError("Passwords do not match.")
      return
    }

    const result = await signup(
      signupName.trim(),
      signupEmail.trim(),
      signupPassword,
      signupPhone.trim()
    )
    if (result.success) {
      showToast("Account created successfully! Welcome to مفروشات عبد اللطيف.")
      handleClose()
    } else {
      const fieldError = result.errors
        ? (Object.values(result.errors).flat()[0] as string | undefined)
        : undefined
      setError(fieldError || result.error || "Registration failed.")
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setForgotLoading(true)

    try {
      await api.post("/password/forgot", { email: forgotEmail })
      setView("forgot-sent")
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 429 && err.retryAfter) {
          setForgotRetryAfter(err.retryAfter)
          setError(`Too many requests. Please wait ${err.retryAfter} seconds.`)
        } else {
          setError(err.message)
        }
      } else {
        setError("Failed to send reset email.")
      }
    } finally {
      setForgotLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const pwdError = validatePasswordRules(resetPassword)
    if (pwdError) {
      setError(pwdError)
      return
    }

    if (resetPassword !== resetConfirm) {
      setError("Passwords do not match.")
      return
    }

    setResetLoading(true)
    try {
      await api.post("/password/reset", {
        token: resetToken,
        email: resetEmail,
        password: resetPassword,
        password_confirmation: resetConfirm,
      })
      setView("reset-success")
    } catch (err) {
      if (err instanceof ApiError) {
        const fieldError = err.errors
          ? (Object.values(err.errors).flat()[0] as string | undefined)
          : undefined
        setError(fieldError || err.message)
      } else {
        setError("Failed to reset password.")
      }
    } finally {
      setResetLoading(false)
    }
  }

  const handle2FAChallenge = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setTwoFALoading(true)

    try {
      const payload: { code: string; use_recovery_code?: boolean } = { code: twoFACode }
      if (twoFAUseRecovery) {
        payload.use_recovery_code = true
      }

      // Use temp_token for 2FA challenge
      const data = await api.post<{ access_token: string; user: { id: number; name: string; email: string } }>(
        "/2fa/challenge",
        payload
      )

      if (data.access_token && data.user) {
        localStorage.removeItem("sanctum_temp_token")
        localStorage.setItem("sanctum_token", data.access_token)
        localStorage.setItem("local_user", JSON.stringify(data.user))
        showToast("Two-factor authentication verified!")
        handleClose()
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError("Verification failed.")
      }
    } finally {
      setTwoFALoading(false)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) handleClose()
  }

  const [closing, setClosing] = useState(false)

  const handleClose = () => {
    setClosing(true)
    setTimeout(() => {
      setClosing(false)
      onClose()
    }, 250)
  }

  if (!isOpen && !closing) return null

  return (
    <div
      className={`auth-overlay ${closing ? "closing" : ""}`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Authentication"
    >
      <div className={`auth-modal ${closing ? "closing" : ""}`} ref={modalRef}>
        <button className="auth-close" onClick={handleClose} aria-label="Close">
          <X size={18} />
        </button>

        <div className="auth-header">
          <div className="auth-brand-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <h2 className="auth-title">
            {view === "login" && "Welcome Back"}
            {view === "signup" && "Create Account"}
            {view === "forgot" && "Reset Password"}
            {view === "forgot-sent" && "Check Your Email"}
            {view === "reset" && "Set New Password"}
            {view === "reset-success" && "Password Reset!"}
            {view === "2fa-challenge" && "Two-Factor Authentication"}
          </h2>
          <p className="auth-subtitle">
            {view === "login" && "Sign in to track orders and manage your account"}
            {view === "signup" && "Join Abdelatif Furnishings for order tracking and more"}
            {view === "forgot" && "Enter your email to receive a password reset link"}
            {view === "forgot-sent" &&
              "If an account exists with that email, we've sent a password reset link."}
            {view === "reset" && "Enter your new password below"}
            {view === "reset-success" && "Your password has been reset successfully."}
            {view === "2fa-challenge" && "Enter the 6-digit code from your authenticator app"}
          </p>
        </div>

        {/* Tabs — only show on login/signup views */}
        {(view === "login" || view === "signup") && (
          <div className="auth-tabs">
            <button
              className={`auth-tab ${view === "login" ? "active" : ""}`}
              onClick={() => {
                setView("login")
                setError("")
              }}
            >
              <LogIn size={15} />
              Sign In
            </button>
            <button
              className={`auth-tab ${view === "signup" ? "active" : ""}`}
              onClick={() => {
                setView("signup")
                setError("")
              }}
            >
              <UserPlus size={15} />
              Register
            </button>
          </div>
        )}

        {error && (
          <div id="auth-error" className="auth-error" role="alert" aria-live="polite">
            {error}
          </div>
        )}

        {/* ── Login Form ── */}
        {view === "login" && (
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
                  aria-describedby={error ? "auth-error" : undefined}
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

            <button
              type="button"
              className="auth-link-btn"
              style={{ alignSelf: "flex-start", marginBottom: "0.5rem", fontSize: "0.85rem" }}
              onClick={() => {
                setView("forgot")
                setError("")
              }}
            >
              Forgot Password?
            </button>

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
        )}

        {/* ── Signup Form ── */}
        {view === "signup" && (
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

            <p className="auth-field-hint" style={{ fontSize: "12px", color: "var(--color-muted, #71717a)", margin: "-0.5rem 0 1rem", lineHeight: "1.4" }}>
              Password must be 8+ characters and contain at least one uppercase letter (A-Z), one number (0-9), and one symbol (@$!%*#?&).
            </p>

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

        {/* ── Forgot Password Form ── */}
        {view === "forgot" && (
          <form onSubmit={handleForgotPassword} className="auth-form">
            <div className="auth-field">
              <label htmlFor="forgot-email">Email</label>
              <div className="auth-input-wrap">
                <Mail size={16} className="auth-input-icon" />
                <input
                  id="forgot-email"
                  type="email"
                  placeholder="you@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={forgotLoading || forgotRetryAfter > 0}
            >
              {forgotLoading ? (
                <span className="auth-spinner" />
              ) : forgotRetryAfter > 0 ? (
                `Wait ${forgotRetryAfter}s`
              ) : (
                <>
                  <Mail size={16} />
                  Send Reset Link
                </>
              )}
            </button>

            <button
              type="button"
              className="auth-link-btn"
              style={{ alignSelf: "center", marginTop: "0.5rem" }}
              onClick={() => {
                setView("login")
                setError("")
              }}
            >
              Back to Sign In
            </button>
          </form>
        )}

        {/* ── Forgot Password Sent ── */}
        {view === "forgot-sent" && (
          <div className="auth-form" style={{ textAlign: "center" }}>
            <CheckCircle2 size={48} style={{ color: "#22c55e", marginBottom: "1rem" }} />
            <p style={{ marginBottom: "1.5rem", color: "#666" }}>
              We've sent a password reset link to <strong>{forgotEmail}</strong>. Please check your
              inbox.
            </p>
            <button
              type="button"
              className="auth-submit"
              onClick={() => {
                setView("login")
                setError("")
              }}
            >
              <LogIn size={16} />
              Back to Sign In
            </button>
          </div>
        )}

        {/* ── Reset Password Form ── */}
        {view === "reset" && (
          <form onSubmit={handleResetPassword} className="auth-form">
            <div className="auth-field">
              <label htmlFor="reset-password">New Password</label>
              <div className="auth-input-wrap">
                <Lock size={16} className="auth-input-icon" />
                <input
                  id="reset-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 8 characters"
                  value={resetPassword}
                  onChange={(e) => setResetPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  minLength={8}
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="reset-confirm">Confirm Password</label>
              <div className="auth-input-wrap">
                <Lock size={16} className="auth-input-icon" />
                <input
                  id="reset-confirm"
                  type={showPassword ? "text" : "password"}
                  placeholder="Repeat password"
                  value={resetConfirm}
                  onChange={(e) => setResetConfirm(e.target.value)}
                  autoComplete="new-password"
                  required
                  minLength={8}
                />
              </div>
            </div>

            <p className="auth-field-hint" style={{ fontSize: "12px", color: "var(--color-muted, #71717a)", margin: "-0.5rem 0 1rem", lineHeight: "1.4" }}>
              Password must be 8+ characters and contain at least one uppercase letter (A-Z), one number (0-9), and one symbol (@$!%*#?&).
            </p>

            <button type="submit" className="auth-submit" disabled={resetLoading}>
              {resetLoading ? (
                <span className="auth-spinner" />
              ) : (
                <>
                  <KeyRound size={16} />
                  Reset Password
                </>
              )}
            </button>
          </form>
        )}

        {/* ── Reset Password Success ── */}
        {view === "reset-success" && (
          <div className="auth-form" style={{ textAlign: "center" }}>
            <CheckCircle2 size={48} style={{ color: "#22c55e", marginBottom: "1rem" }} />
            <p style={{ marginBottom: "1.5rem", color: "#666" }}>
              Your password has been reset successfully. You can now sign in with your new password.
            </p>
            <button
              type="button"
              className="auth-submit"
              onClick={() => {
                setView("login")
                setError("")
              }}
            >
              <LogIn size={16} />
              Sign In
            </button>
          </div>
        )}

        {/* ── 2FA Challenge ── */}
        {view === "2fa-challenge" && (
          <form onSubmit={handle2FAChallenge} className="auth-form">
            <div className="auth-field">
              <label htmlFor="2fa-code">
                {twoFAUseRecovery ? "Recovery Code" : "6-Digit Code"}
              </label>
              <div className="auth-input-wrap">
                <ShieldCheck size={16} className="auth-input-icon" />
                <input
                  id="2fa-code"
                  type="text"
                  placeholder={twoFAUseRecovery ? "XXXX-XXXX" : "000000"}
                  value={twoFACode}
                  onChange={(e) => setTwoFACode(e.target.value)}
                  autoComplete="one-time-code"
                  required
                  maxLength={12}
                  style={{
                    letterSpacing: twoFAUseRecovery ? "0.1em" : "0.5em",
                    fontFamily: "monospace",
                    fontSize: twoFAUseRecovery ? "1rem" : "1.5rem",
                  }}
                />
              </div>
            </div>

            <button type="submit" className="auth-submit" disabled={twoFALoading || twoFACode.length < 6}>
              {twoFALoading ? (
                <span className="auth-spinner" />
              ) : (
                <>
                  <ShieldCheck size={16} />
                  Verify
                </>
              )}
            </button>

            <button
              type="button"
              className="auth-link-btn"
              style={{ alignSelf: "center", marginTop: "0.5rem", fontSize: "0.85rem" }}
              onClick={() => {
                setTwoFAUseRecovery(!twoFAUseRecovery)
                setTwoFACode("")
                setError("")
              }}
            >
              {twoFAUseRecovery ? "Use authenticator code instead" : "Use a recovery code instead"}
            </button>
          </form>
        )}

        {/* Footer text — only on login/signup */}
        {(view === "login" || view === "signup") && (
          <p className="auth-footer-text">
            {view === "login" ? (
              <>
                New here?{" "}
                <button
                  className="auth-link-btn"
                  onClick={() => {
                    setView("signup")
                    setError("")
                  }}
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  className="auth-link-btn"
                  onClick={() => {
                    setView("login")
                    setError("")
                  }}
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        )}
      </div>
    </div>
  )
}
