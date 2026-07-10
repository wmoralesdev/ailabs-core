import { useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type HomeRevealProps = {
  children: ReactNode
  className?: string
}

function HomeReveal({ children, className }: HomeRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  // Fail open: visible for SSR / no-JS / before the observer runs. Only hide
  // below-the-fold sections after mount when motion is allowed.
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const node = ref.current
    if (!node) {
      return
    }

    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (media.matches) {
      setVisible(true)
      return
    }

    const rect = node.getBoundingClientRect()
    const inView = rect.top < window.innerHeight && rect.bottom > 0
    if (inView) {
      setVisible(true)
      return
    }

    setVisible(false)

    // Any intersecting pixel is enough. A ratio threshold (e.g. 0.12) can never
    // be met for tall sections on short viewports, leaving opacity-0 forever.
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0, rootMargin: "0px 0px -4% 0px" }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn(
        "motion-safe:transition-[opacity,transform] motion-safe:duration-700 motion-safe:ease-out",
        visible
          ? "translate-y-0 opacity-100"
          : "motion-safe:translate-y-4 motion-safe:opacity-0",
        className
      )}
    >
      {children}
    </div>
  )
}

export { HomeReveal }
