import { createFileRoute, redirect } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { getRequestHeader } from "@tanstack/react-start/server"

import { localeFromAcceptLanguage } from "@/content"

const resolveRootLocale = createServerFn({ method: "GET" }).handler(() => {
  const acceptLanguage = getRequestHeader("accept-language")
  return localeFromAcceptLanguage(acceptLanguage)
})

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const locale = await resolveRootLocale()
    throw redirect({
      to: "/$locale",
      params: { locale },
    })
  },
})
