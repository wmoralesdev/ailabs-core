#!/usr/bin/env node
import "dotenv/config"
import * as fs from "node:fs"
import * as path from "node:path"
import * as p from "@clack/prompts"
import { parse } from "csv-parse/sync"

import type { Pool, Product } from "../src/generated/prisma/client"
import { prisma } from "../src/lib/prisma"
import { normalizeEmail, poolsForProduct } from "../src/lib/redeem-products"

const PRODUCT_OPTIONS: Array<{ value: Product; label: string }> = [
  { value: "CURSOR", label: "Cursor" },
  { value: "CODEX", label: "Codex" },
  { value: "OPENAI", label: "OpenAI Platform" },
  { value: "CODEX_OPENAI", label: "Codex + OpenAI Platform" },
]

const POOL_LABELS: Record<Pool, string> = {
  CURSOR: "Cursor",
  CODEX: "Codex",
  OPENAI: "OpenAI Platform",
}

async function main() {
  p.intro("Ai Labs credits seed")

  const action = await p.select({
    message: "What do you want to do?",
    options: [
      { value: "create", label: "Create event" },
      { value: "import", label: "Import eligible emails (CSV)" },
      { value: "load", label: "Load promo codes" },
      { value: "stats", label: "Show event stats" },
    ],
  })

  if (p.isCancel(action)) {
    p.cancel("Cancelled")
    process.exit(0)
  }

  switch (action) {
    case "create":
      await createEvent()
      break
    case "import":
      await importEmails()
      break
    case "load":
      await loadPromoCodes()
      break
    case "stats":
      await showStats()
      break
    default: {
      const _exhaustive: never = action
      throw new Error(`Unhandled action: ${_exhaustive}`)
    }
  }

  p.outro("Done")
}

async function createEvent() {
  const name = await p.text({
    message: "Event name",
    placeholder: "Cursor Meetup — San Salvador",
    validate: (value) =>
      !value || value.trim().length === 0 ? "Name is required" : undefined,
  })
  if (p.isCancel(name)) {
    p.cancel("Cancelled")
    process.exit(0)
  }

  const product = await p.select({
    message: "Product / page type",
    options: PRODUCT_OPTIONS,
  })
  if (p.isCancel(product)) {
    p.cancel("Cancelled")
    process.exit(0)
  }

  const event = await prisma.event.create({
    data: {
      name: name.trim(),
      product,
    },
  })

  p.note(
    [
      `id: ${event.id}`,
      `product: ${event.product}`,
      `redeem: /en/redeem?code=${event.id}`,
      `redeem: /es/redeem?code=${event.id}`,
    ].join("\n"),
    "Event created"
  )
}

async function selectEvent() {
  const events = await prisma.event.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      product: true,
      active: true,
    },
  })

  if (events.length === 0) {
    p.log.error("No events yet. Create one first.")
    process.exit(1)
  }

  const eventId = await p.select({
    message: "Select event",
    options: events.map((event) => ({
      value: event.id,
      label: `${event.active ? "" : "[inactive] "}${event.name}`,
      hint: event.product,
    })),
  })

  if (p.isCancel(eventId)) {
    p.cancel("Cancelled")
    process.exit(0)
  }

  const event = events.find((entry) => entry.id === eventId)
  if (!event) {
    p.log.error("Event not found")
    process.exit(1)
  }

  return event
}

async function importEmails() {
  const event = await selectEvent()

  const csvPath = await p.text({
    message: "Path to Luma CSV",
    placeholder: "./attendees.csv",
    validate: (value) => {
      if (!value) {
        return "File not found"
      }
      const resolved = path.resolve(value.trim())
      if (!fs.existsSync(resolved)) {
        return "File not found"
      }
      return undefined
    },
  })
  if (p.isCancel(csvPath)) {
    p.cancel("Cancelled")
    process.exit(0)
  }

  const resolved = path.resolve(csvPath.trim())
  const raw = fs.readFileSync(resolved, "utf8")
  const records = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
  }) as Array<Record<string, string>>

  if (records.length === 0) {
    p.log.error("CSV has no rows")
    process.exit(1)
  }

  const headers = Object.keys(records[0] ?? {})
  const emailHeader =
    headers.find((header) => header.toLowerCase() === "email") ??
    headers.find((header) => header.toLowerCase().includes("email"))

  if (!emailHeader) {
    p.log.error(`No email column found. Headers: ${headers.join(", ")}`)
    process.exit(1)
  }

  const emails = [
    ...new Set(
      records
        .map((row) => normalizeEmail(row[emailHeader] ?? ""))
        .filter((email) => email.includes("@"))
    ),
  ]

  if (emails.length === 0) {
    p.log.error("No valid emails found")
    process.exit(1)
  }

  const result = await prisma.eligibleEmail.createMany({
    data: emails.map((email) => ({
      eventId: event.id,
      email,
    })),
    skipDuplicates: true,
  })

  p.note(
    [
      `column: ${emailHeader}`,
      `parsed: ${emails.length}`,
      `inserted: ${result.count}`,
      `skipped (dupes): ${emails.length - result.count}`,
    ].join("\n"),
    `Imported for ${event.name}`
  )
}

