import { createFileRoute } from "@tanstack/react-router"

import { getContent, isLocale } from "@/content"

export const Route = createFileRoute("/$locale/aperture")({
  head: ({ params }) => {
    const locale = isLocale(params.locale) ? params.locale : "en"
    const { meta } = getContent(locale)

    return {
      meta: [
        { title: `Aperture — ${meta.title}` },
        { name: "description", content: meta.description },
        { name: "robots", content: "noindex, nofollow" },
      ],
    }
  },
  component: AperturePage,
})

function AperturePage() {
  return null
}
