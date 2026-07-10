import { useEffect, useState } from "react"

/**
 * Tracks whether the window has scrolled past a small threshold.
 * SSR-safe: starts false and only reads scroll position in an effect.
 */
function useScrolled(threshold = 8): boolean {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > threshold)
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [threshold])

  return scrolled
}

export { useScrolled }
