import { createFileRoute, getRouteApi } from "@tanstack/react-router"

import { HomeAbout } from "@/components/home/home-about"
import { HomeContact } from "@/components/home/home-contact"
import { HomeFeatures } from "@/components/home/home-features"
import { HomeHero } from "@/components/home/home-hero"
import { HomePartner } from "@/components/home/home-partner"
import { HomeReveal } from "@/components/home/home-reveal"
import { HomeTrust } from "@/components/home/home-trust"
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
      <HomeReveal>
        <HomeAbout about={home.about} />
      </HomeReveal>
      <HomeReveal>
        <HomeFeatures locale={locale} features={home.features} />
      </HomeReveal>
      <HomeReveal>
        <HomePartner partner={home.partner} />
      </HomeReveal>
      <HomeReveal>
        <HomeTrust trust={home.trust} />
      </HomeReveal>
      <HomeReveal>
        <HomeContact contact={home.contact} />
      </HomeReveal>
    </div>
  )
}
