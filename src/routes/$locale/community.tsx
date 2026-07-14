import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { createFileRoute } from "@tanstack/react-router"

import { RedeemHeroDesktop } from "@/components/redeem/redeem-hero-desktop"
import { RedeemHeroMobile } from "@/components/redeem/redeem-hero-mobile"
import {
  homeDisplayClassName,
  homeLabelClassName,
  homePillClassName,
} from "@/components/home/home-styles"
import { getContent, isLocale } from "@/content"
import type { CommunityContent, Locale, MicrocopyContent } from "@/content/types"
import { cn } from "@/lib/utils"

export const Route = createFileRoute("/$locale/community")({
  head: ({ params }) => {
    const locale = isLocale(params.locale) ? params.locale : "en"
    const { meta, community } = getContent(locale)

    return {
      meta: [
        { title: `${community.metaTitle} — ${meta.title}` },
        { name: "description", content: community.metaDescription },
      ],
    }
  },
  component: CommunityPage,
})

type CommunityHeroTone = "onLight" | "onDark"

const revealBaseClassName =
  "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500"

const onDarkLabelClassName =
  "border-on-dark/25 bg-on-dark/10 text-on-dark inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wider uppercase backdrop-blur-sm"

const communityFrostedPanelClassName = cn(
  "rounded-3xl border border-on-dark/15 bg-black/55 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md sm:p-5",
  "supports-backdrop-filter:bg-black/40"
)

function WhatsAppMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      fill="currentColor"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413" />
    </svg>
  )
}

function CommunityPage() {
  const { locale, content: siteContent } = Route.useRouteContext()
  const content = siteContent.community
  const { microcopy } = siteContent
  const mediaSrcs = siteContent.home.hero.mediaSrcs
  const mediaAlt = siteContent.home.hero.mediaAlt

  return (
    <CommunityHeroShell
      locale={locale}
      microcopy={microcopy}
      mediaSrcs={mediaSrcs}
      mediaAlt={mediaAlt}
      qrContent={content}
      left={(tone) => <CommunityInfo content={content} tone={tone} />}
      leftFooter={(tone) => <CommunitySteps content={content} tone={tone} />}
      right={() => <CommunityJoinAction content={content} />}
    />
  )
}

function CommunityHeroShell({
  locale,
  microcopy,
  mediaSrcs,
  mediaAlt,
  qrContent,
  left,
  right,
  leftFooter,
}: {
  locale: Locale
  microcopy: MicrocopyContent
  mediaSrcs: ReadonlyArray<string>
  mediaAlt: string
  qrContent: CommunityContent
  left: (tone: CommunityHeroTone) => React.ReactNode
  right: () => React.ReactNode
  leftFooter?: (tone: CommunityHeroTone) => React.ReactNode
}) {
  return (
    <div className="relative">
      <a
        href="#community-main"
        className="bg-background text-foreground focus-visible:ring-ring sr-only rounded-sm px-3 py-2 text-sm font-medium focus-visible:not-sr-only focus-visible:absolute focus-visible:top-2 focus-visible:left-2 focus-visible:z-50 focus-visible:ring-2"
      >
        {microcopy.skipToContent}
      </a>
      <div id="community-main">
        <RedeemHeroMobile
          className="lg:hidden"
          locale={locale}
          microcopy={microcopy}
          mediaSrcs={mediaSrcs}
          mediaAlt={mediaAlt}
          qrContent={qrContent}
          left={left("onDark")}
          right={right()}
          leftFooter={leftFooter?.("onDark")}
        />
        <RedeemHeroDesktop
          className="hidden lg:flex"
          locale={locale}
          microcopy={microcopy}
          mediaSrcs={mediaSrcs}
          mediaAlt={mediaAlt}
          qrContent={qrContent}
          left={left("onLight")}
          right={right()}
          leftFooter={leftFooter?.("onLight")}
        />
      </div>
    </div>
  )
}

function CommunityInfo({
  content,
  tone = "onLight",
}: {
  content: CommunityContent
  tone?: CommunityHeroTone
}) {
  const onDark = tone === "onDark"

  return (
    <div className="flex w-full max-w-xl flex-col gap-5 lg:max-w-none">
      <span
        className={cn(
          revealBaseClassName,
          onDark ? onDarkLabelClassName : homeLabelClassName
        )}
      >
        {content.label}
      </span>

      <h1
        className={cn(
          homeDisplayClassName,
          "text-4xl leading-[0.95] sm:text-5xl md:text-5xl",
          onDark && "text-on-dark",
          revealBaseClassName,
          "motion-safe:delay-75"
        )}
      >
        {content.headline}
      </h1>

      <p
        className={cn(
          "max-w-md text-base leading-relaxed md:text-lg",
          onDark ? "text-on-dark/80" : "text-muted-foreground",
          revealBaseClassName,
          "motion-safe:delay-150"
        )}
      >
        {content.body}
      </p>
    </div>
  )
}

function CommunityJoinAction({ content }: { content: CommunityContent }) {
  return (
    <div className="flex w-full flex-col">
      <div
        className={cn(
          communityFrostedPanelClassName,
          "flex w-full flex-col gap-3",
          revealBaseClassName,
          "motion-safe:delay-150"
        )}
      >
        <p className="text-on-dark/80 text-sm leading-relaxed md:text-base">
          {content.joinPrompt}
        </p>
        <a
          href={content.joinHref}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            homePillClassName,
            "h-12 w-full justify-center gap-2.5 text-base",
            "motion-safe:active:scale-[0.98]"
          )}
        >
          <WhatsAppMark className="size-5 shrink-0" />
          {content.joinCta}
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            strokeWidth={2}
            className="size-4 shrink-0 opacity-80"
          />
        </a>
        <p className="text-on-dark/55 text-center text-xs leading-relaxed tracking-wide">
          {content.joinHint}
        </p>
      </div>
    </div>
  )
}

function CommunitySteps({
  content,
  tone = "onLight",
}: {
  content: CommunityContent
  tone?: CommunityHeroTone
}) {
  const onDark = tone === "onDark"

  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-t pt-6",
        onDark ? "border-on-dark/20" : "border-border/60"
      )}
    >
      <p
        className={cn(
          "text-xs font-semibold tracking-wider uppercase",
          onDark ? "text-on-dark/70" : "text-muted-foreground"
        )}
      >
        {content.howItWorksLabel}
      </p>
      <ol
        className={cn(
          "grid gap-5 sm:grid-cols-3 sm:gap-0 sm:divide-x",
          onDark ? "sm:divide-on-dark/20" : "sm:divide-border/60"
        )}
      >
        {content.steps.map((step, index) => (
          <li
            key={step.title}
            className="flex flex-col gap-1.5 sm:px-5 sm:first:pl-0 sm:last:pr-0"
          >
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-semibold",
                  onDark
                    ? "border-on-dark/30 bg-on-dark/10 text-on-dark"
                    : "border-purple/50 bg-purple/10 text-purple"
                )}
              >
                {index + 1}
              </span>
              <span
                className={cn(
                  "text-sm font-medium",
                  onDark ? "text-on-dark" : "text-foreground"
                )}
              >
                {step.title}
              </span>
            </div>
            <p
              className={cn(
                "text-xs leading-relaxed",
                onDark ? "text-on-dark/70" : "text-muted-foreground"
              )}
            >
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </div>
  )
}
