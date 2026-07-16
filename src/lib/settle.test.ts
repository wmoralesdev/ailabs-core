import { describe, expect, it } from "vitest"
import { computeBalances, settleRoom, simplifyTransfers } from "./settle"

describe("settle", () => {
  const members = [
    { id: "w", name: "Walter" },
    { id: "d", name: "Daniela" },
    { id: "s", name: "Saul" },
  ]

  it("nets who is owed after equal split of one bill", () => {
    const balances = computeBalances(members, [
      {
        paidById: "w",
        shares: [
          { memberId: "w", amountCents: 20000 },
          { memberId: "d", amountCents: 10000 },
          { memberId: "s", amountCents: 10000 },
        ],
      },
    ])

    expect(balances.find((b) => b.memberId === "w")?.netCents).toBe(20000)
    expect(balances.find((b) => b.memberId === "d")?.netCents).toBe(-10000)
    expect(balances.find((b) => b.memberId === "s")?.netCents).toBe(-10000)
  })

  it("produces Tricount-style owed sentences", () => {
    const { sentences, transfers } = settleRoom(
      members,
      [
        {
          paidById: "w",
          shares: [
            { memberId: "w", amountCents: 20000 },
            { memberId: "d", amountCents: 10000 },
            { memberId: "s", amountCents: 10000 },
          ],
        },
      ],
      "USD"
    )

    expect(transfers).toHaveLength(2)
    expect(sentences).toEqual(
      expect.arrayContaining([
        "Daniela owes Walter $100.00",
        "Saul owes Walter $100.00",
      ])
    )
  })

  it("cancels mutual debts into a single transfer", () => {
    const transfers = simplifyTransfers([
      { memberId: "a", name: "Ana", netCents: 5000 },
      { memberId: "b", name: "Ben", netCents: -5000 },
    ])

    expect(transfers).toEqual([
      {
        fromId: "b",
        fromName: "Ben",
        toId: "a",
        toName: "Ana",
        amountCents: 5000,
      },
    ])
  })

  it("returns no transfers when everyone is even", () => {
    const { transfers, sentences } = settleRoom(
      members,
      [
        {
          paidById: "w",
          shares: [
            { memberId: "w", amountCents: 1000 },
            { memberId: "d", amountCents: 1000 },
            { memberId: "s", amountCents: 1000 },
          ],
        },
        {
          paidById: "d",
          shares: [
            { memberId: "w", amountCents: 1000 },
            { memberId: "d", amountCents: 1000 },
            { memberId: "s", amountCents: 1000 },
          ],
        },
        {
          paidById: "s",
          shares: [
            { memberId: "w", amountCents: 1000 },
            { memberId: "d", amountCents: 1000 },
            { memberId: "s", amountCents: 1000 },
          ],
        },
      ],
      "USD"
    )

    expect(transfers).toHaveLength(0)
    expect(sentences).toHaveLength(0)
  })
})
