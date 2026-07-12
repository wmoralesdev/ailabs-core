import { useEffect, useState } from "react"

/** Toggles once the viewport scrolls past the full-height hero. */
function useScrolledPastHero() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let ticking = false

    const update = () => {
      ticking = false
      setScrolled(window.scrollY >= window.innerHeight)
    }

    const onScroll = () => {
      if (ticking) {
        return
      }
      ticking = true
      window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  return scrolled
}

export { useScrolledPastHero }
