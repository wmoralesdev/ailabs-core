/**
 * Content modules store locale-agnostic path hrefs ("/community") or home
 * section hashes ("#academy"). Path hrefs map to `$locale` route ids; pass
 * `locale` as a param. Hash hrefs scroll to sections on the localized home.
 */
const INTERNAL_ROUTES = {
  "/community": "/$locale/community",
} as const

type InternalHref = keyof typeof INTERNAL_ROUTES

type InternalRoute = (typeof INTERNAL_ROUTES)[InternalHref]

function isInternalHref(href: string): href is InternalHref {
  return href in INTERNAL_ROUTES
}

function isHashHref(href: string): boolean {
  return href.startsWith("#")
}

function hashFromHref(href: string): string {
  return href.startsWith("#") ? href.slice(1) : href
}

function routeForHref(href: InternalHref): InternalRoute {
  return INTERNAL_ROUTES[href]
}

export { hashFromHref, isHashHref, isInternalHref, routeForHref }
export type { InternalHref, InternalRoute }
