import { Link } from "@tanstack/react-router"

import type { FooterContent, Locale, NavItem } from "@/content"

import { formatCopyright } from "@/content"
import { SiteLogo } from "@/components/chrome/site-logo"
import { isInternalHref, routeForHref } from "@/lib/locale-links"

type SiteFooterProps = {
  locale: Locale
  footer: FooterContent
}

const footerLinkClassName =
  "text-muted-foreground hover:text-purple inline-flex rounded-sm text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"

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
    <footer className="bg-background px-2 pb-2 sm:px-3 sm:pb-3">
      <div className="overflow-hidden rounded-[2rem] border border-border bg-card">
        <div className="page-gutter mx-auto max-w-[90rem] py-10 sm:py-12 md:py-14">
          <div className="grid gap-10 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-6">
              <Link
                to="/$locale"
                params={{ locale }}
                aria-label="Ai Labs"
                className="inline-flex rounded-sm focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <SiteLogo variant="lockup" />
              </Link>
              <p className="mt-5 max-w-sm text-base leading-relaxed text-muted-foreground">
                {footer.brandLine}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 md:col-span-6">
              {columns.map((column, index) => {
                const headingId = `footer-column-${index}`

                return (
                  <nav key={column.title} aria-labelledby={headingId}>
                    <h2
                      id={headingId}
                      className="text-xs font-semibold tracking-wider text-foreground uppercase"
                    >
                      {column.title}
                    </h2>
                    <ul className="mt-4 flex flex-col gap-3">
                      {column.links.map((link) => (
                        <li key={`${link.label}-${link.href}`}>
                          <FooterLink link={link} locale={locale} />
                        </li>
                      ))}
                    </ul>
                  </nav>
                )
              })}
            </div>
          </div>

          <div className="mt-10 border-t border-border pt-6 md:mt-14">
            <p className="text-sm text-muted-foreground">
              {formatCopyright(footer.copyright)}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { SiteFooter }
export type { SiteFooterProps }
