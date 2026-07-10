import { createFileRoute } from "@tanstack/react-router"

import { getContent, isLocale } from "@/content"

export const Route = createFileRoute("/$locale/academy")({
  head: ({ params }) => {
    const locale = isLocale(params.locale) ? params.locale : "en"
    const { meta } = getContent(locale)

    return {
      meta: [
        { title: `Academy — ${meta.title}` },
        { name: "description", content: meta.description },
      ],
    }
  },
  component: AcademyPage,
})

function AcademyPage() {
  return null
}
