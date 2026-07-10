import { useEffect, useState } from "react"
import { Link } from "@tanstack/react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"

import type {
  ChromeContent,
  HomeHeroContent,
  HomeStat,
  Locale,
  MicrocopyContent,
} from "@/content"
import { LOCALES } from "@/content"
import { SiteLogo } from "@/components/chrome/site-logo"
import { ThemeToggle } from "@/components/chrome/theme-toggle"
import { HomeHeroStipple } from "@/components/home/home-hero-stipple"
import { buttonVariants } from "@/components/ui/button"
import { routeForPillar } from "@/lib/locale-links"
import { cn } from "@/lib/utils"
import {
  homeCardClassName,
  homeDisplayClassName,
  homeLabelClassName,
  homePillClassName,
  homePillOutlineClassName,
  homeShellClassName,
} from "@/components/home/home-styles"

type HomeHeroProps = {
  locale: Locale
  hero: HomeHeroContent
  chrome: ChromeContent
  microcopy: MicrocopyContent
}

const SLIDE_INTERVAL_MS = 4500
const SLIDE_TRANSITION_MS = 400

const heroNavLinkClassName =
  "text-on-dark/85 hover:text-on-dark text-sm font-medium underline decoration-transparent decoration-2 underline-offset-8 hover:decoration-purple-soft motion-safe:transition-[color,text-decoration-color] motion-safe:duration-150 focus-visible:ring-ring/50 rounded-sm focus-visible:ring-2 focus-visible:outline-none"

type SlidePhase = "enter" | "center" | "exit"

