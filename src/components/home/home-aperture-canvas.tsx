"use client"

import { useEffect, useState } from "react"

import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect"

const APERTURE_DOT_COLORS = [
  [167, 139, 250],
  [196, 172, 246],
] as const

const APERTURE_DOT_OPACITIES = [
  0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1,
] as const

type HomeApertureCanvasProps = {
  active?: boolean
}

function HomeApertureCanvas({ active = true }: HomeApertureCanvasProps) {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    setEnabled(!media.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setEnabled(!event.matches)
    }

    media.addEventListener("change", handleChange)
    return () => media.removeEventListener("change", handleChange)
  }, [])

  if (!enabled || !active) {
    return null
  }

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
    >
      <CanvasRevealEffect
        animationSpeed={3}
        colors={APERTURE_DOT_COLORS.map((color) => [...color])}
        opacities={[...APERTURE_DOT_OPACITIES]}
        dotSize={2}
        showGradient={false}
        containerClassName="bg-transparent"
      />
    </div>
  )
}

export { HomeApertureCanvas }
