import {
  Link,
  Outlet,
  createFileRoute,
  notFound,
  useRouterState,
} from "@tanstack/react-router"

import { SiteFooter } from "@/components/chrome/site-footer"
import { SiteHeader } from "@/components/chrome/site-header"
import { MainCard } from "@/components/chrome/main-card"
import { getContent, isLocale } from "@/content"
import type { Locale, MicrocopyContent } from "@/content"

const chromeShellClassName = "flex min-h-dvh flex-col"
const mainClassName = "flex flex-1 flex-col"

export const Route = createFileRoute("/$locale")({
  beforeLoad: ({ params }) => {
    if (!isLocale(params.locale)) {
      throw notFound()
    }

    return {
      locale: params.locale,
      content: getContent(params.locale),
    }
  },
  component: LocaleLayout,
  notFoundComponent: LocaleNotFound,
})

function LocaleLayout() {
  const { locale, content } = Route.useRouteContext()
  const hideChromeHeader = useRouterState({
    select: (state) =>
      state.matches.some(
        (match) =>
          match.routeId === "/$locale/" ||
          match.routeId === "/$locale/redeem" ||
          match.routeId === "/$locale/community"
      ),
  })

  return (
    <div className={chromeShellClassName}>
      {hideChromeHeader ? null : (
        <SiteHeader
          locale={locale}
          chrome={content.chrome}
          microcopy={content.microcopy}
        />
      )}
      <main id="main" className={mainClassName}>
        <Outlet />
      </main>
      <SiteFooter locale={locale} footer={content.chrome.footer} />
    </div>
  )
}

function LocaleNotFoundContent({
  locale,
  microcopy,
}: {
  locale: Locale
  microcopy: MicrocopyContent
}) {
  return (
    <MainCard>
      <section className="section-y page-gutter">
        <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          404
        </p>
        <h1 className="font-display text-foreground mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
          {microcopy.notFoundTitle}
        </h1>
        <p className="text-muted-foreground mt-4 max-w-prose text-lg">
          {microcopy.notFoundBody}
        </p>
        <Link
          to="/$locale"
          params={{ locale }}
          className="bg-primary text-primary-foreground focus-visible:ring-ring/50 mt-8 inline-flex h-11 items-center rounded-md px-5 text-sm font-medium transition-colors hover:brightness-95 focus-visible:ring-2 focus-visible:outline-none"
        >
          {microcopy.notFoundCtaHome}
        </Link>
      </section>
    </MainCard>
  )
}

function LocaleNotFound() {
  const params = Route.useParams()
  const hasValidLocale = isLocale(params.locale)
  const locale: Locale = isLocale(params.locale) ? params.locale : "en"
  const content = getContent(locale)
  const { microcopy } = content

  const notFoundContent = (
    <LocaleNotFoundContent locale={locale} microcopy={microcopy} />
  )

  if (hasValidLocale) {
    return notFoundContent
  }

  return (
    <div className={chromeShellClassName}>
      <SiteHeader
        locale={locale}
        chrome={content.chrome}
        microcopy={microcopy}
      />
      <main id="main" className={mainClassName}>
        {notFoundContent}
      </main>
      <SiteFooter locale={locale} footer={content.chrome.footer} />
    </div>
  )
}
