import type { Locale } from "@/content"
import { LOCALES } from "@/content"

export const SITE_URL = "https://ailabs.sv"
export const SITE_NAME = "Ai Labs"
export const OG_IMAGE_PATH = "/og-image.png"
export const OG_IMAGE_URL = `${SITE_URL}${OG_IMAGE_PATH}`
export const OG_IMAGE_ALT =
  "Ai Labs — Adapt, develop, and learn with AI. Based in El Salvador."

const OG_LOCALE: Record<Locale, string> = {
  en: "en_US",
  es: "es_SV",
}

export function localizedPath(locale: Locale, path = ""): string {
  const normalized = path === "/" || path === "" ? "" : path.startsWith("/") ? path : `/${path}`
  return `/${locale}${normalized}`
}

export function absoluteUrl(locale: Locale, path = ""): string {
  return `${SITE_URL}${localizedPath(locale, path)}`
}

type BuildPageMetaInput = {
  locale: Locale
  path?: string
  title: string
  description: string
}

type HeadMeta = {
  title?: string
  name?: string
  property?: string
  content?: string
  charSet?: string
}

type HeadLink = {
  rel: string
  href: string
  hreflang?: string
  type?: string
  sizes?: string
}

type HeadScript = {
  type: string
  children: string
}

export type PageHead = {
  meta: HeadMeta[]
  links: HeadLink[]
  scripts: HeadScript[]
}

export function buildPageMeta({
  locale,
  path = "",
  title,
  description,
}: BuildPageMetaInput): PageHead {
  const url = absoluteUrl(locale, path)
  const alternateLocale = locale === "en" ? "es" : "en"

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:locale", content: OG_LOCALE[locale] },
      {
        property: "og:locale:alternate",
        content: OG_LOCALE[alternateLocale],
      },
      { property: "og:image", content: OG_IMAGE_URL },
      { property: "og:image:alt", content: OG_IMAGE_ALT },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: OG_IMAGE_URL },
      { name: "twitter:image:alt", content: OG_IMAGE_ALT },
    ],
    links: [
      { rel: "canonical", href: url },
      ...LOCALES.map((lang) => ({
        rel: "alternate",
        href: absoluteUrl(lang, path),
        hreflang: lang,
      })),
      {
        rel: "alternate",
        href: absoluteUrl("en", path),
        hreflang: "x-default",
      },
    ],
    scripts: [],
  }
}

type JsonLdPillar = {
  name: string
  description: string
}

export function buildHomeJsonLd(input: {
  locale: Locale
  title: string
  description: string
  pillars: ReadonlyArray<JsonLdPillar>
}): HeadScript {
  const url = absoluteUrl(input.locale)
  const graph = [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/brand/ailabs-ico.svg`,
      },
      description: input.description,
      areaServed: {
        "@type": "Country",
        name: "El Salvador",
      },
      address: {
        "@type": "PostalAddress",
        addressCountry: "SV",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: input.description,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: LOCALES,
      potentialAction: {
        "@type": "ReadAction",
        target: LOCALES.map((lang) => absoluteUrl(lang)),
      },
    },
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: input.title,
      description: input.description,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
      inLanguage: input.locale,
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: OG_IMAGE_URL,
      },
    },
    {
      "@type": "OfferCatalog",
      "@id": `${SITE_URL}/#offer-catalog`,
      name: "Ai Labs pillars",
      itemListElement: input.pillars.map((pillar, index) => ({
        "@type": "Offer",
        position: index + 1,
        itemOffered: {
          "@type": "Service",
          name: pillar.name,
          description: pillar.description,
          provider: { "@id": `${SITE_URL}/#organization` },
          areaServed: {
            "@type": "Country",
            name: "El Salvador",
          },
        },
      })),
    },
  ]

  return {
    type: "application/ld+json",
    children: JSON.stringify({
      "@context": "https://schema.org",
      "@graph": graph,
    }),
  }
}

export function localeFromPathname(pathname: string): Locale | null {
  const segment = pathname.split("/").filter(Boolean)[0]
  if (segment === "en" || segment === "es") {
    return segment
  }
  return null
}
