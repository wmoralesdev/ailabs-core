import { auth, clerkClient } from "@clerk/tanstack-react-start/server"
import { createServerFn } from "@tanstack/react-start"
import { Prisma } from "@/generated/prisma/client"
import type { Pool, Product } from "@/generated/prisma/client"
import { prisma } from "@/lib/prisma"
import { normalizeEmail, poolsForProduct } from "@/lib/redeem-products"

export type RedeemEventPublic = {
  id: string
  name: string
  product: Product
  active: boolean
}

export type RedeemedCode = {
  pool: Pool
  code: string
}

export type RedeemCreditsResult =
  | { status: "ok"; codes: RedeemedCode[]; alreadyRedeemed: boolean }
  | { status: "unauthenticated" }
  | { status: "invalid" }
  | { status: "inactive" }
  | { status: "not_eligible" }
  | { status: "sold_out" }
  | { status: "no_verified_email" }

function codeInput(data: unknown): { code: string } {
  if (
    typeof data !== "object" ||
    data === null ||
    !("code" in data) ||
    typeof (data as { code: unknown }).code !== "string"
  ) {
    throw new Error("Invalid code")
  }

  const code = (data as { code: string }).code.trim()
  if (!code) {
    throw new Error("Invalid code")
  }

  return { code }
}

async function getVerifiedEmail(userId: string): Promise<string | null> {
  const client = clerkClient()
  const user = await client.users.getUser(userId)
  const primaryId = user.primaryEmailAddressId
  const primary = user.emailAddresses.find((entry) => entry.id === primaryId)
  const verified =
    primary ??
    user.emailAddresses.find((entry) =>
      entry.verification?.status === "verified"
    )

  if (!verified || verified.verification?.status !== "verified") {
    return null
  }

  return normalizeEmail(verified.emailAddress)
}

function mapCodes(
  codes: Array<{ pool: Pool; code: string }>
): RedeemedCode[] {
  return codes.map((entry) => ({ pool: entry.pool, code: entry.code }))
}

export const getEventByCode = createServerFn({ method: "GET" })
  .validator(codeInput)
  .handler(async ({ data }): Promise<RedeemEventPublic | null> => {
    const event = await prisma.event.findUnique({
      where: { id: data.code },
      select: {
        id: true,
        name: true,
        product: true,
        active: true,
      },
    })

    return event
  })

export const redeemCredits = createServerFn({ method: "POST" })
  .validator(codeInput)
  .handler(async ({ data }): Promise<RedeemCreditsResult> => {
    const { isAuthenticated, userId } = await auth()
    if (!isAuthenticated || !userId) {
      return { status: "unauthenticated" }
    }

    const event = await prisma.event.findUnique({
      where: { id: data.code },
      select: {
        id: true,
        product: true,
        active: true,
      },
    })

    if (!event) {
      return { status: "invalid" }
    }

    if (!event.active) {
      return { status: "inactive" }
    }

    const email = await getVerifiedEmail(userId)
    if (!email) {
      return { status: "no_verified_email" }
    }

    const eligible = await prisma.eligibleEmail.findUnique({
      where: {
        eventId_email: {
          eventId: event.id,
          email,
        },
      },
      select: { id: true },
    })

    if (!eligible) {
      return { status: "not_eligible" }
    }

    const existing = await prisma.redemption.findUnique({
      where: {
        eventId_email: {
          eventId: event.id,
          email,
        },
      },
      include: {
        promoCodes: {
          select: { pool: true, code: true },
          orderBy: { pool: "asc" },
        },
      },
    })

    if (existing) {
      return {
        status: "ok",
        codes: mapCodes(existing.promoCodes),
        alreadyRedeemed: true,
      }
    }

    const requiredPools = poolsForProduct(event.product)

    try {
      const result = await prisma.$transaction(async (tx) => {
        const redemption = await tx.redemption.create({
          data: {
            eventId: event.id,
            email,
            clerkUserId: userId,
          },
        })

        const claimed: RedeemedCode[] = []

        for (const pool of requiredPools) {
          const rows = await tx.$queryRaw<Array<{ code: string; pool: Pool }>>`
            UPDATE "PromoCode"
            SET
              "redemptionId" = ${redemption.id},
              "claimedAt" = NOW()
            WHERE id = (
              SELECT id
              FROM "PromoCode"
              WHERE
                "eventId" = ${event.id}
                AND pool = ${pool}::"Pool"
                AND "redemptionId" IS NULL
              ORDER BY id
              LIMIT 1
              FOR UPDATE SKIP LOCKED
            )
            RETURNING code, pool
          `

          const row = rows[0]
          if (!row) {
            throw new SoldOutError()
          }

          claimed.push({ pool: row.pool, code: row.code })
        }

        return claimed
      })

      return {
        status: "ok",
        codes: result,
        alreadyRedeemed: false,
      }
    } catch (error) {
      if (error instanceof SoldOutError) {
        return { status: "sold_out" }
      }

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        const raced = await prisma.redemption.findUnique({
          where: {
            eventId_email: {
              eventId: event.id,
              email,
            },
          },
          include: {
            promoCodes: {
              select: { pool: true, code: true },
              orderBy: { pool: "asc" },
            },
          },
        })

        if (raced) {
          return {
            status: "ok",
            codes: mapCodes(raced.promoCodes),
            alreadyRedeemed: true,
          }
        }
      }

      throw error
    }
  })

class SoldOutError extends Error {
  constructor() {
    super("Sold out")
    this.name = "SoldOutError"
  }
}
