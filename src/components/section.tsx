import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

type SectionProps = ComponentProps<"section"> & {
  /** Constrain to narrow reading width (~720px) instead of content max. */
  narrow?: boolean
}

function Section({
  className,
  children,
  narrow = false,
  ...props
}: SectionProps) {
  return (
    <section className={cn("section-y page-gutter w-full", className)} {...props}>
      <div
        className={cn(
          "mx-auto w-full",
          narrow ? "max-w-narrow" : "max-w-content"
        )}
      >
        {children}
      </div>
    </section>
  )
}

export { Section }
export type { SectionProps }
