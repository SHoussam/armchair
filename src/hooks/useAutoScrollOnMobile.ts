import { useEffect, useRef } from "react"

/**
 * useAutoScrollOnMobile
 * Automatically scrolls horizontal carousels on phone/mobile screens (<= 767px).
 * Pauses when the user is actively touching/dragging and resumes after touch release.
 * Loop back to the start when reaching the end.
 * Desktop is 100% unaffected.
 */
export function useAutoScrollOnMobile<T extends HTMLElement = HTMLDivElement>(intervalMs: number = 3600) {
  const containerRef = useRef<T | null>(null)
  const isTouchingRef = useRef(false)
  const touchPauseTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const isMobile = () => typeof window !== "undefined" && window.innerWidth <= 767

    const handleTouchStart = () => {
      isTouchingRef.current = true
      if (touchPauseTimeoutRef.current) {
        clearTimeout(touchPauseTimeoutRef.current)
      }
    }

    const handleTouchEnd = () => {
      // Resume auto-scroll 2.5 seconds after the user releases touch
      touchPauseTimeoutRef.current = setTimeout(() => {
        isTouchingRef.current = false
      }, 2500)
    }

    el.addEventListener("touchstart", handleTouchStart, { passive: true })
    el.addEventListener("touchend", handleTouchEnd, { passive: true })
    el.addEventListener("mouseenter", handleTouchStart)
    el.addEventListener("mouseleave", handleTouchEnd)

    const timer = setInterval(() => {
      if (!isMobile() || !el || isTouchingRef.current) return

      // Measure child card width + gap, or fallback to 75% of clientWidth
      const firstChild = el.firstElementChild as HTMLElement | null
      const scrollStep = firstChild ? firstChild.offsetWidth + 12 : el.clientWidth * 0.75

      const maxScrollLeft = el.scrollWidth - el.clientWidth
      if (maxScrollLeft <= 10) return

      // If at or near the end, loop smoothly back to start
      if (el.scrollLeft + scrollStep >= maxScrollLeft - 8) {
        el.scrollTo({ left: 0, behavior: "smooth" })
      } else {
        el.scrollBy({ left: scrollStep, behavior: "smooth" })
      }
    }, intervalMs)

    return () => {
      clearInterval(timer)
      if (touchPauseTimeoutRef.current) {
        clearTimeout(touchPauseTimeoutRef.current)
      }
      el.removeEventListener("touchstart", handleTouchStart)
      el.removeEventListener("touchend", handleTouchEnd)
      el.removeEventListener("mouseenter", handleTouchStart)
      el.removeEventListener("mouseleave", handleTouchEnd)
    }
  }, [intervalMs])

  return containerRef
}

