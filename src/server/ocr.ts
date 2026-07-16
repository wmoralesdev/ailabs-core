import { createServerFn } from "@tanstack/react-start"
import { parseAmountToCents } from "@/lib/money"

export type OcrDraft = {
  title: string
  amountCents: number | null
  rawText: string
}

type MistralOcrResponse = {
  pages?: Array<{ markdown?: string }>
}

function ocrInput(data: unknown): { imageBase64: string; mimeType: string } {
  if (typeof data !== "object" || data === null) {
    throw new Error("Invalid OCR payload")
  }

  const record = data as Record<string, unknown>
  const imageBase64 =
    typeof record.imageBase64 === "string" ? record.imageBase64.trim() : ""
  const mimeType =
    typeof record.mimeType === "string" ? record.mimeType.trim() : "image/jpeg"

  if (!imageBase64) throw new Error("Image is required")
  if (!mimeType.startsWith("image/")) throw new Error("File must be an image")

  if (imageBase64.length > 6_000_000) {
    throw new Error("Image is too large")
  }

  return { imageBase64, mimeType }
}

function draftFromText(rawText: string): OcrDraft {
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  const title =
    lines.find((line) => line.length > 2 && !/^\d+([.,]\d{2})?$/.test(line)) ??
    "Ticket"

  const amountPatterns = [
    /(?:total|amount|suma|importe|monto)[:\s]*\$?\s*(\d+[.,]\d{2})/i,
    /\$\s*(\d+[.,]\d{2})/,
    /(\d+[.,]\d{2})\s*(?:USD|EUR|SVC)?\s*$/i,
  ]

  let amountCents: number | null = null
  for (const pattern of amountPatterns) {
    const match = rawText.match(pattern)
    if (!match?.[1]) continue
    amountCents = parseAmountToCents(match[1].replace(",", "."))
    if (amountCents) break
  }

  if (!amountCents) {
    const amounts: number[] = []
    for (const match of rawText.matchAll(/(\d+[.,]\d{2})/g)) {
      const raw = match[1]
      if (!raw) continue
      const parsed = parseAmountToCents(raw.replace(",", "."))
      if (parsed !== null) amounts.push(parsed)
    }
    amounts.sort((a, b) => b - a)
    amountCents = amounts[0] ?? null
  }

  return {
    title: title.slice(0, 80),
    amountCents,
    rawText,
  }
}

export const parseTicketImage = createServerFn({ method: "POST" })
  .validator(ocrInput)
  .handler(async ({ data }): Promise<OcrDraft> => {
    const apiKey = process.env.MISTRAL_API_KEY
    if (!apiKey) {
      throw new Error("MISTRAL_API_KEY is not set")
    }

    const dataUrl = `data:${data.mimeType};base64,${data.imageBase64}`
    const response = await fetch("https://api.mistral.ai/v1/ocr", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistral-ocr-latest",
        document: {
          type: "image_url",
          image_url: dataUrl,
        },
      }),
    })

    if (!response.ok) {
      const detail = await response.text()
      console.error("Mistral OCR failed", detail)
      throw new Error("Could not read that ticket")
    }

    const payload = (await response.json()) as MistralOcrResponse
    const rawText = (payload.pages ?? [])
      .map((page) => page.markdown ?? "")
      .join("\n")
      .trim()

    if (!rawText) {
      throw new Error("Could not read text from that image")
    }

    return draftFromText(rawText)
  })
