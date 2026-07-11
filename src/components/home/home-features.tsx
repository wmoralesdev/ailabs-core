import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"

import type { HomeFeaturesContent } from "@/content"
import { HomeMediaCarousel } from "@/components/home/home-media-carousel"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import {
  homeCardClassName,
  homeDisplayClassName,
  homeLabelClassName,
  homePillClassName,
  homeShellClassName,
} from "@/components/home/home-styles"

type HomeFeaturesProps = {
  features: HomeFeaturesContent
}

function canHover(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover)").matches
  )
}

function HomeFeatures({ features }: HomeFeaturesProps) {
  const defaultOpen = features.accordion[0]?.id ?? "academy"
  const [openValue, setOpenValue] = useState<string[]>([defaultOpen])

  const openItem = (id: string) => {
    setOpenValue((current) => (current[0] === id ? current : [id]))
  }

  return (
    <section id="pillars" className={cn(homeShellClassName, "scroll-mt-8")}>
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
        <p className={homeLabelClassName}>{features.label}</p>
        <h2 className={cn(homeDisplayClassName, "text-3xl sm:text-4xl md:text-5xl")}>
          {features.headline}
        </h2>
        <a href={features.cta.href} className={homePillClassName}>
          {features.cta.label}
          <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
        </a>
      </div>

      <div
        className={cn(
          homeCardClassName,
          "mt-10 grid overflow-hidden md:mt-14 lg:grid-cols-[0.42fr_0.58fr]"
        )}
      >
        <div className="relative min-h-72 lg:min-h-full">
          <HomeMediaCarousel
            images={features.showcaseImageSrcs}
            alt={features.showcaseImageAlt}
            intervalMs={5800}
          />
        </div>
        <div className="flex flex-col justify-center p-6 sm:p-8 md:p-10">
          <Accordion
            value={openValue}
            onValueChange={(next) => {
              if (next.length > 0) setOpenValue(next)
            }}
            className="rounded-none border-0"
          >
            {features.accordion.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border-border data-open:bg-transparent not-last:border-b"
                onMouseEnter={() => {
                  if (canHover()) openItem(item.id)
                }}
              >
                <AccordionTrigger className="px-0 py-4 text-base font-semibold hover:no-underline md:text-lg">
                  <span className="flex flex-col items-start gap-0.5">
                    <span>{item.title}</span>
                    <span className="text-muted-foreground text-sm font-normal">
                      {item.subtitle}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground px-0 text-sm leading-relaxed md:text-base">
                  <p>{item.body}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}

export { HomeFeatures }
