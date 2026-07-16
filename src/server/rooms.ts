import { createServerFn } from "@tanstack/react-start"
import { equalSplitCents } from "@/lib/money"
import { prisma } from "@/lib/prisma"
import { generateRoomCode, normalizeRoomCode } from "@/lib/room-code"
import { settleRoom } from "@/lib/settle"

export type RoomMember = {
  id: string
  name: string
}

export type RoomExpense = {
  id: string
  title: string
  amountCents: number
  paidById: string
  paidByName: string
  createdAt: string
  shares: Array<{ memberId: string; memberName: string; amountCents: number }>
}

export type RoomDetail = {
  id: string
  code: string
  name: string
  currency: string
  members: RoomMember[]
  expenses: RoomExpense[]
  balances: Array<{ memberId: string; name: string; netCents: number }>
  sentences: string[]
}

function createRoomInput(data: unknown): {
  name: string
  currency: string
  members: string[]
} {
  if (typeof data !== "object" || data === null) {
    throw new Error("Invalid room payload")
  }

  const record = data as Record<string, unknown>
  const name = typeof record.name === "string" ? record.name.trim() : ""
  const currency =
    typeof record.currency === "string" ? record.currency.trim().toUpperCase() : ""
  const membersRaw = Array.isArray(record.members) ? record.members : []
  const members = membersRaw
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim())
    .filter(Boolean)

  if (!name) throw new Error("Room name is required")
  if (!/^[A-Z]{3}$/.test(currency)) throw new Error("Currency must be a 3-letter code")
  if (members.length < 2) throw new Error("Add at least two people")

  const unique = [...new Set(members.map((entry) => entry.toLowerCase()))]
  if (unique.length !== members.length) throw new Error("Member names must be unique")

  return { name, currency, members }
}

function codeInput(data: unknown): { code: string } {
  if (typeof data !== "object" || data === null || !("code" in data)) {
    throw new Error("Invalid code")
  }

  const rawCode = data.code
  if (typeof rawCode !== "string") {
    throw new Error("Invalid code")
  }

  const code = normalizeRoomCode(rawCode)
  if (code.length < 4) throw new Error("Invalid code")
  return { code }
}

function addExpenseInput(data: unknown): {
  code: string
  title: string
  amountCents: number
  paidById: string
  shareMemberIds: string[]
  customShares?: Array<{ memberId: string; amountCents: number }>
} {
  if (typeof data !== "object" || data === null) {
    throw new Error("Invalid expense payload")
  }

  const record = data as Record<string, unknown>
  const code = normalizeRoomCode(String(record.code ?? ""))
  const title = typeof record.title === "string" ? record.title.trim() : ""
  const amountCents =
    typeof record.amountCents === "number" ? record.amountCents : Number.NaN
  const paidById = typeof record.paidById === "string" ? record.paidById : ""
  const shareMemberIds = Array.isArray(record.shareMemberIds)
    ? record.shareMemberIds.filter((id): id is string => typeof id === "string")
    : []
  const customShares = Array.isArray(record.customShares)
    ? record.customShares
        .filter(
          (entry): entry is { memberId: string; amountCents: number } =>
            typeof entry === "object" &&
            entry !== null &&
            typeof (entry as { memberId: unknown }).memberId === "string" &&
            typeof (entry as { amountCents: unknown }).amountCents === "number"
        )
        .map((entry) => ({
          memberId: entry.memberId,
          amountCents: entry.amountCents,
        }))
    : undefined

  if (!code) throw new Error("Room code is required")
  if (!title) throw new Error("Title is required")
  if (!Number.isInteger(amountCents) || amountCents <= 0) {
    throw new Error("Amount must be a positive integer (cents)")
  }
  if (!paidById) throw new Error("Who paid is required")
  if (shareMemberIds.length === 0 && (!customShares || customShares.length === 0)) {
    throw new Error("Pick who shares this expense")
  }

  return { code, title, amountCents, paidById, shareMemberIds, customShares }
}

