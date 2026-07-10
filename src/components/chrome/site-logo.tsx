import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

type LogoMarkProps = ComponentProps<"svg"> & {
  title?: string
}

function LogoMark({ className, title, ...props }: LogoMarkProps) {
  const decorative = title === undefined

  return (
    <svg
      viewBox="0 0 32 32"
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : title}
      className={cn("size-8", className)}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={2.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 6.5 7.5 25.5" />
        <path d="M16 6.5 24.5 25.5" />
        <path d="M11.7 16.5h8.6" />
      </g>
      <g fill="currentColor">
        <circle cx="16" cy="6.5" r="3.1" />
        <circle cx="11.7" cy="16.5" r="2.5" />
        <circle cx="20.3" cy="16.5" r="2.5" />
        <circle cx="7.5" cy="25.5" r="3.1" />
        <circle cx="24.5" cy="25.5" r="3.1" />
      </g>
    </svg>
  )
}

/** Dark ink for light surfaces; light ink for dark surfaces. */
const LOCKUP = {
  onLight: "/brand/ailabs-dark.svg",
  onDark: "/brand/ailabs-light.svg",
} as const

type LogoVariant = "mark" | "lockup"

type SiteLogoProps = {
  variant?: LogoVariant
  /** Force the light-ink lockup (dark surface), ignoring theme. */
  onDark?: boolean
  /** Force the dark-ink lockup (light surface), ignoring theme. */
  onLight?: boolean
  className?: string
}

function SiteLogo({
  variant = "lockup",
  onDark = false,
  onLight = false,
  className,
}: SiteLogoProps) {
  if (variant === "mark") {
    return (
      <LogoMark
        className={cn(
          onDark ? "text-on-dark" : "text-foreground",
          "size-8",
          className
        )}
      />
    )
  }

  const imgClassName = cn("h-7 w-auto", className)

  if (onDark) {
    return (
      <img
        src={LOCKUP.onDark}
        alt="Ai Labs"
        className={imgClassName}
      />
    )
  }

  if (onLight) {
    return (
      <img
        src={LOCKUP.onLight}
        alt="Ai Labs"
        className={imgClassName}
      />
    )
  }

  return (
    <span className="inline-grid">
      <img
        src={LOCKUP.onLight}
        alt="Ai Labs"
        className={cn(imgClassName, "col-start-1 row-start-1 dark:hidden")}
      />
      <img
        src={LOCKUP.onDark}
        alt=""
        aria-hidden
        className={cn(
          imgClassName,
          "col-start-1 row-start-1 hidden dark:block"
        )}
      />
    </span>
  )
}

export { SiteLogo, LogoMark }
