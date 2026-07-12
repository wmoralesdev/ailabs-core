import { useEffect, useState } from "react"

const DEFAULT_INTERVAL_MS = 5000
const TRANSITION_MS = 600

type UseHomeMediaCarouselResult = {
  index: number
  instant: boolean
  reducedMotion: boolean
  animate: boolean
  displayIndex: number
  trackImages: ReadonlyArray<string>
  logicalCount: number
}

function useHomeMediaCarousel(
  images: ReadonlyArray<string>,
  intervalMs = DEFAULT_INTERVAL_MS
): UseHomeMediaCarouselResult {
  const [index, setIndex] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [instant, setInstant] = useState(false)

  const logicalCount = images.length
  const trackImages =
    logicalCount > 1 ? [...images, images[0] as string] : [...images]

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setReducedMotion(media.matches)
    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [])

  useEffect(() => {
    if (reducedMotion || logicalCount < 2) {
      return
    }

    const id = window.setInterval(() => {
      setIndex((current) => {
        if (current >= logicalCount) {
          return current
        }
        return current + 1
      })
    }, intervalMs)

    return () => window.clearInterval(id)
  }, [reducedMotion, logicalCount, intervalMs])

  useEffect(() => {
    if (index !== logicalCount || logicalCount < 2) {
      return
    }

    const id = window.setTimeout(
      () => {
        setInstant(true)
        setIndex(0)
      },
      reducedMotion ? 0 : TRANSITION_MS
    )

    return () => window.clearTimeout(id)
  }, [index, logicalCount, reducedMotion])

  useEffect(() => {
    if (!instant) {
      return
    }
    let inner = 0
    const outer = window.requestAnimationFrame(() => {
      inner = window.requestAnimationFrame(() => {
        setInstant(false)
      })
    })
    return () => {
      window.cancelAnimationFrame(outer)
      window.cancelAnimationFrame(inner)
    }
  }, [instant])

  const animate = !reducedMotion && !instant
  const displayIndex = index === logicalCount ? 0 : index

  return {
    index,
    instant,
    reducedMotion,
    animate,
    displayIndex,
    trackImages,
    logicalCount,
  }
}

export { useHomeMediaCarousel, DEFAULT_INTERVAL_MS, TRANSITION_MS }
export type { UseHomeMediaCarouselResult }
