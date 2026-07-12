import { createFileRoute, getRouteApi } from "@tanstack/react-router"

import { HomeAbout } from "@/components/home/home-about"
import { HomeAperture } from "@/components/home/home-aperture"
import { HomeContact } from "@/components/home/home-contact"
import { HomeHero } from "@/components/home/home-hero"
import { HomePillar } from "@/components/home/home-pillar"
import { HomeReveal } from "@/components/home/home-reveal"
import { homeSectionGapClassName } from "@/components/home/home-styles"
import { getContent, isLocale } from "@/content"
import { cn } from "@/lib/utils"

const localeRoute = getRouteApi("/$locale")

export const Route = createFileRoute("/$locale/")({
  head: ({ params }) => {
    const locale = isLocale(params.locale) ? params.locale : "en"
    const { meta } = getContent(locale)

    return {
      meta: [
        { title: meta.title },
        { name: "description", content: meta.description },
      ],
    }
  },
  component: HomePage,
})

function HomePage() {
  const { locale, content } = localeRoute.useRouteContext()
  const { home, chrome, microcopy } = content

  return (
    <div className={cn(homeSectionGapClassName, "pb-4")}>
      <HomeHero
        locale={locale}
        hero={home.hero}
        chrome={chrome}
        microcopy={microcopy}
      />
      <HomeReveal className="max-lg:mt-0 lg:-mt-14">
        <HomeAbout about={home.about} />
      </HomeReveal>
      <HomeReveal>
        <HomePillar pillar={home.academy} mediaSide="right" intervalMs={5200} />
      </HomeReveal>
      <HomeReveal>
        <HomePillar pillar={home.agentic} mediaSide="left" intervalMs={5800} />
      </HomeReveal>
      <HomeReveal>
        <HomeAperture aperture={home.aperture} />
      </HomeReveal>
      <HomeReveal>
        <HomeContact contact={home.contact} />
      </HomeReveal>
    </div>
  )
}
