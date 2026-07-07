import { createFileRoute } from "@tanstack/react-router"

import { Section } from "@/components/section"
import { getContent, isLocale } from "@/content"

export const Route = createFileRoute("/$locale/aperture")({
  head: ({ params }) => {
    const locale = isLocale(params.locale) ? params.locale : "en"
    const { meta } = getContent(locale).aperture

    return {
      meta: [
        { title: meta.title },
        { name: "description", content: meta.description },
      ],
    }
  },
  component: ApertureStub,
})

function ApertureStub() {
  const { content } = Route.useRouteContext({ from: "/$locale" })

  return (
    <Section>
      <p className="text-caption text-muted-foreground">
        {content.aperture.hero.overline}
      </p>
      <h1 className="font-display text-display-md text-balance mt-2">
        {content.aperture.hero.h1}
      </h1>
      <p className="text-body-lg text-muted-foreground mt-4 max-w-2xl">
        {content.aperture.hero.sub}
      </p>
    </Section>
  )
}
