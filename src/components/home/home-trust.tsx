import { SiteLogo } from "@/components/chrome/site-logo"
import type { HomeTrustContent } from "@/content"
import { cn } from "@/lib/utils"
import {
  homeCardClassName,
  homeDisplayClassName,
  homeLabelClassName,
  homeShellClassName,
} from "@/components/home/home-styles"

type HomeTrustProps = {
  trust: HomeTrustContent
}

function HomeTrust({ trust }: HomeTrustProps) {
  return (
    <section className={homeShellClassName}>
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
        <p className={homeLabelClassName}>{trust.label}</p>
        <h2
          className={cn(
            homeDisplayClassName,
            "text-3xl sm:text-4xl md:text-5xl"
          )}
        >
          {trust.headline}
        </h2>
      </div>

      <div className="mt-10 grid gap-4 md:mt-12 md:grid-cols-[0.25fr_0.5fr_0.25fr] md:gap-5">
        <article
          className={cn(
            homeCardClassName,
            "bg-surface-soft flex min-h-72 flex-col justify-between p-6 sm:p-7"
          )}
        >
          <p className="font-display text-foreground text-5xl font-semibold tracking-tight md:text-6xl">
            {trust.stat.value}
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
            {trust.stat.label}
          </p>
        </article>

        <article
          className={cn(
            homeCardClassName,
            "bg-card flex min-h-72 flex-col justify-between p-6 sm:p-8"
          )}
        >
          <span
            className="font-display text-purple text-5xl leading-none font-semibold"
            aria-hidden
          >
            “
          </span>
          <blockquote className="text-foreground mt-4 text-base leading-relaxed text-balance md:text-lg">
            {trust.quote}
          </blockquote>
          <p className="text-muted-foreground mt-6 text-sm font-medium">
            {trust.attribution}
          </p>
        </article>

        <article
          className={cn(homeCardClassName, "relative min-h-72 overflow-hidden")}
        >
          <img
            src={trust.portraitSrc}
            alt={trust.portraitAlt}
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-graphite/50 to-transparent" />
          <div className="relative z-10 p-5">
            <SiteLogo variant="lockup" onDark className="text-on-dark" />
          </div>
        </article>
      </div>
    </section>
  )
}

export { HomeTrust }
