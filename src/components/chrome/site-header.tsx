import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon, Menu01Icon } from "@hugeicons/core-free-icons"

import type {
  ChromeContent,
  Locale,
  MicrocopyContent,
} from "@/content"

import { LOCALES } from "@/content"
import { SiteLogo } from "@/components/chrome/site-logo"
import { ThemeToggle } from "@/components/chrome/theme-toggle"
import { Button, buttonVariants } from "@/components/ui/button"
import { routeForPillar } from "@/lib/locale-links"
import { useScrolled } from "@/lib/use-scrolled"
import { cn } from "@/lib/utils"

type SiteHeaderProps = {
  locale: Locale
  chrome: ChromeContent
  microcopy: MicrocopyContent
}

const navLinkClassName =
  "text-foreground/80 hover:text-purple text-sm font-medium underline decoration-transparent decoration-2 underline-offset-8 hover:decoration-purple-soft motion-safe:transition-[color,text-decoration-color] motion-safe:duration-150 motion-reduce:transition-none focus-visible:ring-ring/50 focus-visible:ring-2 focus-visible:outline-none rounded-sm"

const activeNavLinkClassName =
  "text-purple decoration-purple hover:decoration-purple"

function SiteHeader({ locale, chrome, microcopy }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const scrolled = useScrolled()
  const otherLocale =
    LOCALES.find((candidate) => candidate !== locale) ?? locale
  const closeMenu = () => setMenuOpen(false)

  return (
    <header
      data-scrolled={scrolled || menuOpen ? "" : undefined}
      className={cn(
        "sticky top-0 z-40 motion-safe:transition-[background-color,box-shadow,backdrop-filter] motion-safe:duration-200 motion-reduce:transition-none",
        menuOpen
          ? "bg-background shadow-soft"
          : scrolled
            ? "bg-background/80 backdrop-blur-md"
            : "bg-background"
      )}
    >
      <a
        href="#main"
        className="bg-background text-foreground focus-visible:ring-ring sr-only rounded-sm px-3 py-2 text-sm font-medium focus-visible:not-sr-only focus-visible:absolute focus-visible:top-2 focus-visible:left-2 focus-visible:z-50 focus-visible:ring-2"
      >
        {microcopy.skipToContent}
      </a>

      <div className="page-gutter max-w-content mx-auto flex h-[var(--site-header-height)] items-center justify-between gap-6">
        <Link
          to="/$locale"
          params={{ locale }}
          aria-label="Ai Labs"
          onClick={closeMenu}
          className="focus-visible:ring-ring/50 rounded-sm focus-visible:ring-2 focus-visible:outline-none"
        >
          <SiteLogo variant="lockup" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {chrome.nav.pillars.map((pillar) => (
            <Link
              key={pillar.id}
              to={routeForPillar(pillar.id)}
              params={{ locale }}
              className={navLinkClassName}
              activeProps={{ className: activeNavLinkClassName }}
            >
              {pillar.label}
            </Link>
          ))}
          <a href={chrome.nav.contact.href} className={navLinkClassName}>
            {chrome.nav.contact.label}
          </a>
        </nav>

        <div className="flex items-center gap-2">
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
              "text-xs font-semibold tracking-wider uppercase"
            )}
          >
            {microcopy.languageSwitch}
          </Link>
          <a
            href={chrome.nav.cta.href}
            className={cn(
              buttonVariants({ size: "sm" }),
              "hidden md:inline-flex",
              "motion-safe:duration-150 motion-safe:hover:-translate-y-px motion-safe:hover:shadow-lift"
            )}
          >
            {chrome.nav.cta.label}
          </a>
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? microcopy.menuClose : microcopy.menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <HugeiconsIcon icon={menuOpen ? Cancel01Icon : Menu01Icon} />
          </Button>
        </div>
      </div>

      {menuOpen ? (
        <nav
          id="mobile-nav"
          className="page-gutter bg-background pt-4 pb-6 md:hidden"
        >
          <div className="flex flex-col gap-4">
            {chrome.nav.pillars.map((pillar) => (
              <Link
                key={pillar.id}
                to={routeForPillar(pillar.id)}
                params={{ locale }}
                onClick={closeMenu}
                className={cn(navLinkClassName, "text-base")}
                activeProps={{ className: activeNavLinkClassName }}
              >
                {pillar.label}
              </Link>
            ))}
            <a
              href={chrome.nav.contact.href}
              onClick={closeMenu}
              className={cn(navLinkClassName, "text-base")}
            >
              {chrome.nav.contact.label}
            </a>
            <a
              href={chrome.nav.cta.href}
              onClick={closeMenu}
              className={cn(
                buttonVariants({ size: "default" }),
                "mt-2 w-fit",
                "motion-safe:duration-150 motion-safe:hover:-translate-y-px motion-safe:hover:shadow-lift"
              )}
            >
              {chrome.nav.cta.label}
            </a>
          </div>
        </nav>
      ) : null}
    </header>
  )
}

export { SiteHeader }
export type { SiteHeaderProps }
