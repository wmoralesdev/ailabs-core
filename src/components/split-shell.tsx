import { Link } from "@tanstack/react-router"
import type { ReactNode } from "react"

export function SplitShell({
  children,
  bare = false,
}: {
  children: ReactNode
  bare?: boolean
}) {
  return (
    <div className="relative min-h-dvh">
      <div className="pointer-events-none absolute inset-0 split-grain opacity-40" />
      <div className="relative mx-auto flex min-h-dvh w-full max-w-lg flex-col px-4 pb-10 pt-5 sm:px-6">
        {!bare ? (
          <header className="mb-8 flex items-center justify-between">
            <Link
              to="/"
              className="font-display text-xl font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80"
            >
              Split
            </Link>
            <p className="text-xs text-muted-foreground">split.ailabs.sv</p>
          </header>
        ) : null}
        {children}
      </div>
    </div>
  )
}
