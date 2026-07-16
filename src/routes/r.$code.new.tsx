import { useEffect, useState } from "react"
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { getRememberedMemberId, rememberMemberId } from "@/lib/member-storage"
import { parseAmountToCents } from "@/lib/money"
import { addExpense, getRoomByCode } from "@/server/rooms"
import { parseTicketImage } from "@/server/ocr"

export const Route = createFileRoute("/r/$code/new")({
  loader: async ({ params }) => {
    const room = await getRoomByCode({ data: { code: params.code } })
    if (!room) throw new Error("Room not found")
    return room
  },
  component: NewExpensePage,
})

function NewExpensePage() {
  const room = Route.useLoaderData()
  const navigate = useNavigate()
  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [paidById, setPaidById] = useState("")
  const [shareIds, setShareIds] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [ocrPending, setOcrPending] = useState(false)

  useEffect(() => {
    const remembered = getRememberedMemberId(room.code)
    const initial =
      remembered && room.members.some((member) => member.id === remembered)
        ? remembered
        : (room.members[0]?.id ?? "")
    setPaidById(initial)
    setShareIds(room.members.map((member) => member.id))
  }, [room.code, room.members])

  function toggleShare(memberId: string, checked: boolean) {
    setShareIds((current) => {
      if (checked) return [...new Set([...current, memberId])]
      return current.filter((id) => id !== memberId)
    })
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)

    const amountCents = parseAmountToCents(amount)
    if (!amountCents) {
      setError("Enter a valid amount")
      return
    }
    if (!paidById) {
      setError("Pick who paid")
      return
    }
    if (shareIds.length === 0) {
      setError("Pick who shares this expense")
      return
    }

    setPending(true)
    try {
      rememberMemberId(room.code, paidById)
      await addExpense({
        data: {
          code: room.code,
          title: title.trim() || "Expense",
          amountCents,
          paidById,
          shareMemberIds: shareIds,
        },
      })
      await navigate({ to: "/r/$code", params: { code: room.code } })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save expense")
    } finally {
      setPending(false)
    }
  }

  async function onScan(file: File | null) {
    if (!file) return
    setError(null)
    setOcrPending(true)
    try {
      const buffer = await file.arrayBuffer()
      const bytes = new Uint8Array(buffer)
      let binary = ""
      for (const byte of bytes) binary += String.fromCharCode(byte)
      const imageBase64 = btoa(binary)

      const draft = await parseTicketImage({
        data: {
          imageBase64,
          mimeType: file.type || "image/jpeg",
        },
      })

      if (draft.title) setTitle(draft.title)
      if (draft.amountCents) setAmount((draft.amountCents / 100).toFixed(2))
    } catch (err) {
      setError(err instanceof Error ? err.message : "OCR failed")
    } finally {
      setOcrPending(false)
    }
  }

  return (
    <SplitShell>
      <main id="main" className="flex flex-1 flex-col gap-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              {room.name}
            </p>
            <h1 className="font-display text-3xl font-semibold">Add expense</h1>
          </div>
          <Button variant="outline" render={<Link to="/r/$code" params={{ code: room.code }} />}>
            Back
          </Button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              inputMode="decimal"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="0.00"
              required
              className="font-display h-14 text-3xl font-semibold tabular-nums"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">What for</Label>
            <Input
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Dinner, taxi, tickets…"
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paid-by">Who paid</Label>
            <Select
              value={paidById}
              onValueChange={(value) => {
                if (value) setPaidById(value)
              }}
            >
              <SelectTrigger id="paid-by" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {room.members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium">Who shares</legend>
            <div className="space-y-2">
              {room.members.map((member) => {
                const checked = shareIds.includes(member.id)
                return (
                  <label
                    key={member.id}
                    className="flex items-center gap-3 rounded-lg border border-border/80 bg-card/70 px-3 py-2"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(value) => toggleShare(member.id, value === true)}
                    />
                    <span>{member.name}</span>
                  </label>
                )
              })}
            </div>
          </fieldset>

          <div className="space-y-2">
            <Label htmlFor="ticket">Scan ticket (optional)</Label>
            <Input
              id="ticket"
              type="file"
              accept="image/*"
              capture="environment"
              disabled={ocrPending}
              onChange={(event) => void onScan(event.target.files?.[0] ?? null)}
            />
            <p className="text-xs text-muted-foreground">
              {ocrPending
                ? "Reading ticket…"
                : "Uses Mistral OCR to prefill title and amount. You confirm before saving."}
            </p>
          </div>

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <Button type="submit" size="lg" className="w-full" disabled={pending || ocrPending}>
            {pending ? "Saving…" : "Save expense"}
          </Button>
        </form>
      </main>
    </SplitShell>
  )
}
