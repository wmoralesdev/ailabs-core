import { useState } from "react"
import {
  Show,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/tanstack-react-start"
import { Link, createFileRoute } from "@tanstack/react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"

import { SiteLogo } from "@/components/chrome/site-logo"
import { ThemeToggle } from "@/components/chrome/theme-toggle"
import { HomeHeroStipple } from "@/components/home/home-hero-stipple"
import {
  homeCardClassName,
  homeDisplayClassName,
  homeLabelClassName,
  homePillClassName,
  homeShellClassName,
} from "@/components/home/home-styles"
import { Button, buttonVariants } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { LOCALES, getContent, isLocale } from "@/content"
import type { Locale, MicrocopyContent, RedeemContent } from "@/content/types"
import {
  getRedeemProductConfig,
  type RedeemProductConfig,
} from "@/lib/redeem-products"
import { cn } from "@/lib/utils"
import {
  getEventByCode,
  redeemCredits,
  type RedeemCreditsResult,
  type RedeemedCode,
  type RedeemEventPublic,
} from "@/server/redeem"

type RedeemSearch = {
  code?: string
}

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

function RedeemPage() {
  const { locale, content: siteContent } = Route.useRouteContext()
  const { code } = Route.useSearch()
  const event = Route.useLoaderData()
  const content = siteContent.redeem
  const { microcopy } = siteContent

  if (!code) {
    return (
      <RedeemHeroShell
        locale={locale}
        microcopy={microcopy}
        productPanel={
          <ProductStatusPanel
            title={content.missingCodeTitle}
            body={content.missingCodeBody}
          />
        }
      >
        <StatusPanel
          title={content.missingCodeTitle}
          body={content.missingCodeBody}
        />
      </RedeemHeroShell>
    )
  }

  if (!event) {
    return (
      <RedeemHeroShell
        locale={locale}
        microcopy={microcopy}
        productPanel={
          <ProductStatusPanel
            title={content.invalidTitle}
            body={content.invalidBody}
          />
        }
      >
        <StatusPanel
          title={content.invalidTitle}
          body={content.invalidBody}
        />
      </RedeemHeroShell>
    )
  }

  if (!event.active) {
    return (
      <RedeemHeroShell
        locale={locale}
        microcopy={microcopy}
        productPanel={
          <ProductStatusPanel
            title={content.inactiveTitle}
            body={content.inactiveBody}
          />
        }
      >
        <StatusPanel
          title={content.inactiveTitle}
          body={content.inactiveBody}
        />
      </RedeemHeroShell>
    )
  }

  const product = getRedeemProductConfig(event.product)
  const productCopy = content.products[product.titleKey]

  return (
    <RedeemHeroShell
      locale={locale}
      microcopy={microcopy}
      productPanel={
        <ProductPanel
          event={event}
          product={product}
          productCopy={productCopy}
          eventLabel={content.eventLabel}
        />
      }
    >
      <div className="flex max-w-xl flex-col gap-5 py-6 md:py-10">
        <p className={homeLabelClassName}>{content.eventLabel}</p>
        <h1 className={cn(homeDisplayClassName, "leading-[0.95]")}>
          {productCopy.title}
        </h1>
        <p className="text-muted-foreground max-w-md text-base leading-relaxed md:text-lg">
          {productCopy.blurb}
        </p>

        <Show when="signed-out">
          <div className="flex flex-col gap-4">
            <p className="text-muted-foreground max-w-md text-sm leading-relaxed md:text-base">
              {content.signInPrompt}
            </p>
            <SignInButton mode="modal">
              <button type="button" className={cn(homePillClassName, "w-fit")}>
                {content.signInCta}
                <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
              </button>
            </SignInButton>
          </div>
        </Show>

        <Show when="signed-in">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <UserButton />
            </div>
            <RedeemClaimPanel code={code} content={content} />
          </div>
        </Show>
      </div>
    </RedeemHeroShell>
  )
}

function RedeemHeroShell({
  locale,
  microcopy,
  productPanel,
  children,
}: {
  locale: Locale
  microcopy: MicrocopyContent
  productPanel: React.ReactNode
  children: React.ReactNode
}) {
  const otherLocale =
    LOCALES.find((candidate) => candidate !== locale) ?? locale

  return (
    <section
      className={cn(
        homeShellClassName,
        "flex min-h-dvh flex-col pt-4 pb-10 md:pt-6 md:pb-14"
      )}
    >
      <a
        href="#redeem-main"
        className="bg-background text-foreground focus-visible:ring-ring sr-only rounded-sm px-3 py-2 text-sm font-medium focus-visible:not-sr-only focus-visible:absolute focus-visible:top-2 focus-visible:left-2 focus-visible:z-50 focus-visible:ring-2"
      >
        {microcopy.skipToContent}
      </a>

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-2 lg:grid-rows-1 lg:gap-5">
        <div
          className={cn(
            homeCardClassName,
            "home-hero-invert bg-surface-soft relative flex h-auto min-h-0 flex-col p-6 sm:p-8 md:p-10 lg:h-full",
            "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500"
          )}
        >
          <HomeHeroStipple />
          <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-between">
            <div className="flex items-center justify-between gap-4">
              <Link
                to="/$locale"
                params={{ locale }}
                aria-label="Ai Labs"
                className="focus-visible:ring-ring/50 rounded-sm focus-visible:ring-2 focus-visible:outline-none"
              >
                <SiteLogo variant="lockup" onDark className="dark:hidden" />
                <SiteLogo
                  variant="lockup"
                  onLight
                  className="hidden dark:block"
                />
              </Link>
            </div>

            <div id="redeem-main" className="flex min-h-0 flex-1 flex-col">
              {children}
            </div>
          </div>
        </div>

        <div
          className={cn(
            homeCardClassName,
            "bg-graphite relative flex h-auto min-h-[22rem] flex-col lg:h-full",
            "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:delay-100 motion-safe:duration-500"
          )}
        >
          <div
            className="absolute inset-0 bg-gradient-to-br from-purple/30 via-graphite to-graphite"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168_85%_70%_/_0.22),transparent_55%)]"
            aria-hidden
          />

          <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-8 md:p-10">
            <div className="flex items-center justify-end gap-1 [&_button]:text-on-dark [&_button]:hover:bg-on-dark/10 [&_button]:hover:text-on-dark">
              <ThemeToggle
                labels={{
                  cycle: microcopy.themeCycle,
                  toLight: microcopy.themeToLight,
                  toDark: microcopy.themeToDark,
                  toSystem: microcopy.themeToSystem,
                }}
              />
              <Link
                to="."
                params={{ locale: otherLocale }}
                search={(prev) => prev}
                aria-label={microcopy.languageSwitch}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "text-on-dark hover:bg-on-dark/10 hover:text-on-dark text-xs font-semibold tracking-wider uppercase"
                )}
              >
                {microcopy.languageSwitch}
              </Link>
            </div>

            {productPanel}
          </div>
        </div>
      </div>
    </section>
  )
}

