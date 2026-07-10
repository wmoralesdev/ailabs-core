import { createFileRoute } from "@tanstack/react-router"

import { getContent, isLocale } from "@/content"

export const Route = createFileRoute("/$locale/agentic")({
  head: ({ params }) => {
    const locale = isLocale(params.locale) ? params.locale : "en"
    const { meta } = getContent(locale)

    return {
      meta: [
        { title: `Agentic — ${meta.title}` },
        { name: "description", content: meta.description },
      ],
    }
  },
  component: AgenticPage,
})

function AgenticPage() {
  return null
}
