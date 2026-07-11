import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

type HomeMediaCarouselProps = {
  images: ReadonlyArray<string>
  alt: string
  intervalMs?: number
  className?: string
  imgClassName?: string
}

const DEFAULT_INTERVAL_MS = 5000
const TRANSITION_MS = 600

function HomeMediaCarousel({
  images,
  alt,
  intervalMs = DEFAULT_INTERVAL_MS,
  className,
  imgClassName,
}: HomeMediaCarouselProps) {
  const [index, setIndex] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [instant, setInstant] = useState(false)

  // Clone first slide at the end so last→first can scroll forward, then snap.
  const trackImages =
    images.length > 1 ? [...images, images[0]!] : [...images]
  const logicalCount = images.length

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

  // After landing on the clone, snap back to the real first slide with no motion.
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

  if (images.length === 0) {
    return null
  }

  const animate = !reducedMotion && !instant
  const displayIndex = index === logicalCount ? 0 : index

  return (
    <div
      className={cn("absolute inset-0 z-1 overflow-hidden", className)}
      aria-roledescription="carousel"
      aria-label={alt}
    >
      <div
        className={cn(
          "flex h-full",
          animate && "transition-transform ease-in-out"
        )}
        style={{
          width: `${trackImages.length * 100}%`,
          transform: `translate3d(-${(index / trackImages.length) * 100}%, 0, 0)`,
          transitionDuration: animate ? `${TRANSITION_MS}ms` : "0ms",
        }}
      >
        {trackImages.map((src, slideIndex) => (
          <div
            key={`${src}-${slideIndex}`}
            className="relative h-full shrink-0"
            style={{ width: `${100 / trackImages.length}%` }}
            aria-hidden={slideIndex !== displayIndex}
          >
            <img
              src={src}
              alt={slideIndex === displayIndex ? alt : ""}
              className={cn(
                "absolute inset-0 size-full object-cover",
                imgClassName
              )}
              draggable={false}
            />
          </div>
        ))}
      </div>

      {logicalCount > 1 ? (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-3 z-2 flex items-center justify-center gap-1.5"
          role="tablist"
          aria-label="Slide indicators"
        >
          {images.map((src, slideIndex) => (
            <span
              key={src}
              role="tab"
              aria-current={slideIndex === displayIndex ? "true" : undefined}
              aria-label={`Slide ${slideIndex + 1} of ${logicalCount}`}
              className={cn(
                "h-1.5 rounded-full",
                slideIndex === displayIndex
                  ? "w-4 bg-on-dark"
                  : "w-1.5 bg-on-dark/40"
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

export { HomeMediaCarousel }
