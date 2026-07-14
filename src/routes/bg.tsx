import { createFileRoute } from "@tanstack/react-router"

import { ThemeToggle } from "@/components/chrome/theme-toggle"
import { BgStipple } from "@/components/bg/bg-stipple"

export const Route = createFileRoute("/bg")({
  head: () => ({
    meta: [
      { title: "Ai Labs — Background" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BackgroundPage,
})

function BackgroundPage() {
  return (
    <main className="bg-background text-foreground relative flex h-dvh w-screen items-center justify-center overflow-hidden">
      <BgStipple />

      <img
        src="/brand/ailabs-iso-dark.svg"
        alt="Ai Labs"
        className="relative z-10 h-28 w-auto md:h-40 dark:hidden"
      />
      <img
        src="/brand/ailabs-iso-light.svg"
        alt="Ai Labs"
        className="relative z-10 hidden h-28 w-auto md:h-40 dark:block"
      />

      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle
          labels={{
            cycle: "Cycle color theme",
            toLight: "Switch to light theme",
            toDark: "Switch to dark theme",
            toSystem: "Switch to system theme",
          }}
        />
      </div>
    </main>
  )
}
