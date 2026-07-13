import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  Menu01Icon,
} from "@hugeicons/core-free-icons"

import type {
  ChromeContent,
  HomeHeroContent,
  Locale,
  MicrocopyContent,
} from "@/content"
import { LOCALES } from "@/content"
import { SiteLogo } from "@/components/chrome/site-logo"
import { ThemeToggle } from "@/components/chrome/theme-toggle"
import { HomeMediaCarousel } from "@/components/home/home-media-carousel"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { routeForPillar } from "@/lib/locale-links"
import { useScrolledPastHero } from "@/hooks/use-scrolled-past-hero"
import { cn } from "@/lib/utils"
import {
  homeDisplayClassName,
  homeHeroChromeHeightClassName,
  homePillClassName,
} from "@/components/home/home-styles"

type HomeHeroMobileProps = {
  locale: Locale
  hero: HomeHeroContent
  chrome: ChromeContent
  microcopy: MicrocopyContent
  className?: string
}

const sheetNavLinkClassName =
  "text-foreground hover:text-foreground/80 text-lg font-medium underline decoration-transparent decoration-2 underline-offset-8 hover:decoration-purple-soft motion-safe:transition-[color,text-decoration-color] motion-safe:duration-150 focus-visible:ring-ring/50 rounded-sm focus-visible:ring-2 focus-visible:outline-none"

const heroLabelClassName =
  "border-on-dark/25 bg-on-dark/10 text-on-dark inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wider uppercase backdrop-blur-sm"

function HomeHeroMobile({
  locale,
  hero,
  chrome,
  microcopy,
  className,
}: HomeHeroMobileProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const scrolled = useScrolledPastHero()
  const otherLocale =
    LOCALES.find((candidate) => candidate !== locale) ?? locale

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className={cn("relative", className)}>
      <a
        href="#about"
        className="bg-background text-foreground focus-visible:ring-ring sr-only rounded-sm px-3 py-2 text-sm font-medium focus-visible:not-sr-only focus-visible:absolute focus-visible:top-2 focus-visible:left-2 focus-visible:z-50 focus-visible:ring-2"
      >
        {microcopy.skipToContent}
      </a>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <header
          className={cn(
            "fixed inset-x-0 top-0 z-40 pt-[env(safe-area-inset-top)]",
            "motion-safe:transition-[background-color,border-color,backdrop-filter] motion-safe:duration-300",
            scrolled
              ? "border-border/40 bg-surface-soft/85 border-b shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-md"
              : "border-b border-transparent bg-transparent"
          )}
        >
          <div
            className={cn(
              homeHeroChromeHeightClassName,
              "flex items-center justify-between gap-3 px-5",
              scrolled
                ? ""
                : "[&_button]:text-on-dark [&_button]:hover:bg-on-dark/10 [&_button]:hover:text-on-dark"
            )}
          >
            <Link
              to="/$locale"
              params={{ locale }}
              aria-label="Ai Labs"
              className="focus-visible:ring-ring/50 rounded-sm focus-visible:ring-2 focus-visible:outline-none"
            >
              <SiteLogo variant="lockup" onDark={!scrolled} className="h-5 w-auto" />
            </Link>

            <div className="flex shrink-0 items-center gap-1">
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
                  "text-xs font-semibold tracking-wider uppercase",
                  scrolled
                    ? ""
                    : "text-on-dark hover:bg-on-dark/10 hover:text-on-dark"
                )}
              >
                {microcopy.languageSwitch}
              </Link>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={
                      menuOpen ? microcopy.menuClose : microcopy.menuOpen
                    }
                  />
                }
              >
                <HugeiconsIcon icon={Menu01Icon} strokeWidth={2} />
              </SheetTrigger>
            </div>
          </div>
        </header>

        <SheetContent
          side="right"
          className="gap-0 p-0 data-[side=right]:w-full data-[side=right]:max-w-full sm:data-[side=right]:max-w-full"
        >
          <SheetHeader className="border-border border-b px-6 py-5">
            <SheetTitle className="font-display text-base font-semibold tracking-tight uppercase">
              Ai Labs
            </SheetTitle>
            <SheetDescription className="sr-only">
              {microcopy.menuOpen}
            </SheetDescription>
          </SheetHeader>

          <nav
            aria-label="Primary"
            className="flex flex-1 flex-col gap-5 px-6 py-8"
          >
            {chrome.nav.pillars.map((pillar) => (
              <Link
                key={pillar.id}
                to={routeForPillar(pillar.id)}
                params={{ locale }}
                onClick={closeMenu}
                className={sheetNavLinkClassName}
              >
                {pillar.label}
              </Link>
            ))}
            <a
              href={chrome.nav.contact.href}
              onClick={closeMenu}
              className={sheetNavLinkClassName}
            >
              {chrome.nav.contact.label}
            </a>
            <a
              href={chrome.nav.cta.href}
              onClick={closeMenu}
              className={cn(homePillClassName, "mt-2 w-fit")}
            >
              {chrome.nav.cta.label}
              <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
            </a>
          </nav>
        </SheetContent>
      </Sheet>

      <section
        className="bg-graphite relative w-full min-h-[100dvh]"
        aria-label={hero.mediaAlt}
      >
        <HomeMediaCarousel
          images={hero.mediaSrcs}
          alt={hero.mediaAlt}
          intervalMs={4500}
        />
        <div className="from-graphite via-graphite/60 to-graphite/25 absolute inset-0 z-1 bg-gradient-to-t" />

        <div
          className={cn(
            "relative z-10 flex min-h-[100dvh] flex-col justify-end gap-8 px-5 pb-12",
            "pt-[calc(env(safe-area-inset-top)+4.5rem)]"
          )}
        >
          <div className="flex max-w-xl flex-col gap-4">
            <p
              className={cn(
                heroLabelClassName,
                "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500"
              )}
            >
              {hero.label}
            </p>
            <h1
              className={cn(
                homeDisplayClassName,
                "text-on-dark leading-[0.95]",
                "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:delay-75 motion-safe:duration-500"
              )}
            >
              {hero.headline}
            </h1>
            <p
              className={cn(
                "text-on-dark/80 max-w-sm text-sm leading-relaxed sm:text-base",
                "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:delay-150 motion-safe:duration-500"
              )}
            >
              {hero.body}
            </p>
            <a
              href={hero.primaryCta.href}
              className={cn(
                homePillClassName,
                "w-fit",
                "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:delay-200 motion-safe:duration-500"
              )}
            >
              {hero.primaryCta.label}
              <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
            </a>
          </div>

          <div
            className={cn(
              "flex items-center gap-4",
              "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:delay-300 motion-safe:duration-500"
            )}
          >
            <div className="flex -space-x-2" aria-hidden>
              {["A", "L", "S"].map((initial) => (
                <span
                  key={initial}
                  className="border-graphite bg-lavender text-graphite inline-flex size-11 items-center justify-center rounded-full border-2 text-sm font-semibold"
                >
                  {initial}
                </span>
              ))}
            </div>
            <div>
              <p className="font-display text-on-dark text-2xl font-semibold tracking-tight">
                {hero.proof.value}
              </p>
              <p className="text-on-dark/70 text-sm">{hero.proof.label}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export { HomeHeroMobile }
export type { HomeHeroMobileProps }
