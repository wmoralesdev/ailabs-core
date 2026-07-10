import { useState } from "react"
import {
  Show,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/tanstack-react-start"
import { createFileRoute } from "@tanstack/react-router"
import { toast } from "sonner"

import { MainCard } from "@/components/chrome/main-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { getContent, isLocale } from "@/content"
import type { RedeemContent } from "@/content/types"
import { getRedeemProductConfig } from "@/lib/redeem-products"
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
  const { locale } = Route.useRouteContext()
  const { code } = Route.useSearch()
  const event = Route.useLoaderData()
  const content = getContent(locale).redeem

  if (!code) {
    return (
      <RedeemShell>
        <StatusCard
          title={content.missingCodeTitle}
          body={content.missingCodeBody}
        />
      </RedeemShell>
    )
  }

  if (!event) {
    return (
      <RedeemShell>
        <StatusCard
          title={content.invalidTitle}
          body={content.invalidBody}
        />
      </RedeemShell>
    )
  }

  if (!event.active) {
    return (
      <RedeemShell>
        <StatusCard
          title={content.inactiveTitle}
          body={content.inactiveBody}
        />
      </RedeemShell>
    )
  }

  const product = getRedeemProductConfig(event.product)
  const productCopy = content.products[product.titleKey]

  return (
    <RedeemShell>
      <Card className="mx-auto w-full max-w-lg text-sm">
        <CardHeader className="gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {product.logos.map((logo) => (
              <span key={logo.alt} className="inline-flex items-center gap-2">
                <img
                  src={logo.light}
                  alt={logo.alt}
                  className="h-8 w-auto dark:hidden"
                />
                <img
                  src={logo.dark}
                  alt=""
                  aria-hidden
                  className="hidden h-8 w-auto dark:block"
                />
              </span>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <Badge variant="secondary" className="w-fit">
              {content.eventLabel}: {event.name}
            </Badge>
            <CardTitle className="font-display text-2xl font-semibold tracking-tight">
              {productCopy.title}
            </CardTitle>
            <CardDescription className="text-base">
              {productCopy.blurb}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Show when="signed-out">
            <p className="text-muted-foreground">{content.signInPrompt}</p>
            <SignInButton mode="modal">
              <Button size="lg" className="w-full sm:w-auto">
                {content.signInCta}
              </Button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <RedeemClaimPanel code={code} content={content} />
          </Show>
        </CardContent>
        <CardFooter className="justify-end border-t pt-(--card-spacing)">
          <Show when="signed-in">
            <UserButton />
          </Show>
        </CardFooter>
      </Card>
    </RedeemShell>
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
      <p className="text-muted-foreground text-sm">{content.signInPrompt}</p>
      <Button
        size="lg"
        className="w-full sm:w-auto"
        disabled={pending}
        onClick={() => void onClaim()}
      >
        {pending ? (
          <>
            <Spinner />
            {content.claiming}
          </>
        ) : (
          content.claimCta
        )}
      </Button>
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
            className="bg-muted/40 flex flex-col gap-2 rounded-md p-3 sm:flex-row sm:items-center sm:justify-between"
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

function RedeemShell({ children }: { children: React.ReactNode }) {
  return (
    <MainCard>
      <section className="section-y page-gutter flex flex-1 items-start justify-center py-16">
        {children}
      </section>
    </MainCard>
  )
}

function StatusCard({ title, body }: { title: string; body: string }) {
  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader>
        <CardTitle className="font-display text-2xl font-semibold tracking-tight">
          {title}
        </CardTitle>
        <CardDescription className="text-base">{body}</CardDescription>
      </CardHeader>
    </Card>
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