function ProductPanel({
  event,
  product,
  productCopy,
  eventLabel,
}: {
  event: RedeemEventPublic
  product: RedeemProductConfig
  productCopy: { title: string; blurb: string }
  eventLabel: string
}) {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-6 rounded-3xl border border-on-dark/15 bg-on-dark/5 p-6 text-center shadow-elevated backdrop-blur-sm sm:p-8">
      <div className="flex flex-wrap items-center justify-center gap-4">
        {product.logos.map((logo) => (
          <img
            key={logo.alt}
            src={logo.dark}
            alt={logo.alt}
            className="h-10 w-auto brightness-0 invert"
          />
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-on-dark/70 text-xs font-semibold tracking-wider uppercase">
          {eventLabel}
        </p>
        <p className="font-display text-on-dark text-2xl font-semibold tracking-tight">
          {event.name}
        </p>
        <p className="text-on-dark/75 text-sm leading-relaxed">
          {productCopy.blurb}
        </p>
      </div>
    </div>
  )
}

function ProductStatusPanel({ title, body }: { title: string; body: string }) {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-3 rounded-3xl border border-on-dark/15 bg-on-dark/5 p-6 text-center shadow-elevated backdrop-blur-sm sm:p-8">
      <p className="font-display text-on-dark text-2xl font-semibold tracking-tight">
        {title}
      </p>
      <p className="text-on-dark/75 text-sm leading-relaxed">{body}</p>
    </div>
  )
}

function StatusPanel({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex max-w-xl flex-col gap-4 py-10 md:py-14">
      <h1 className={cn(homeDisplayClassName, "leading-[0.95]")}>{title}</h1>
      <p className="text-muted-foreground max-w-md text-base leading-relaxed md:text-lg">
        {body}
      </p>
    </div>
  )
}

function RedeemClaimPanel({
  code,
  content,
}: {
  code: string
  content: RedeemContent
}) {
  const { user } = useUser()
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState<RedeemCreditsResult | null>(null)

  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses[0]?.emailAddress

  async function onClaim() {
    setPending(true)
    try {
      const next = await redeemCredits({ data: { code } })
      setResult(next)
      if (next.status === "ok" && !next.alreadyRedeemed) {
        toast.success(content.yourCodes)
      }
    } catch {
      toast.error(content.soldOutBody)
    } finally {
      setPending(false)
    }
  }

  if (result?.status === "ok") {
    return (
      <div className="flex flex-col gap-4">
        {email ? (
          <p className="text-muted-foreground text-sm">
            {content.signedInAs.replace("{email}", email)}
          </p>
        ) : null}
        {result.alreadyRedeemed ? (
          <p className="text-sm">{content.alreadyRedeemed}</p>
        ) : null}
        <CodesList codes={result.codes} content={content} />
      </div>
    )
  }

  if (result?.status === "not_eligible") {
    return (
      <StatusInline
        title={content.notEligibleTitle}
        body={content.notEligibleBody}
      />
    )
  }

  if (result?.status === "sold_out") {
    return (
      <StatusInline
        title={content.soldOutTitle}
        body={content.soldOutBody}
      />
    )
  }

  if (result?.status === "no_verified_email") {
    return (
      <StatusInline
        title={content.noVerifiedEmailTitle}
        body={content.noVerifiedEmailBody}
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
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {email ? (
        <p className="text-muted-foreground text-sm">
          {content.signedInAs.replace("{email}", email)}
        </p>
      ) : null}
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
}: {
  codes: RedeemedCode[]
  content: RedeemContent
}) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-medium">{content.yourCodes}</h2>
      <ul className="flex flex-col gap-2">
        {codes.map((entry) => (
          <li
            key={`${entry.pool}-${entry.code}`}
            className="bg-background/70 border-border/60 flex flex-col gap-2 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                {content.poolLabels[entry.pool]}
              </span>
              <code className="truncate font-mono text-sm">{entry.code}</code>
            </div>
            <CopyButton code={entry.code} content={content} />
          </li>
        ))}
      </ul>
    </div>
  )
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
    <Button variant="outline" size="sm" onClick={() => void onCopy()}>
      {copied ? content.copied : content.copyCode}
    </Button>
  )
}

function StatusInline({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-medium">{title}</h2>
      <p className="text-muted-foreground text-sm">{body}</p>
    </div>
  )
}