async function loadRoomDetail(code: string): Promise<RoomDetail | null> {
  const room = await prisma.room.findUnique({
    where: { code },
    include: {
      members: { orderBy: { createdAt: "asc" } },
      expenses: {
        orderBy: { createdAt: "desc" },
        include: {
          paidBy: true,
          shares: { include: { member: true } },
        },
      },
    },
  })

  if (!room) return null

  const members = room.members.map((member) => ({ id: member.id, name: member.name }))
  const expenses: RoomExpense[] = room.expenses.map((expense) => ({
    id: expense.id,
    title: expense.title,
    amountCents: expense.amountCents,
    paidById: expense.paidById,
    paidByName: expense.paidBy.name,
    createdAt: expense.createdAt.toISOString(),
    shares: expense.shares.map((share) => ({
      memberId: share.memberId,
      memberName: share.member.name,
      amountCents: share.amountCents,
    })),
  }))

  const settled = settleRoom(
    members,
    expenses.map((expense) => ({
      paidById: expense.paidById,
      shares: expense.shares.map((share) => ({
        memberId: share.memberId,
        amountCents: share.amountCents,
      })),
    })),
    room.currency
  )

  return {
    id: room.id,
    code: room.code,
    name: room.name,
    currency: room.currency,
    members,
    expenses,
    balances: settled.balances,
    sentences: settled.sentences,
  }
}

export const createRoom = createServerFn({ method: "POST" })
  .validator(createRoomInput)
  .handler(async ({ data }) => {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const code = generateRoomCode(6)
      try {
        const room = await prisma.room.create({
          data: {
            code,
            name: data.name,
            currency: data.currency,
            members: {
              create: data.members.map((name) => ({ name })),
            },
          },
          select: { code: true },
        })
        return { code: room.code }
      } catch {
        // Retry on rare code collision
      }
    }

    throw new Error("Could not create room code. Try again.")
  })

export const getRoomByCode = createServerFn({ method: "GET" })
  .validator(codeInput)
  .handler(async ({ data }): Promise<RoomDetail | null> => {
    return loadRoomDetail(data.code)
  })

export const addExpense = createServerFn({ method: "POST" })
  .validator(addExpenseInput)
  .handler(async ({ data }) => {
    const room = await prisma.room.findUnique({
      where: { code: data.code },
      include: { members: true },
    })

    if (!room) throw new Error("Room not found")

    const memberIds = new Set(room.members.map((member) => member.id))
    if (!memberIds.has(data.paidById)) throw new Error("Payer is not in this room")

    let shareEntries: Array<{ memberId: string; amountCents: number }>

    if (data.customShares && data.customShares.length > 0) {
      shareEntries = data.customShares
      const total = shareEntries.reduce((sum, entry) => sum + entry.amountCents, 0)
      if (total !== data.amountCents) {
        throw new Error("Custom shares must sum to the total amount")
      }
    } else {
      const uniqueShareIds = [...new Set(data.shareMemberIds)]
      for (const memberId of uniqueShareIds) {
        if (!memberIds.has(memberId)) throw new Error("Share member is not in this room")
      }
      const split = equalSplitCents(data.amountCents, uniqueShareIds)
      shareEntries = uniqueShareIds.map((memberId) => ({
        memberId,
        amountCents: split.get(memberId) ?? 0,
      }))
    }

    for (const entry of shareEntries) {
      if (!memberIds.has(entry.memberId)) {
        throw new Error("Share member is not in this room")
      }
      if (!Number.isInteger(entry.amountCents) || entry.amountCents < 0) {
        throw new Error("Invalid share amount")
      }
    }

    await prisma.expense.create({
      data: {
        roomId: room.id,
        title: data.title,
        amountCents: data.amountCents,
        paidById: data.paidById,
        shares: {
          create: shareEntries.map((entry) => ({
            memberId: entry.memberId,
            amountCents: entry.amountCents,
          })),
        },
      },
    })

    return loadRoomDetail(data.code)
  })