async function loadPromoCodes() {
  const event = await selectEvent()
  const pools = poolsForProduct(event.product)

  const pool = await p.select({
    message: "Which pool?",
    options: pools.map((value) => ({
      value,
      label: POOL_LABELS[value],
    })),
  })
  if (p.isCancel(pool)) {
    p.cancel("Cancelled")
    process.exit(0)
  }

  const filePath = await p.text({
    message: "Path to codes file (one per line, or CSV with a code column)",
    placeholder: "./codes.txt",
    validate: (value) => {
      if (!value) {
        return "File not found"
      }
      const resolved = path.resolve(value.trim())
      if (!fs.existsSync(resolved)) {
        return "File not found"
      }
      return undefined
    },
  })
  if (p.isCancel(filePath)) {
    p.cancel("Cancelled")
    process.exit(0)
  }

  const resolved = path.resolve(filePath.trim())
  const codes = parseCodeFile(resolved)

  if (codes.length === 0) {
    p.log.error("No codes found in file")
    process.exit(1)
  }

  const result = await prisma.promoCode.createMany({
    data: codes.map((code) => ({
      eventId: event.id,
      pool,
      code,
    })),
    skipDuplicates: true,
  })

  p.note(
    [
      `pool: ${POOL_LABELS[pool]}`,
      `parsed: ${codes.length}`,
      `inserted: ${result.count}`,
      `skipped (dupes): ${codes.length - result.count}`,
    ].join("\n"),
    `Loaded for ${event.name}`
  )
}

function parseCodeFile(filePath: string): string[] {
  const raw = fs.readFileSync(filePath, "utf8").trim()
  if (!raw) {
    return []
  }

  const firstLine = raw.split(/\r?\n/, 1)[0] ?? ""
  const looksLikeCsv =
    firstLine.includes(",") ||
    firstLine.toLowerCase().includes("code") ||
    firstLine.toLowerCase().includes("coupon")

  if (looksLikeCsv && firstLine.includes(",")) {
    const records = parse(raw, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
    }) as Array<Record<string, string>>

    const headers = Object.keys(records[0] ?? {})
    const codeHeader =
      headers.find((header) => header.toLowerCase() === "code") ??
      headers.find((header) => header.toLowerCase().includes("code")) ??
      headers.find((header) => header.toLowerCase().includes("coupon")) ??
      headers[0]

    if (!codeHeader) {
      return []
    }

    return [
      ...new Set(
        records
          .map((row) => (row[codeHeader] ?? "").trim())
          .filter((code) => code.length > 0)
      ),
    ]
  }

  return [
    ...new Set(
      raw
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0 && !line.startsWith("#"))
    ),
  ]
}

async function showStats() {
  const events = await prisma.event.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          eligibleEmails: true,
          redemptions: true,
        },
      },
      promoCodes: {
        select: {
          pool: true,
          redemptionId: true,
        },
      },
    },
  })

  if (events.length === 0) {
    p.log.warn("No events yet")
    return
  }

  for (const event of events) {
    const pools = poolsForProduct(event.product)
    const poolLines = pools.map((pool) => {
      const inPool = event.promoCodes.filter((code) => code.pool === pool)
      const remaining = inPool.filter((code) => code.redemptionId === null)
        .length
      return `  ${POOL_LABELS[pool]}: ${remaining}/${inPool.length} remaining`
    })

    p.note(
      [
        `id: ${event.id}`,
        `product: ${event.product}`,
        `active: ${event.active}`,
        `eligible: ${event._count.eligibleEmails}`,
        `redemptions: ${event._count.redemptions}`,
        ...poolLines,
        `url: /en/redeem?code=${event.id}`,
      ].join("\n"),
      event.name
    )
  }
}

main()
  .catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error)
    p.log.error(message)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
