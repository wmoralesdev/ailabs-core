import { useEffect } from "react"
import { Outlet, createFileRoute, notFound } from "@tanstack/react-router"

import { getContent, isLocale } from "@/content"

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
  head: ({ params }) => {
    const locale = isLocale(params.locale) ? params.locale : "en"
    const content = getContent(locale)

    return {
      meta: [
        { title: content.home.meta.title },
        {
          name: "description",
          content: content.home.meta.description,
        },
      ],
    }
  },
  component: LocaleLayout,
})

function LocaleLayout() {
  const { locale } = Route.useRouteContext()

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return <Outlet />
}
