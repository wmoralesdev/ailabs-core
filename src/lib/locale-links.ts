import type { PillarId } from "@/content"

/**
 * Content modules store locale-agnostic hrefs ("/academy"). The router is
 * typed, so map them to `$locale` route ids and pass `locale` as a param.
 */
const INTERNAL_ROUTES = {
  "/academy": "/$locale/academy",
  "/agentic": "/$locale/agentic",
  "/aperture": "/$locale/aperture",
} as const

type InternalHref = keyof typeof INTERNAL_ROUTES

type InternalRoute = (typeof INTERNAL_ROUTES)[InternalHref]

function isInternalHref(href: string): href is InternalHref {
  return href in INTERNAL_ROUTES
}

function routeForHref(href: InternalHref): InternalRoute {
  return INTERNAL_ROUTES[href]
}

function routeForPillar(id: PillarId): InternalRoute {
  return INTERNAL_ROUTES[`/${id}`]
}

export { isInternalHref, routeForHref, routeForPillar }
export type { InternalHref, InternalRoute }
