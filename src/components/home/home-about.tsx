import { HugeiconsIcon } from "@hugeicons/react"
import { Globe02Icon } from "@hugeicons/core-free-icons"

import type { HomeAboutContent } from "@/content"
import { HomeMediaCarousel } from "@/components/home/home-media-carousel"
import { cn } from "@/lib/utils"
import {
  homeCardClassName,
  homeLabelClassName,
  homeShellClassName,
} from "@/components/home/home-styles"

type HomeAboutProps = {
  about: HomeAboutContent
}

function HomeAbout({ about }: HomeAboutProps) {
  return (
    <section id="about" className={cn(homeShellClassName, "scroll-mt-8")}>
      <p className={cn(homeLabelClassName, "mb-4 md:mb-6")}>{about.label}</p>

      <div className="grid gap-8 lg:grid-cols-[0.4fr_0.6fr] lg:items-center lg:gap-12">
        <div className="flex flex-col gap-8">
          <div className="bg-lavender text-graphite inline-flex size-12 items-center justify-center rounded-full">
            <HugeiconsIcon icon={Globe02Icon} strokeWidth={2} className="size-5" />
          </div>
          <p className="text-muted-foreground max-w-md text-base leading-relaxed md:text-lg">
            {about.body}
          </p>
          <div className="grid grid-cols-2 gap-6">
            {about.stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-foreground text-3xl font-semibold tracking-tight md:text-4xl">
                  {stat.value}
                </p>
                <p className="text-muted-foreground mt-1 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <p className="font-display text-foreground text-2xl font-semibold tracking-tight text-balance md:text-3xl lg:text-4xl lg:leading-snug">
            {about.bold}
          </p>

          <div className="flex flex-col gap-3">
            <p className={cn(homeLabelClassName)}>{about.bridgeLabel}</p>
            <dl className="border-border grid gap-x-6 gap-y-3 border-t pt-4 sm:grid-cols-3">
              {about.bridge.map((item) => (
                <div key={item.title} className="flex flex-col gap-1">
                  <dt className="text-foreground text-sm font-semibold">
                    {item.title}
                  </dt>
                  <dd className="text-muted-foreground text-sm leading-relaxed">
                    {item.body}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <div
        className={cn(
          homeCardClassName,
          "relative mt-10 aspect-[16/9] min-h-64 w-full md:mt-14 md:min-h-80"
        )}
      >
        <HomeMediaCarousel
          images={about.mediaSrcs}
          alt={about.mediaAlt}
          intervalMs={5200}
        />
      </div>
    </section>
  )
}

export { HomeAbout }