function HomeHeroStatSlides({ slides }: { slides: ReadonlyArray<HomeStat> }) {
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
      setPhase("enter")
    }, SLIDE_TRANSITION_MS)

    return () => window.clearTimeout(id)
  }, [phase, reducedMotion, slides.length])

  useEffect(() => {
    if (phase !== "enter" || reducedMotion) {
      return
    }

    let inner = 0
    const outer = window.requestAnimationFrame(() => {
      inner = window.requestAnimationFrame(() => {
        setPhase("center")
      })
    })
    return () => {
      window.cancelAnimationFrame(outer)
      window.cancelAnimationFrame(inner)
    }
  }, [phase, reducedMotion, index])

  const slide = slides[index]
  if (!slide) {
    return null
  }

  const motionClassName = reducedMotion
    ? "opacity-100"
    : cn(
        "transition-[transform,opacity] duration-400 ease-out",
        phase === "enter" && "translate-x-8 opacity-0",
        phase === "center" && "translate-x-0 opacity-100",
        phase === "exit" && "-translate-x-8 opacity-0"
      )

  return (
    <div
      className="mx-auto w-full max-w-xs rounded-3xl border border-border/60 bg-card/95 p-5 shadow-elevated backdrop-blur-sm"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false)
        }
      }}
    >
      <div className="overflow-hidden">
        <div
          key={index}
          className={cn("flex items-center gap-4", motionClassName)}
          aria-live="polite"
        >
          <div
            className="border-purple relative size-18 shrink-0 rounded-full border-4 border-t-transparent"
            aria-hidden
          />
          <div>
            <p className="font-display text-foreground text-2xl font-semibold tracking-tight">
              {slide.value}
            </p>
            <p className="text-muted-foreground text-sm">{slide.label}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function HomeHero({ locale, hero, chrome, microcopy }: HomeHeroProps) {
  const otherLocale =
    LOCALES.find((candidate) => candidate !== locale) ?? locale

  return (
    <section
      className={cn(
        homeShellClassName,
        "flex min-h-dvh flex-col pt-4 pb-10 md:pt-6 md:pb-14"
      )}
    >
      <a
        href="#about"
        className="bg-background text-foreground focus-visible:ring-ring sr-only rounded-sm px-3 py-2 text-sm font-medium focus-visible:not-sr-only focus-visible:absolute focus-visible:top-2 focus-visible:left-2 focus-visible:z-50 focus-visible:ring-2"
      >
        {microcopy.skipToContent}
      </a>

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-2 lg:grid-rows-1 lg:gap-5">
        <div
          className={cn(
            homeCardClassName,
            "home-hero-invert bg-surface-soft relative flex h-auto min-h-0 flex-col p-6 sm:p-8 md:p-10 lg:h-full",
            "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500"
          )}
        >
          <HomeHeroStipple />
          <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-between">
            <div className="flex items-center justify-between gap-4">
              <Link
                to="/$locale"
                params={{ locale }}
                aria-label="Ai Labs"
                className="focus-visible:ring-ring/50 rounded-sm focus-visible:ring-2 focus-visible:outline-none"
              >
                {/* Opposite of site theme: light site → dark card → light ink */}
                <SiteLogo variant="lockup" onDark className="dark:hidden" />
                <SiteLogo
                  variant="lockup"
                  onLight
                  className="hidden dark:block"
                />
              </Link>
              <a
                href={hero.secondaryCta.href}
                className={homePillOutlineClassName}
              >
                {hero.secondaryCta.label}
                <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
              </a>
            </div>

            <div className="flex max-w-xl flex-col gap-5 py-10 md:py-14">
              <p className={homeLabelClassName}>{hero.label}</p>
              <h1 className={cn(homeDisplayClassName, "leading-[0.95]")}>
                {hero.headline}
              </h1>
              <p className="text-muted-foreground max-w-md text-base leading-relaxed md:text-lg">
                {hero.body}
              </p>
              <a
                href={hero.primaryCta.href}
                className={cn(homePillClassName, "w-fit")}
              >
                {hero.primaryCta.label}
                <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
              </a>
            </div>

            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2" aria-hidden>
                  {["A", "L", "S"].map((initial) => (
                    <span
                      key={initial}
                      className="border-background bg-lavender text-graphite inline-flex size-12 items-center justify-center rounded-full border-2 text-sm font-semibold"
                    >
                      {initial}
                    </span>
                  ))}
                </div>
                <p className="text-muted-foreground text-sm">
                  {hero.proof.label}
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-foreground text-3xl font-semibold tracking-tight md:text-4xl">
                  {hero.proof.value}
                </p>
                <p className="text-muted-foreground text-sm">
                  {hero.proof.label}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          className={cn(
            homeCardClassName,
            "bg-graphite relative h-auto min-h-0 lg:h-full",
            "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:delay-100 motion-safe:duration-500"
          )}
        >
          <img
            src={hero.mediaSrc}
            alt={hero.mediaAlt}
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-graphite/70 via-graphite/20 to-graphite/30" />

          <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-8 md:p-10">
            <div className="flex items-center justify-between gap-4">
              <nav
                aria-label="Pillars"
                className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-2 md:gap-5"
              >
                {chrome.nav.pillars.map((pillar) => (
                  <Link
                    key={pillar.id}
                    to={routeForPillar(pillar.id)}
                    params={{ locale }}
                    className={heroNavLinkClassName}
                  >
                    {pillar.label}
                  </Link>
                ))}
              </nav>

              <div className="flex shrink-0 items-center gap-1 [&_button]:text-on-dark [&_button]:hover:bg-on-dark/10 [&_button]:hover:text-on-dark">
                <ThemeToggle
                  labels={{
                    cycle: microcopy.themeCycle,
                    toLight: microcopy.themeToLight,
                    toDark: microcopy.themeToDark,
                    toSystem: microcopy.themeToSystem,
                  }}
                />
                <Link
                  to="."
                  params={{ locale: otherLocale }}
                  aria-label={microcopy.languageSwitch}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "text-on-dark hover:bg-on-dark/10 hover:text-on-dark text-xs font-semibold tracking-wider uppercase"
                  )}
                >
                  {microcopy.languageSwitch}
                </Link>
              </div>
            </div>

            <HomeHeroStatSlides slides={hero.slides} />
          </div>
        </div>
      </div>
    </section>
  )
}

export { HomeHero }
