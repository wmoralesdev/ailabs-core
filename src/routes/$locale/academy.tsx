import { createFileRoute } from "@tanstack/react-router"

import { Section } from "@/components/section"
import { getContent, isLocale } from "@/content"

export const Route = createFileRoute("/$locale/academy")({
  head: ({ params }) => {
    const locale = isLocale(params.locale) ? params.locale : "en"
    const { meta } = getContent(locale).academy

    return {
      meta: [
        { title: meta.title },
        { name: "description", content: meta.description },
      ],
    }
  },
  component: AcademyStub,
})

function AcademyStub() {
  const { content } = Route.useRouteContext({ from: "/$locale" })

  return (
    <Section>
      <p className="text-muted-foreground text-sm tracking-wide uppercase">
        {content.academy.hero.overline}
      </p>
      <h1 className="font-display mt-2 text-3xl font-medium text-balance md:text-4xl">
        {content.academy.hero.h1}
      </h1>
      <p className="text-muted-foreground mt-4 max-w-2xl text-lg">
        {content.academy.hero.sub}
      </p>
    </Section>
  )
}
