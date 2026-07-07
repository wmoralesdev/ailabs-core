import { createFileRoute } from "@tanstack/react-router"

import { Section } from "@/components/section"
import { getContent, isLocale } from "@/content"

export const Route = createFileRoute("/$locale/")({
  head: ({ params }) => {
    const locale = isLocale(params.locale) ? params.locale : "en"
    const { meta } = getContent(locale).home

    return {
      meta: [
        { title: meta.title },
        { name: "description", content: meta.description },
      ],
    }
  },
  component: HomeStub,
})

function HomeStub() {
  const { content } = Route.useRouteContext({ from: "/$locale" })

  return (
    <Section>
      <h1 className="font-display text-3xl font-medium text-balance md:text-4xl">
        {content.home.hero.h1}
      </h1>
      <p className="text-muted-foreground mt-4 max-w-2xl text-lg">
        {content.home.hero.sub}
      </p>
    </Section>
  )
}
