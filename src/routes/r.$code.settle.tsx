import { Link, createFileRoute } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { SplitShell } from "@/components/split-shell"
import { formatCents } from "@/lib/money"
import { getRoomByCode } from "@/server/rooms"

export const Route = createFileRoute("/r/$code/settle")({
  loader: async ({ params }) => {
    const room = await getRoomByCode({ data: { code: params.code } })
    if (!room) throw new Error("Room not found")
    return room
  },
  component: SettlePage,
})

function SettlePage() {
  const room = Route.useLoaderData()

  return (
    <SplitShell>
      <main id="main" className="flex flex-1 flex-col gap-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              {room.name}
            </p>
            <h1 className="font-display text-3xl font-semibold">Settle up</h1>
          </div>
          <Button variant="outline" render={<Link to="/r/$code" params={{ code: room.code }} />}>
            Back
          </Button>
        </div>

        <section className="space-y-3">
          <h2 className="font-display text-lg font-semibold">Who owes whom</h2>
          {room.sentences.length === 0 ? (
            <p className="text-sm text-muted-foreground">Everyone is even.</p>
          ) : (
            <ul className="space-y-3">
              {room.sentences.map((sentence) => (
                <li
                  key={sentence}
                  className="rounded-xl bg-primary px-4 py-3 font-display text-lg font-medium text-primary-foreground"
                >
                  {sentence}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-lg font-semibold">Net balances</h2>
          <ul className="divide-y divide-border/80">
            {room.balances
              .slice()
              .sort((a, b) => b.netCents - a.netCents)
              .map((balance) => (
                <li key={balance.memberId} className="flex items-center justify-between py-3">
                  <span>{balance.name}</span>
                  <span className="font-display tabular-nums font-semibold">
                    {balance.netCents === 0
                      ? "even"
                      : balance.netCents > 0
                        ? `is owed ${formatCents(balance.netCents, room.currency)}`
                        : `owes ${formatCents(-balance.netCents, room.currency)}`}
                  </span>
                </li>
              ))}
          </ul>
        </section>
      </main>
    </SplitShell>
  )
}
