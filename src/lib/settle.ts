export type SettleMember = {
  id: string
  name: string
}

export type SettleExpense = {
  paidById: string
  shares: Array<{ memberId: string; amountCents: number }>
}

export type Transfer = {
  fromId: string
  fromName: string
  toId: string
  toName: string
  amountCents: number
}

export type Balance = {
  memberId: string
  name: string
  netCents: number
}

/** Net balance: positive = owed money, negative = owes money. */
export function computeBalances(
  members: SettleMember[],
  expenses: SettleExpense[]
): Balance[] {
  const nets = new Map<string, number>()
  const names = new Map<string, string>()

  for (const member of members) {
    nets.set(member.id, 0)
    names.set(member.id, member.name)
  }

  for (const expense of expenses) {
    if (!nets.has(expense.paidById)) continue
    const paidTotal = expense.shares.reduce((sum, share) => sum + share.amountCents, 0)
    nets.set(expense.paidById, (nets.get(expense.paidById) ?? 0) + paidTotal)

    for (const share of expense.shares) {
      if (!nets.has(share.memberId)) continue
      nets.set(share.memberId, (nets.get(share.memberId) ?? 0) - share.amountCents)
    }
  }

  return members.map((member) => ({
    memberId: member.id,
    name: member.name,
    netCents: nets.get(member.id) ?? 0,
  }))
}

/** Greedy minimize transfers from debtors to creditors. */
export function simplifyTransfers(balances: Balance[]): Transfer[] {
  const debtors = balances
    .filter((entry) => entry.netCents < 0)
    .map((entry) => ({ ...entry, remaining: -entry.netCents }))
    .sort((a, b) => b.remaining - a.remaining)

  const creditors = balances
    .filter((entry) => entry.netCents > 0)
    .map((entry) => ({ ...entry, remaining: entry.netCents }))
    .sort((a, b) => b.remaining - a.remaining)

  const transfers: Transfer[] = []
  let i = 0
  let j = 0

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i]
    const creditor = creditors[j]
    // Indexed access is defined while i/j stay in range; keep loop indexes in sync.
    const amount = Math.min(debtor.remaining, creditor.remaining)
    if (amount > 0) {
      transfers.push({
        fromId: debtor.memberId,
        fromName: debtor.name,
        toId: creditor.memberId,
        toName: creditor.name,
        amountCents: amount,
      })
      debtor.remaining -= amount
      creditor.remaining -= amount
    }

    if (debtor.remaining === 0) i += 1
    if (creditor.remaining === 0) j += 1
  }

  return transfers
}

export function transferSentence(transfer: Transfer, currency: string): string {
  let amount: string
  try {
    amount = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(transfer.amountCents / 100)
  } catch {
    amount = `${(transfer.amountCents / 100).toFixed(2)} ${currency}`
  }

  return `${transfer.fromName} owes ${transfer.toName} ${amount}`
}

export function settleRoom(
  members: SettleMember[],
  expenses: SettleExpense[],
  currency: string
): { balances: Balance[]; transfers: Transfer[]; sentences: string[] } {
  const balances = computeBalances(members, expenses)
  const transfers = simplifyTransfers(balances)
  return {
    balances,
    transfers,
    sentences: transfers.map((transfer) => transferSentence(transfer, currency)),
  }
}
