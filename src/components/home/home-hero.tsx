import type {
  ChromeContent,
  HomeHeroContent,
  Locale,
  MicrocopyContent,
} from "@/content"
import { HomeHeroDesktop } from "@/components/home/home-hero-desktop"
import { HomeHeroMobile } from "@/components/home/home-hero-mobile"

type HomeHeroProps = {
  locale: Locale
  hero: HomeHeroContent
  chrome: ChromeContent
  microcopy: MicrocopyContent
}

function HomeHero({ locale, hero, chrome, microcopy }: HomeHeroProps) {
  return (
    <>
      <HomeHeroMobile
        className="lg:hidden"
        locale={locale}
        hero={hero}
        chrome={chrome}
        microcopy={microcopy}
      />
      <HomeHeroDesktop
        className="hidden lg:flex"
        locale={locale}
        hero={hero}
        chrome={chrome}
        microcopy={microcopy}
      />
    </>
  )
}

export { HomeHero }
export type { HomeHeroProps }
