import type { CSSProperties } from "react"
import { useEffect, useRef, useState } from "react"
import { Link } from "@tanstack/react-router"

import type { FooterContent, Locale, NavItem } from "@/content"

import { formatCopyright } from "@/content"
import { SiteLogo } from "@/components/chrome/site-logo"
import { isInternalHref, routeForHref } from "@/lib/locale-links"
import { cn } from "@/lib/utils"

type SiteFooterProps = {
  locale: Locale
  footer: FooterContent
}

const footerLinkClassName =
  "text-muted-foreground hover:text-purple text-sm transition-colors focus-visible:ring-ring/50 focus-visible:ring-2 focus-visible:outline-none rounded-sm"

function FooterLink({ link, locale }: { link: NavItem; locale: Locale }) {
  if (link.href.startsWith("http")) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noreferrer"
        className={footerLinkClassName}
      >
        {link.label}
      </a>
    )
  }

  if (isInternalHref(link.href)) {
    return (
      <Link
        to={routeForHref(link.href)}
        params={{ locale }}
        className={footerLinkClassName}
      >
        {link.label}
      </Link>
    )
  }

  return (
    <a href={link.href} className={footerLinkClassName}>
      {link.label}
    </a>
  )
}

function SiteFooter({ locale, footer }: SiteFooterProps) {
  const columns = footer.columns.filter((column) => column.links.length > 0)

  return (
    <footer className="bg-surface-soft relative overflow-hidden">
      <FooterStippleField />

      <div className="page-gutter max-w-content section-y relative mx-auto">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <SiteLogo variant="lockup" />
            <p className="text-foreground mt-4 max-w-sm text-sm">
              {footer.brandLine}
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title} className="md:col-span-3">
              <h2 className="text-foreground text-xs font-semibold tracking-wider uppercase">
                {column.title}
              </h2>
              <ul className="mt-4 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <FooterLink link={link} locale={locale} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-border mt-16 border-t pt-6">
          <p className="text-muted-foreground text-sm">
            {formatCopyright(footer.copyright)}
          </p>
        </div>
      </div>
    </footer>
  )
}

const FOOTER_STIPPLE_MASK =
  "radial-gradient(90% 80% at 50% 100%, black 25%, transparent 78%)"

function FooterStippleField() {
  const ref = useRef<HTMLDivElement>(null)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (typeof IntersectionObserver === "undefined") {
      setEntered(true)
      return
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setEntered(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setEntered(true)
            observer.disconnect()
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const style: CSSProperties = {
    backgroundImage:
      "radial-gradient(color-mix(in srgb, var(--primary) 55%, transparent) 1.5px, transparent 1.5px)",
    backgroundSize: "14px 14px",
    maskImage: FOOTER_STIPPLE_MASK,
    WebkitMaskImage: FOOTER_STIPPLE_MASK,
  }

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        className={cn(
          "absolute inset-0 motion-safe:transition-opacity motion-safe:duration-700 motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)]",
          entered ? "opacity-50" : "opacity-0"
        )}
        style={style}
      />
    </div>
  )
}

export { SiteFooter }
export type { SiteFooterProps }
