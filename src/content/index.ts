import { en } from "./en"
import { es } from "./es"
import { LOCALES   } from "./types"
import type {Locale, SiteContent} from "./types";

export { LOCALES, type Locale, type SiteContent }
export type * from "./types"

const contentByLocale: Record<Locale, SiteContent> = {
  en,
  es,
}

export function isLocale(value: string): value is Locale {
  return (LOCALES as ReadonlyArray<string>).includes(value)
}

export function getContent(locale: Locale): SiteContent {
  return contentByLocale[locale]
}

/**
 * Prefer `es` when Accept-Language ranks Spanish above English; otherwise `en`.
 */
export function localeFromAcceptLanguage(
  header: string | null | undefined
): Locale {
  if (!header) {
    return "en"
  }

  const preferences = header
    .split(",")
    .map((part) => {
      const [rawTag, ...params] = part.trim().split(";")
      const tag = rawTag.trim().toLowerCase()
      let q = 1
      for (const param of params) {
        const [key, value = ""] = param.trim().split("=")
        if (key === "q" && value.length > 0) {
          const parsed = Number.parseFloat(value)
          if (!Number.isNaN(parsed)) {
            q = parsed
          }
        }
      }
      return { tag, q }
    })
    .filter((entry) => entry.tag.length > 0)
    .sort((a, b) => b.q - a.q)

  for (const { tag } of preferences) {
    if (tag === "*" || tag.startsWith("en")) {
      return "en"
    }
    if (tag.startsWith("es")) {
      return "es"
    }
  }

  return "en"
}

export function formatCopyright(template: string, year = new Date().getFullYear()) {
  return template.replace("{year}", String(year))
}
