import { useEffect, useState } from "react"
import {
  Show,
  SignInButton,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/tanstack-react-start"
import { createFileRoute, useRouterState } from "@tanstack/react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"

import { RedeemHeroDesktop } from "@/components/redeem/redeem-hero-desktop"
import { RedeemHeroMobile } from "@/components/redeem/redeem-hero-mobile"
import {
  homeDisplayClassName,
  homeLabelClassName,
  homePillClassName,
} from "@/components/home/home-styles"
import { Spinner } from "@/components/ui/spinner"
import { getContent, isLocale } from "@/content"
import type { Locale, MicrocopyContent, RedeemContent } from "@/content/types"
import { getRedeemProductConfig } from "@/lib/redeem-products"
import type { RedeemProductConfig } from "@/lib/redeem-products"
import { cn } from "@/lib/utils"
import { getEventByCode, getRedeemStatus, redeemCredits } from "@/server/redeem"
import type {
  RedeemCreditsResult,
  RedeemedCode,
  RedeemEventPublic,
  RedeemStatusResult,
} from "@/server/redeem"

type RedeemSearch = {
  code?: string
}

type RedeemHeroTone = "onLight" | "onDark"
type RedeemHeroSurface = "mobile" | "desktop"

export const Route = createFileRoute("/$locale/redeem")({
  validateSearch: (search: Record<string, unknown>): RedeemSearch => {
    const code =
      typeof search.code === "string" && search.code.trim().length > 0
        ? search.code.trim()
        : undefined
    return { code }
  },
  loaderDeps: ({ search }) => ({ code: search.code }),
  loader: async ({ deps }): Promise<RedeemEventPublic | null> => {
    if (!deps.code) {
      return null
    }
    return getEventByCode({ data: { code: deps.code } })
  },
  head: ({ params, loaderData }) => {
    const locale = isLocale(params.locale) ? params.locale : "en"
    const { meta, redeem } = getContent(locale)
    const titleBase = loaderData
      ? getRedeemProductConfig(loaderData.product).titleKey
      : null
    const productTitle = titleBase
      ? redeem.products[titleBase].title
      : redeem.metaTitle

    return {
      meta: [
        { title: `${productTitle} — ${meta.title}` },
        { name: "description", content: meta.description },
        { name: "robots", content: "noindex, nofollow" },
      ],
    }
  },
  component: RedeemPage,
})

const revealBaseClassName =
  "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500"

const onDarkLabelClassName =
  "border-on-dark/25 bg-on-dark/10 text-on-dark inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wider uppercase backdrop-blur-sm"

function RedeemPage() {
  const { locale, content: siteContent } = Route.useRouteContext()
  const { code } = Route.useSearch()
  const event = Route.useLoaderData()
  const content = siteContent.redeem
  const { microcopy } = siteContent

  const mediaSrcs = siteContent.home.hero.mediaSrcs
  const mediaAlt = siteContent.home.hero.mediaAlt

  if (!code) {
    return (
      <RedeemHeroShell
        locale={locale}
        microcopy={microcopy}
        mediaSrcs={mediaSrcs}
        mediaAlt={mediaAlt}
        redeemContent={content}
        left={(tone) => (
          <StatusPanel
            title={content.missingCodeTitle}
            body={content.missingCodeBody}
            tone={tone}
          />
        )}
        leftFooter={(tone) => (
          <RedeemFootNote text={content.poweredBy} tone={tone} />
        )}
        right={(surface) =>
          surface === "desktop" ? (
            <RightStatus
              title={content.missingCodeTitle}
              body={content.missingCodeBody}
            />
          ) : null
        }
      />
    )
  }

  if (!event) {
    return (
      <RedeemHeroShell
        locale={locale}
        microcopy={microcopy}
        mediaSrcs={mediaSrcs}
        mediaAlt={mediaAlt}
        redeemContent={content}
        left={(tone) => (
          <StatusPanel
            title={content.invalidTitle}
            body={content.invalidBody}
            tone={tone}
          />
        )}
        leftFooter={(tone) => (
          <RedeemFootNote text={content.poweredBy} tone={tone} />
        )}
        right={(surface) =>
          surface === "desktop" ? (
            <RightStatus
              title={content.invalidTitle}
              body={content.invalidBody}
            />
          ) : null
        }
      />
    )
  }

  if (!event.active) {
    return (
      <RedeemHeroShell
        locale={locale}
        microcopy={microcopy}
        mediaSrcs={mediaSrcs}
        mediaAlt={mediaAlt}
        redeemContent={content}
        left={(tone) => (
          <StatusPanel
            title={content.inactiveTitle}
            body={content.inactiveBody}
            tone={tone}
          />
        )}
        leftFooter={(tone) => (
          <RedeemFootNote text={content.poweredBy} tone={tone} />
        )}
        right={(surface) =>
          surface === "desktop" ? (
            <RightStatus
              title={content.inactiveTitle}
              body={content.inactiveBody}
            />
          ) : null
        }
      />
    )
  }

  const product = getRedeemProductConfig(event.product)
  const productCopy = content.products[product.titleKey]

  return (
    <RedeemHeroShell
      locale={locale}
      microcopy={microcopy}
      mediaSrcs={mediaSrcs}
      mediaAlt={mediaAlt}
      redeemContent={content}
      left={(tone) => (
        <ProductInfo
          content={content}
          product={product}
          productCopy={productCopy}
          eventName={event.name}
          tone={tone}
        />
      )}
      leftFooter={(tone) => <RedeemSteps content={content} tone={tone} />}
      right={() => <RedeemAction code={code} content={content} />}
    />
  )
}

const redeemFrostedPanelClassName = cn(
  "rounded-3xl border border-on-dark/15 bg-black/55 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-md sm:p-6",
  "supports-backdrop-filter:bg-black/40"
)

function ProductInfo({
  content,
  product,
  productCopy,
  eventName,
  tone = "onLight",
}: {
  content: RedeemContent
  product: RedeemProductConfig
  productCopy: { title: string; blurb: string }
  eventName: string
  tone?: RedeemHeroTone
}) {
  const onDark = tone === "onDark"

  return (
    <div className="flex w-full max-w-xl flex-col gap-5 lg:max-w-none">
      <div
        className={cn(
          revealBaseClassName,
          "flex flex-wrap items-center gap-x-5 gap-y-3"
        )}
      >
        {product.logos.map((logo) => (
          <img
            key={logo.alt}
            src={logo.dark}
            alt={logo.alt}
            className={cn(
              "h-6 w-auto",
              onDark
                ? "brightness-0 invert"
                : "brightness-0 invert dark:invert-0"
            )}
          />
        ))}
        <span className={onDark ? onDarkLabelClassName : homeLabelClassName}>
          {content.eventLabel}
        </span>
      </div>

      <h1
        className={cn(
          homeDisplayClassName,
          "text-4xl leading-[0.95] sm:text-5xl md:text-5xl",
          onDark && "text-on-dark",
          revealBaseClassName,
          "motion-safe:delay-75"
        )}
      >
        {eventName}
      </h1>

      <div
        className={cn(
          "flex flex-col gap-2",
          revealBaseClassName,
          "motion-safe:delay-150"
        )}
      >
        <p
          className={cn(
            "font-display text-lg font-semibold tracking-tight md:text-xl",
            onDark ? "text-on-dark" : "text-foreground"
          )}
        >
          {productCopy.title}
        </p>
        <p
          className={cn(
            "text-base leading-relaxed md:text-lg",
            onDark ? "text-on-dark/80" : "text-muted-foreground"
          )}
        >
          {productCopy.blurb}
        </p>
      </div>
    </div>
  )
}

function RedeemAccountChrome({
  content,
  returnUrl,
}: {
  content: RedeemContent
  returnUrl: string
}) {
  const { user } = useUser()
  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses[0]?.emailAddress

  return (
    <div className="flex flex-wrap items-center gap-3">
      <UserButton />
      {email ? (
        <p className="text-on-dark/70 min-w-0 flex-1 truncate text-sm">
          {content.signedInAs.replace("{email}", email)}
        </p>
      ) : null}
      <SignOutButton redirectUrl={returnUrl}>
        <button
          type="button"
          className="text-on-dark/70 hover:text-on-dark focus-visible:ring-ring/50 shrink-0 rounded-sm text-sm font-medium underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:outline-none"
        >
          {content.signOutCta}
        </button>
      </SignOutButton>
    </div>
  )
}

function RedeemAction({
  code,
  content,
}: {
  code: string
  content: RedeemContent
}) {
  const returnUrl = useRouterState({
    select: (state) => state.location.href,
  })

  return (
    <div className="flex w-full flex-col">
      <div
        className={cn(
          redeemFrostedPanelClassName,
          "flex w-full flex-col gap-5",
          revealBaseClassName,
          "motion-safe:delay-150"
        )}
      >
        <Show when="signed-out">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <h2 className="font-display text-on-dark text-2xl font-semibold tracking-tight md:text-3xl">
                {content.signInCta}
              </h2>
              <p className="text-on-dark/70 text-sm leading-relaxed md:text-base">
                {content.signInPrompt}
              </p>
            </div>
            <SignInButton
              mode="modal"
              forceRedirectUrl={returnUrl}
              signUpForceRedirectUrl={returnUrl}
            >
              <button type="button" className={cn(homePillClassName, "w-fit")}>
                {content.signInCta}
                <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
              </button>
            </SignInButton>
          </div>
        </Show>

        <Show when="signed-in">
          <RedeemAccountChrome content={content} returnUrl={returnUrl} />
          <RedeemClaimPanel code={code} content={content} onDark />
        </Show>
      </div>
    </div>
  )
}

function RedeemSteps({
  content,
  tone = "onLight",
}: {
  content: RedeemContent
  tone?: RedeemHeroTone
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

function RedeemHeroShell({
  locale,
  microcopy,
  mediaSrcs,
  mediaAlt,
  redeemContent,
  left,
  right,
  leftFooter,
}: {
  locale: Locale
  microcopy: MicrocopyContent
  mediaSrcs: ReadonlyArray<string>
  mediaAlt: string
  redeemContent: RedeemContent
  left: (tone: RedeemHeroTone) => React.ReactNode
  right: (surface: RedeemHeroSurface) => React.ReactNode
  leftFooter?: (tone: RedeemHeroTone) => React.ReactNode
}) {
  return (
    <div className="relative">
      <a
        href="#redeem-main"
        className="bg-background text-foreground focus-visible:ring-ring sr-only rounded-sm px-3 py-2 text-sm font-medium focus-visible:not-sr-only focus-visible:absolute focus-visible:top-2 focus-visible:left-2 focus-visible:z-50 focus-visible:ring-2"
      >
        {microcopy.skipToContent}
      </a>
      <div id="redeem-main">
        <RedeemHeroMobile
          className="lg:hidden"
          locale={locale}
          microcopy={microcopy}
          mediaSrcs={mediaSrcs}
          mediaAlt={mediaAlt}
          redeemContent={redeemContent}
          left={left("onDark")}
          right={right("mobile")}
          leftFooter={leftFooter?.("onDark")}
        />
        <RedeemHeroDesktop
          className="hidden lg:flex"
          locale={locale}
          microcopy={microcopy}
          mediaSrcs={mediaSrcs}
          mediaAlt={mediaAlt}
          redeemContent={redeemContent}
          left={left("onLight")}
          right={right("desktop")}
          leftFooter={leftFooter?.("onLight")}
        />
      </div>
    </div>
  )
}

function StatusPanel({
  title,
  body,
  tone = "onLight",
}: {
  title: string
  body: string
  tone?: RedeemHeroTone
}) {
  const onDark = tone === "onDark"

  return (
    <div className="flex max-w-xl flex-col gap-4">
      <h1
        className={cn(
          "font-display text-3xl font-semibold tracking-tight md:text-4xl",
          onDark ? "text-on-dark" : "text-foreground"
        )}
      >
        {title}
      </h1>
      <p
        className={cn(
          "max-w-md text-base leading-relaxed md:text-lg",
          onDark ? "text-on-dark/80" : "text-muted-foreground"
        )}
      >
        {body}
      </p>
    </div>
  )
}

function RightStatus({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex w-full flex-col gap-3">
      <h2 className="font-display text-on-dark text-2xl font-semibold tracking-tight md:text-3xl">
        {title}
      </h2>
      <p className="text-on-dark/70 text-sm leading-relaxed md:text-base">
        {body}
      </p>
    </div>
  )
}

function RedeemFootNote({
  text,
  tone = "onLight",
}: {
  text: string
  tone?: RedeemHeroTone
}) {
  const onDark = tone === "onDark"

  return (
    <div
      className={cn(
        "flex items-center gap-2 border-t pt-6",
        onDark ? "border-on-dark/20" : "border-border/60"
      )}
    >
      <span className="bg-purple size-1.5 rounded-full" aria-hidden />
      <p
        className={cn(
          "text-xs font-medium tracking-wide",
          onDark ? "text-on-dark/70" : "text-muted-foreground"
        )}
      >
        {text}
      </p>
    </div>
  )
}

function RedeemClaimPanel({
  code,
  content,
  onDark = false,
}: {
  code: string
  content: RedeemContent
  onDark?: boolean
}) {
  const { user, isLoaded } = useUser()
  const [pending, setPending] = useState(false)
  const [checking, setChecking] = useState(true)
  const [result, setResult] = useState<
    RedeemCreditsResult | RedeemStatusResult | null
  >(null)

  const bodyClassName = onDark ? "text-on-dark" : "text-foreground"

  useEffect(() => {
    if (!isLoaded) {
      return
    }

    if (!user) {
      setChecking(false)
      return
    }

    let cancelled = false
    setChecking(true)

    void getRedeemStatus({ data: { code } })
      .then((next) => {
        if (cancelled) {
          return
        }
        setResult(next)
      })
      .catch(() => {
        if (!cancelled) {
          setResult(null)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setChecking(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [code, isLoaded, user?.id])

  async function onClaim() {
    setPending(true)
    try {
      const next = await redeemCredits({ data: { code } })
      setResult(next)
      if (next.status === "ok" && !next.alreadyRedeemed) {
        const heading =
          next.codes.length === 1 ? content.yourCode : content.yourCodes
        toast.success(heading)
      }
    } catch {
      toast.error(content.soldOutBody)
    } finally {
      setPending(false)
    }
  }

  if (checking || !isLoaded) {
    return (
      <div className="flex items-center gap-2">
        <Spinner className={onDark ? "text-on-dark" : undefined} />
      </div>
    )
  }

  if (result?.status === "ok") {
    return (
      <div className="flex flex-col gap-4">
        {result.alreadyRedeemed ? (
          <p className={cn(bodyClassName, "text-sm")}>
            {content.alreadyRedeemed}
          </p>
        ) : null}
        <CodesList codes={result.codes} content={content} onDark={onDark} />
      </div>
    )
  }

  if (result?.status === "not_eligible") {
    return (
      <StatusInline
        title={content.notEligibleTitle}
        body={content.notEligibleBody}
        onDark={onDark}
      />
    )
  }

  if (result?.status === "sold_out") {
    return (
      <StatusInline
        title={content.soldOutTitle}
        body={content.soldOutBody}
        onDark={onDark}
      />
    )
  }

  if (result?.status === "no_verified_email") {
    return (
      <StatusInline
        title={content.noVerifiedEmailTitle}
        body={content.noVerifiedEmailBody}
        onDark={onDark}
      />
    )
  }

  if (result?.status === "inactive" || result?.status === "invalid") {
    return (
      <StatusInline
        title={
          result.status === "inactive"
            ? content.inactiveTitle
            : content.invalidTitle
        }
        body={
          result.status === "inactive"
            ? content.inactiveBody
            : content.invalidBody
        }
        onDark={onDark}
      />
    )
  }

  if (result?.status === "unauthenticated") {
    return null
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        className={cn(homePillClassName, "w-fit")}
        disabled={pending}
        onClick={() => void onClaim()}
      >
        {pending ? (
          <>
            <Spinner />
            {content.claiming}
          </>
        ) : (
          <>
            {content.claimCta}
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
          </>
        )}
      </button>
    </div>
  )
}

function CodesList({
  codes,
  content,
  onDark = false,
}: {
  codes: RedeemedCode[]
  content: RedeemContent
  onDark?: boolean
}) {
  const heading = codes.length === 1 ? content.yourCode : content.yourCodes

  return (
    <div className="flex flex-col gap-3">
      <h2
        className={cn(
          "font-display text-lg font-semibold tracking-tight",
          onDark ? "text-on-dark" : "text-foreground"
        )}
      >
        {heading}
      </h2>
      <ul className="flex flex-col gap-2">
        {codes.map((entry) => (
          <li
            key={`${entry.pool}-${entry.code}`}
            className={cn(
              "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4",
              "lg:rounded-2xl lg:border lg:p-4",
              onDark
                ? "lg:border-on-dark/15 lg:bg-on-dark/10 lg:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                : "lg:bg-background/70 lg:border-border/60"
            )}
          >
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <span
                className={cn(
                  "text-xs font-medium tracking-wide uppercase",
                  onDark ? "text-on-dark/60" : "text-muted-foreground"
                )}
              >
                {content.poolLabels[entry.pool]}
              </span>
              <code
                className={cn(
                  "truncate font-mono text-sm",
                  onDark ? "text-on-dark" : "text-foreground"
                )}
              >
                {entry.code}
              </code>
            </div>
            <CodeAction code={entry.code} content={content} />
          </li>
        ))}
      </ul>
    </div>
  )
}

const codeActionClassName = cn(
  homePillClassName,
  "h-9 w-full shrink-0 px-4 text-xs sm:w-auto"
)

function getHttpUrl(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) {
    return null
  }

  try {
    const url = new URL(trimmed)
    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.href
    }
    return null
  } catch {
    // Bare host paths (e.g. chatgpt.com/codex/p/...) are openable links.
    try {
      const url = new URL(`https://${trimmed}`)
      if (!url.hostname.includes(".")) {
        return null
      }
      return url.href
    } catch {
      return null
    }
  }
}

function CodeAction({
  code,
  content,
}: {
  code: string
  content: RedeemContent
}) {
  const href = getHttpUrl(code)

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={codeActionClassName}
      >
        {content.openCode}
      </a>
    )
  }

  return <CopyButton code={code} content={content} />
}

function CopyButton({
  code,
  content,
}: {
  code: string
  content: RedeemContent
}) {
  const [copied, setCopied] = useState(false)

  async function onCopy() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    toast.success(content.copied)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      type="button"
      className={codeActionClassName}
      onClick={() => void onCopy()}
    >
      {copied ? content.copied : content.copyCode}
    </button>
  )
}

function StatusInline({
  title,
  body,
  onDark = false,
}: {
  title: string
  body: string
  onDark?: boolean
}) {
  return (
    <div className="flex flex-col gap-2">
      <h2
        className={cn(
          "font-medium",
          onDark ? "text-on-dark" : "text-foreground"
        )}
      >
        {title}
      </h2>
      <p
        className={cn(
          "text-sm",
          onDark ? "text-on-dark/70" : "text-muted-foreground"
        )}
      >
        {body}
      </p>
    </div>
  )
}
