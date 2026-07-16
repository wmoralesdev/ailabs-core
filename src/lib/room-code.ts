const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"

export function generateRoomCode(length = 6): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length))
  let code = ""
  for (const byte of bytes) {
    code += ALPHABET[byte % ALPHABET.length]
  }
  return code
}

export function normalizeRoomCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, "")
}
