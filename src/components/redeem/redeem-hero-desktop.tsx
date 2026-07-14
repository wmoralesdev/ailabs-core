import { Link } from "@tanstack/react-router"

import { SiteLogo } from "@/components/chrome/site-logo"
import { ThemeToggle } from "@/components/chrome/theme-toggle"
import { HomeHeroStipple } from "@/components/home/home-hero-stipple"
import { HomeMediaCarousel } from "@/components/home/home-media-carousel"
import {
  homeCardClassName,
  homeShellClassName,
} from "@/components/home/home-styles"
import { RedeemQrModal } from "@/components/redeem/redeem-qr-modal"
import { buttonVariants } from "@/components/ui/button"
import { LOCALES } from "@/content"
import type { Locale, MicrocopyContent, RedeemContent } from "@/content/types"
import { cn } from "@/lib/utils"

type RedeemHeroDesktopProps = {
  locale: Locale
  microcopy: MicrocopyContent
  mediaSrcs: ReadonlyArray<string>
  mediaAlt: string
  redeemContent: RedeemContent
  left: React.ReactNode
  right: React.ReactNode
  leftFooter?: React.ReactNode
  className?: string
}

function RedeemHeroDesktop({
  locale,
  microcopy,
  mediaSrcs,
  mediaAlt,
  redeemContent,
  left,
  right,
  leftFooter,
  className,
}: RedeemHeroDesktopProps) {
  const otherLocale =
    LOCALES.find((candidate) => candidate !== locale) ?? locale

  return (
    <section
      className={cn(
        homeShellClassName,
        "min-h-dvh flex-col pt-4 pb-10 md:pt-6 md:pb-14",
        className
      )}
    >
      <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-1 gap-5">
        <div
          className={cn(
            homeCardClassName,
            "home-hero-invert bg-surface-soft relative flex h-full min-h-0 flex-col p-6 sm:p-8 md:p-10",
            "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500"
          )}
        >
          <HomeHeroStipple />
          <div className="relative z-10 flex min-h-0 flex-1 flex-col gap-10">
            <div className="flex items-center justify-between gap-4">
              <Link
                to="/$locale"
                params={{ locale }}
                aria-label="Ai Labs"
                className="focus-visible:ring-ring/50 rounded-sm focus-visible:ring-2 focus-visible:outline-none"
              >
                <SiteLogo variant="lockup" onDark className="dark:hidden" />
                <SiteLogo
                  variant="lockup"
                  onLight
                  className="hidden dark:block"
                />
              </Link>
            </div>

            <div className="flex min-h-0 flex-1 flex-col justify-center py-4">
              {left}
            </div>

            {leftFooter}
          </div>
        </div>

        <div
          className={cn(
            homeCardClassName,
            "bg-graphite relative flex h-full flex-col overflow-hidden",
            "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:delay-100 motion-safe:duration-500"
          )}
        >
          <HomeMediaCarousel
            images={mediaSrcs}
            alt={mediaAlt}
            intervalMs={4500}
          />
          <div className="absolute inset-0 z-[2] bg-black/55" aria-hidden />

          <div className="relative z-10 flex h-full flex-col p-6 sm:p-8 md:p-10">
            <div className="[&_button]:text-on-dark [&_button]:hover:bg-on-dark/10 [&_button]:hover:text-on-dark flex items-center justify-end gap-1">
              <RedeemQrModal content={redeemContent} />
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
                  "text-on-dark hover:bg-on-dark/10 hover:text-on-dark text-xs font-semibold tracking-wider uppercase"
                )}
              >
                {microcopy.languageSwitch}
              </Link>
            </div>

            <div className="flex min-h-0 flex-1 flex-col justify-end pt-8">
              {right}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export { RedeemHeroDesktop }
export type { RedeemHeroDesktopProps }
