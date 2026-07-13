import type { ComponentType } from "react"

import { ClaudeLogo } from "@/components/logos/claude"
import { CodexLogo } from "@/components/logos/codex"
import { CursorLogo } from "@/components/logos/cursor"
import { ElevenlabsLogo } from "@/components/logos/elevenlabs"
import { MistralLogo } from "@/components/logos/mistral"
import { NotionLogo } from "@/components/logos/notion"
import { OpenAILogo } from "@/components/logos/openai"
import {
  homeLabelClassName,
  homeShellClassName,
} from "@/components/home/home-styles"
import type { HomeTrustContent, TrustLogoId } from "@/content/types"
import { cn } from "@/lib/utils"

type ModeLogoProps = {
  className?: string
  variant?: "icon" | "wordmark"
  mode?: "light" | "dark"
}

const logoClassName = "h-7 w-auto shrink-0 text-foreground"

function ThemeAwareLogo({
  Logo,
  className,
}: {
  Logo: ComponentType<ModeLogoProps>
  className?: string
}) {
  return (
    <>
      <Logo
        className={cn(className, "dark:hidden")}
        mode="light"
        variant="icon"
      />
      <Logo
        className={cn(className, "hidden dark:block")}
        mode="dark"
        variant="icon"
      />
    </>
  )
}

function TrustLogoMark({ id }: { id: TrustLogoId }) {
  switch (id) {
    case "cursor":
      return <CursorLogo className={logoClassName} />
    case "codex":
      return <ThemeAwareLogo Logo={CodexLogo} className={logoClassName} />
    case "openai":
      return <ThemeAwareLogo Logo={OpenAILogo} className={logoClassName} />
    case "claude":
      return <ClaudeLogo className={logoClassName} />
    case "mistral":
      return <MistralLogo className={logoClassName} />
    case "elevenlabs":
      return <ThemeAwareLogo Logo={ElevenlabsLogo} className={logoClassName} />
    case "notion":
      return <NotionLogo className={logoClassName} />
    default: {
      const _exhaustive: never = id
      return _exhaustive
    }
  }
}

function TrustLogoList({
  logos,
  keyPrefix,
  ariaHidden = false,
  wrap = false,
}: {
  logos: HomeTrustContent["logos"]
  keyPrefix: string
  ariaHidden?: boolean
  wrap?: boolean
}) {
  return (
    <ul
      className={cn(
        "flex shrink-0 items-center gap-10 md:gap-14",
        wrap && "flex-wrap justify-center"
      )}
      aria-hidden={ariaHidden || undefined}
    >
      {logos.map((logo) => (
        <li
          key={`${keyPrefix}-${logo.id}`}
          className="flex items-center opacity-55 grayscale transition-opacity motion-safe:hover:opacity-90"
        >
          {!ariaHidden ? <span className="sr-only">{logo.name}</span> : null}
          <span aria-hidden="true" className="flex items-center">
            <TrustLogoMark id={logo.id} />
          </span>
        </li>
      ))}
    </ul>
  )
}

type HomeTrustProps = {
  trust: HomeTrustContent
}

function HomeTrust({ trust }: HomeTrustProps) {
  return (
    <section
      id="trust"
      aria-label={trust.label}
      className="py-6 md:py-8"
    >
      <div className={cn(homeShellClassName, "flex flex-col gap-5")}>
        <p className={homeLabelClassName}>{trust.label}</p>
        <div className="home-trust-marquee">
          <div className="home-trust-marquee-track">
            <TrustLogoList logos={trust.logos} keyPrefix="a" />
            <TrustLogoList logos={trust.logos} keyPrefix="b" ariaHidden />
          </div>
          <div className="home-trust-marquee-static">
            <TrustLogoList logos={trust.logos} keyPrefix="static" wrap />
          </div>
        </div>
      </div>
    </section>
  )
}

export { HomeTrust }
