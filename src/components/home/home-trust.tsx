import {
  useLayoutEffect,
  useRef,
  useState,
  type ComponentType,
} from "react"

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

const trustLogoListClassName =
  "flex shrink-0 items-center gap-10 pr-10 md:gap-14 md:pr-14"

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
  repeat = 1,
}: {
  logos: HomeTrustContent["logos"]
  keyPrefix: string
  ariaHidden?: boolean
  wrap?: boolean
  repeat?: number
}) {
  const items = Array.from({ length: repeat }, (_, setIndex) =>
    logos.map((logo) => ({
      logo,
      key: `${keyPrefix}-${setIndex}-${logo.id}`,
    }))
  ).flat()

  return (
    <ul
      className={cn(
        trustLogoListClassName,
        wrap && "flex-wrap justify-center pr-0 md:pr-0"
      )}
      aria-hidden={ariaHidden || undefined}
    >
      {items.map(({ logo, key }) => (
        <li
          key={key}
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
  const marqueeRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLUListElement>(null)
  const [setsPerHalf, setSetsPerHalf] = useState(1)

  useLayoutEffect(() => {
    const marquee = marqueeRef.current
    const measure = measureRef.current
    if (!marquee || !measure) return

    const update = () => {
      const setWidth = measure.offsetWidth
      const containerWidth = marquee.clientWidth
      if (setWidth <= 0 || containerWidth <= 0) return
      // Each animated half must be at least as wide as the viewport strip.
      setSetsPerHalf(Math.max(1, Math.ceil(containerWidth / setWidth)))
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(marquee)
    ro.observe(measure)
    return () => ro.disconnect()
  }, [trust.logos])

  return (
    <section
      id="trust"
      aria-label={trust.label}
      className="py-6 md:py-8"
    >
      <div className={cn(homeShellClassName, "flex flex-col gap-5")}>
        <p className={homeLabelClassName}>{trust.label}</p>
        <div ref={marqueeRef} className="home-trust-marquee">
          <ul
            ref={measureRef}
            className={cn(trustLogoListClassName, "home-trust-marquee-measure")}
            aria-hidden="true"
          >
            {trust.logos.map((logo) => (
              <li key={`measure-${logo.id}`} className="flex items-center">
                <span className="flex items-center">
                  <TrustLogoMark id={logo.id} />
                </span>
              </li>
            ))}
          </ul>
          <div className="home-trust-marquee-track">
            <TrustLogoList
              logos={trust.logos}
              keyPrefix="a"
              repeat={setsPerHalf}
            />
            <TrustLogoList
              logos={trust.logos}
              keyPrefix="b"
              ariaHidden
              repeat={setsPerHalf}
            />
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
