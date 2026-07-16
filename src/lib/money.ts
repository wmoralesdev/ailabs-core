export function parseAmountToCents(raw: string): number | null {
  const normalized = raw.trim().replace(",", ".")
  if (!normalized) return null
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null

  const parts = normalized.split(".")
  const whole = parts[0] ?? "0"
  const fraction = parts[1] ?? ""
  const cents =
    Number.parseInt(whole, 10) * 100 +
    Number.parseInt(fraction.padEnd(2, "0"), 10)

  if (!Number.isFinite(cents) || cents <= 0) return null
  return cents
}

export function formatCents(cents: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(cents / 100)
  } catch {
    return `${(cents / 100).toFixed(2)} ${currency}`
  }
}

export function equalSplitCents(totalCents: number, memberIds: string[]): Map<string, number> {
  if (memberIds.length === 0) {
    throw new Error("Need at least one member to split")
  }
  if (totalCents < 0) {
    throw new Error("Amount cannot be negative")
  }

  const base = Math.floor(totalCents / memberIds.length)
  let remainder = totalCents - base * memberIds.length
  const shares = new Map<string, number>()

  for (const memberId of memberIds) {
    const extra = remainder > 0 ? 1 : 0
    if (remainder > 0) remainder -= 1
    shares.set(memberId, base + extra)
  }

  return shares
}
