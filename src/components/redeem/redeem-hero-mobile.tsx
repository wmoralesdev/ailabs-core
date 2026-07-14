import { Link } from "@tanstack/react-router"

import { SiteLogo } from "@/components/chrome/site-logo"
import { ThemeToggle } from "@/components/chrome/theme-toggle"
import { HomeMediaCarousel } from "@/components/home/home-media-carousel"
import { homeHeroChromeHeightClassName } from "@/components/home/home-styles"
import { RedeemQrModal } from "@/components/redeem/redeem-qr-modal"
import { buttonVariants } from "@/components/ui/button"
import { LOCALES } from "@/content"
import type { CampaignQrCopy, Locale, MicrocopyContent } from "@/content/types"
import { useScrolledPastHero } from "@/hooks/use-scrolled-past-hero"
import { cn } from "@/lib/utils"

type RedeemHeroMobileProps = {
  locale: Locale
  microcopy: MicrocopyContent
  mediaSrcs: ReadonlyArray<string>
  mediaAlt: string
  qrContent: CampaignQrCopy
  left: React.ReactNode
  right: React.ReactNode
  leftFooter?: React.ReactNode
  className?: string
}

function RedeemHeroMobile({
  locale,
  microcopy,
  mediaSrcs,
  mediaAlt,
  qrContent,
  left,
  right,
  leftFooter,
  className,
}: RedeemHeroMobileProps) {
  const scrolled = useScrolledPastHero()
  const otherLocale =
    LOCALES.find((candidate) => candidate !== locale) ?? locale

  return (
    <div className={cn("relative", className)}>
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
            <SiteLogo
              variant="lockup"
              onDark={!scrolled}
              className="h-5 w-auto"
            />
          </Link>

          <div className="flex shrink-0 items-center gap-1">
            <RedeemQrModal content={qrContent} onDark={!scrolled} />
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
              search={(prev) => prev}
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
          </div>
        </div>
      </header>

      <section
        className="bg-graphite relative w-full min-h-[100dvh]"
        aria-label={mediaAlt}
      >
        <HomeMediaCarousel
          images={mediaSrcs}
          alt={mediaAlt}
          intervalMs={4500}
        />
        <div
          className="from-black via-black/70 to-black/25 absolute inset-0 z-1 bg-gradient-to-t"
          aria-hidden
        />

        <div
          className={cn(
            "relative z-10 flex min-h-[100dvh] flex-col justify-end gap-8 px-5 pb-12",
            "pt-[calc(env(safe-area-inset-top)+4.5rem)]"
          )}
        >
          <div className="flex flex-col gap-8">
            {left}
            {right}
            {leftFooter}
          </div>
        </div>
      </section>
    </div>
  )
}

export { RedeemHeroMobile }
export type { RedeemHeroMobileProps }
