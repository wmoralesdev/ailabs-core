import { useSyncExternalStore } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ComputerIcon,
  Moon02Icon,
  Sun03Icon,
} from "@hugeicons/core-free-icons"

import { useTheme } from "@/components/theme-provider"
import type { Theme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"

type ThemeToggleLabels = {
  cycle: string
  toLight: string
  toDark: string
  toSystem: string
}

type ThemeToggleProps = {
  labels: ThemeToggleLabels
}

const THEME_ORDER = ["light", "dark", "system"] as const satisfies readonly Theme[]

const THEME_ICON = {
  light: Sun03Icon,
  dark: Moon02Icon,
  system: ComputerIcon,
} as const

const NEXT_THEME_LABEL_KEY = {
  light: "toDark",
  dark: "toSystem",
  system: "toLight",
} as const satisfies Record<Theme, keyof ThemeToggleLabels>

function getNextTheme(theme: Theme): Theme {
  const index = THEME_ORDER.indexOf(theme)
  return THEME_ORDER[(index + 1) % THEME_ORDER.length] ?? "system"
}

function subscribeToNothing() {
  return () => {}
}

function ThemeToggle({ labels }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false
  )

  const current = mounted ? theme : "system"
  const next = getNextTheme(current)
  const ariaLabel = labels[NEXT_THEME_LABEL_KEY[current]]

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={ariaLabel}
      title={ariaLabel}
      onClick={() => setTheme(next)}
    >
      <HugeiconsIcon icon={THEME_ICON[current]} />
      <span className="sr-only">{labels.cycle}</span>
    </Button>
  )
}

export { ThemeToggle }
export type { ThemeToggleLabels, ThemeToggleProps }
