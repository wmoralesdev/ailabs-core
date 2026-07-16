import { useState } from "react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SplitShell } from "@/components/split-shell"
import { CURRENCIES } from "@/lib/currencies"
import { createRoom, getRoomByCode } from "@/server/rooms"

export const Route = createFileRoute("/")({
  component: LandingPage,
})

function LandingPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<"create" | "join">("create")
  const [name, setName] = useState("")
  const [currency, setCurrency] = useState("USD")
  const [membersText, setMembersText] = useState("")
  const [joinCode, setJoinCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onCreate(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    setPending(true)
    try {
      const members = membersText
        .split(/[\n,]/)
        .map((entry) => entry.trim())
        .filter(Boolean)
      const result = await createRoom({
        data: { name, currency, members },
      })
      await navigate({ to: "/r/$code", params: { code: result.code } })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create room")
    } finally {
      setPending(false)
    }
  }

  async function onJoin(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    setPending(true)
    try {
      const room = await getRoomByCode({ data: { code: joinCode } })
      if (!room) {
        setError("No room with that code")
        return
      }
      await navigate({ to: "/r/$code", params: { code: room.code } })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not join room")
    } finally {
      setPending(false)
    }
  }

  return (
    <SplitShell bare>
      <main id="main" className="flex flex-1 flex-col justify-center gap-10 py-8">
        <section className="space-y-4 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500">
          <p className="font-display text-5xl font-semibold tracking-tight sm:text-6xl">
            Split
          </p>
          <h1 className="max-w-sm text-lg text-muted-foreground">
            Trip costs with friends. Fast entry, clear balances. No accounts.
          </h1>
        </section>

        <section className="space-y-4 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:duration-700">
          <div className="flex gap-2">
            <Button
              type="button"
              size="lg"
              variant={mode === "create" ? "default" : "outline"}
              className="flex-1"
              onClick={() => {
                setMode("create")
                setError(null)
              }}
            >
              Create room
            </Button>
            <Button
              type="button"
              size="lg"
              variant={mode === "join" ? "default" : "outline"}
              className="flex-1"
              onClick={() => {
                setMode("join")
                setError(null)
              }}
            >
              Join code
            </Button>
          </div>

          {mode === "create" ? (
            <form onSubmit={onCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="room-name">Trip name</Label>
                <Input
                  id="room-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Beach week"
                  required
                  autoComplete="off"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={currency}
                  onValueChange={(value) => {
                    if (value) setCurrency(value)
                  }}
                >
                  <SelectTrigger id="currency" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((entry) => (
                      <SelectItem key={entry.code} value={entry.code}>
                        {entry.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="members">People</Label>
                <textarea
                  id="members"
                  value={membersText}
                  onChange={(event) => setMembersText(event.target.value)}
                  placeholder={"Walter\nDaniela\nSaul"}
                  required
                  rows={4}
                  className="flex w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
                />
                <p className="text-xs text-muted-foreground">
                  One name per line. At least two people.
                </p>
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={pending}>
                {pending ? "Creating…" : "Create room"}
              </Button>
            </form>
          ) : (
            <form onSubmit={onJoin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="join-code">Room code</Label>
                <Input
                  id="join-code"
                  value={joinCode}
                  onChange={(event) => setJoinCode(event.target.value.toUpperCase())}
                  placeholder="AB12CD"
                  required
                  autoComplete="off"
                  className="font-display text-lg tracking-[0.2em]"
                />
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={pending}>
                {pending ? "Joining…" : "Join room"}
              </Button>
            </form>
          )}

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
        </section>
      </main>
    </SplitShell>
  )
}
