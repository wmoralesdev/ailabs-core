import { useEffect, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Calendar03Icon,
  HandshakeIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons"

import type { HomeStat, HomeStatIcon } from "@/content"
import { cn } from "@/lib/utils"

const SLIDE_INTERVAL_MS = 4500
const SLIDE_TRANSITION_MS = 500

const SLIDE_ICONS: Record<HomeStatIcon, typeof UserGroupIcon> = {
  builders: UserGroupIcon,
  events: Calendar03Icon,
  partners: HandshakeIcon,
}

type SlidePhase = "center" | "exit"

type HomeHeroStatSlidesProps = {
  slides: ReadonlyArray<HomeStat>
  className?: string
}

function HomeHeroStatSlides({ slides, className }: HomeHeroStatSlidesProps) {
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<SlidePhase>("center")
  const [paused, setPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setReducedMotion(media.matches)
    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [])

  useEffect(() => {
    if (paused || reducedMotion || slides.length < 2) {
      return
    }

    const id = window.setInterval(() => {
      setPhase("exit")
    }, SLIDE_INTERVAL_MS)

    return () => window.clearInterval(id)
  }, [paused, reducedMotion, slides.length])

  useEffect(() => {
    if (phase !== "exit" || reducedMotion) {
      return
    }

    const id = window.setTimeout(() => {
      setIndex((current) => (current + 1) % slides.length)
      setPhase("center")
    }, SLIDE_TRANSITION_MS)

    return () => window.clearTimeout(id)
  }, [phase, reducedMotion, slides.length])

  const slide = slides[index]
  if (!slide) {
    return null
  }

  const motionClassName = reducedMotion
    ? "opacity-100"
    : phase === "exit"
      ? "transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] -translate-y-2 opacity-0"
      : "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500"

  const SlideIcon = slide.icon ? SLIDE_ICONS[slide.icon] : null

  return (
    <div
      key={index}
      className={cn(
        "mx-auto flex w-full max-w-xs items-center gap-4 rounded-3xl border border-border/60 bg-card/95 p-5 shadow-elevated backdrop-blur-sm",
        motionClassName,
        className
      )}
      aria-live="polite"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false)
        }
      }}
    >
      <div
        className="border-purple relative flex size-18 shrink-0 items-center justify-center rounded-full border-4"
        aria-hidden
      >
        {SlideIcon ? (
          <HugeiconsIcon
            icon={SlideIcon}
            className="text-purple size-8"
            strokeWidth={2}
          />
        ) : null}
      </div>
      <div>
        <p className="font-display text-foreground text-2xl font-semibold tracking-tight">
          {slide.value}
        </p>
        <p className="text-muted-foreground text-sm">{slide.label}</p>
      </div>
    </div>
  )
}

export { HomeHeroStatSlides }
export type { HomeHeroStatSlidesProps }
