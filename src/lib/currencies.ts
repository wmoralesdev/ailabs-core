export const CURRENCIES = [
  { code: "USD", label: "US Dollar (USD)" },
  { code: "EUR", label: "Euro (EUR)" },
  { code: "SVC", label: "El Salvador Colón (SVC)" },
  { code: "GTQ", label: "Guatemalan Quetzal (GTQ)" },
  { code: "HNL", label: "Honduran Lempira (HNL)" },
  { code: "NIO", label: "Nicaraguan Córdoba (NIO)" },
  { code: "CRC", label: "Costa Rican Colón (CRC)" },
  { code: "PAB", label: "Panamanian Balboa (PAB)" },
  { code: "MXN", label: "Mexican Peso (MXN)" },
  { code: "COP", label: "Colombian Peso (COP)" },
  { code: "GBP", label: "British Pound (GBP)" },
] as const

export type CurrencyCode = (typeof CURRENCIES)[number]["code"]
