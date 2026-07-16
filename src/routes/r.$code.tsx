import { Link, createFileRoute } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { SplitShell } from "@/components/split-shell"
import { formatCents } from "@/lib/money"
import { getRoomByCode } from "@/server/rooms"

export const Route = createFileRoute("/r/$code")({
  loader: async ({ params }) => {
    const room = await getRoomByCode({ data: { code: params.code } })
    if (!room) {
      throw new Error("Room not found")
    }
    return room
  },
  component: RoomPage,
  errorComponent: ({ error }) => (
    <SplitShell>
      <main id="main" className="space-y-4 py-10">
        <h1 className="font-display text-3xl font-semibold">Room missing</h1>
        <p className="text-muted-foreground">
          {error.message || "Check the code and try again."}
        </p>
        <Button render={<Link to="/" />}>Back home</Button>
      </main>
    </SplitShell>
  ),
})

function RoomPage() {
  const room = Route.useLoaderData()
  const owed = room.balances
    .filter((entry) => entry.netCents > 0)
    .sort((a, b) => b.netCents - a.netCents)
  const topOwed = owed.length > 0 ? owed[0] : undefined

  return (
    <SplitShell>
      <main id="main" className="flex flex-1 flex-col gap-8">
        <section className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Room {room.code}
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            {room.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            {room.members.map((member) => member.name).join(" · ")} · {room.currency}
          </p>
        </section>

        <section className="rounded-2xl bg-primary px-5 py-5 text-primary-foreground motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500">
          <p className="text-xs uppercase tracking-[0.16em] text-primary-foreground/70">
            Balances
          </p>
          {topOwed ? (
            <p className="mt-2 font-display text-2xl font-semibold">
              {topOwed.name} is owed {formatCents(topOwed.netCents, room.currency)}
            </p>
          ) : (
            <p className="mt-2 font-display text-2xl font-semibold">All settled</p>
          )}
          <ul className="mt-4 space-y-1 text-sm text-primary-foreground/85">
            {room.sentences.length > 0 ? (
              room.sentences.slice(0, 3).map((sentence) => (
                <li key={sentence}>{sentence}</li>
              ))
            ) : (
              <li>No open balances yet.</li>
            )}
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              render={<Link to="/r/$code/new" params={{ code: room.code }} />}
            >
              Add expense
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              render={<Link to="/r/$code/settle" params={{ code: room.code }} />}
            >
              Settle
            </Button>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-end justify-between gap-3">
            <h2 className="font-display text-xl font-semibold">Expenses</h2>
            <p className="text-xs text-muted-foreground">{room.expenses.length} total</p>
          </div>
          {room.expenses.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nothing yet. Add the first cost from dinner, rides, or tickets.
            </p>
          ) : (
            <ul className="divide-y divide-border/80">
              {room.expenses.map((expense) => (
                <li key={expense.id} className="flex items-start justify-between gap-3 py-3">
                  <div>
                    <p className="font-medium">{expense.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {expense.paidByName} paid ·{" "}
                      {expense.shares.map((share) => share.memberName).join(", ")}
                    </p>
                  </div>
                  <p className="font-display text-base font-semibold tabular-nums">
                    {formatCents(expense.amountCents, room.currency)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </SplitShell>
  )
}
