import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const homePillClassName = cn(
  buttonVariants({ variant: "default" }),
  "h-11 rounded-full px-5 text-sm font-medium",
  "motion-safe:duration-150 motion-safe:hover:-translate-y-px motion-safe:hover:shadow-lift"
)

const homePillOutlineClassName = cn(
  buttonVariants({ variant: "outline" }),
  "h-10 rounded-full px-4 text-sm font-medium",
  "motion-safe:duration-150 motion-safe:hover:-translate-y-px"
)

const homeCardClassName =
  "overflow-hidden rounded-[2rem] border border-border bg-card text-card-foreground"

const homeShellClassName = "page-gutter mx-auto w-full max-w-[90rem]"

const homeSectionGapClassName = "flex flex-col gap-10 md:gap-14"

const homeLabelClassName =
  "inline-flex w-fit items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase"

const homeDisplayClassName =
  "font-display text-foreground text-4xl font-semibold tracking-tight uppercase sm:text-5xl md:text-6xl"

const homeHeroNavLinkClassName =
  "text-on-dark/85 hover:text-on-dark text-sm font-medium underline decoration-transparent decoration-2 underline-offset-8 hover:decoration-purple-soft motion-safe:transition-[color,text-decoration-color] motion-safe:duration-150 focus-visible:ring-ring/50 rounded-sm focus-visible:ring-2 focus-visible:outline-none"

const homeHeroChromeHeightClassName = "h-14"

export {
  homePillClassName,
  homePillOutlineClassName,
  homeCardClassName,
  homeShellClassName,
  homeSectionGapClassName,
  homeLabelClassName,
  homeDisplayClassName,
  homeHeroNavLinkClassName,
  homeHeroChromeHeightClassName,
}
