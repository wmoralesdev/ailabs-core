import type { Pool, Product } from "@/generated/prisma/client"

export type RedeemProduct = Product

export type RedeemProductConfig = {
  product: Product
  pools: ReadonlyArray<Pool>
  titleKey: "cursor" | "codex" | "openai" | "codexOpenai"
  logos: ReadonlyArray<{
    light: string
    dark: string
    alt: string
  }>
}

const PRODUCT_CONFIG: Record<Product, RedeemProductConfig> = {
  CURSOR: {
    product: "CURSOR",
    pools: ["CURSOR"],
    titleKey: "cursor",
    logos: [
      {
        light: "/brand/cursor-light.svg",
        dark: "/brand/cursor-dark.svg",
        alt: "Cursor",
      },
    ],
  },
  CODEX: {
    product: "CODEX",
    pools: ["CODEX"],
    titleKey: "codex",
    logos: [
      {
        light: "/brand/openai-light.svg",
        dark: "/brand/openai-dark.svg",
        alt: "Codex",
      },
    ],
  },
  OPENAI: {
    product: "OPENAI",
    pools: ["OPENAI"],
    titleKey: "openai",
    logos: [
      {
        light: "/brand/openai-light.svg",
        dark: "/brand/openai-dark.svg",
        alt: "OpenAI",
      },
    ],
  },
  CODEX_OPENAI: {
    product: "CODEX_OPENAI",
    pools: ["CODEX", "OPENAI"],
    titleKey: "codexOpenai",
    logos: [
      {
        light: "/brand/openai-light.svg",
        dark: "/brand/openai-dark.svg",
        alt: "Codex",
      },
      {
        light: "/brand/openai-light.svg",
        dark: "/brand/openai-dark.svg",
        alt: "OpenAI Platform",
      },
    ],
  },
}

export function getRedeemProductConfig(product: Product): RedeemProductConfig {
  return PRODUCT_CONFIG[product]
}

export function poolsForProduct(product: Product): ReadonlyArray<Pool> {
  return PRODUCT_CONFIG[product].pools
}

export function isProduct(value: string): value is Product {
  return value in PRODUCT_CONFIG
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}
