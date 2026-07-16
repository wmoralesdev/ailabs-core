const keyFor = (code: string) => `split:me:${code.toUpperCase()}`

export function getRememberedMemberId(code: string): string | null {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(keyFor(code))
}

export function rememberMemberId(code: string, memberId: string): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(keyFor(code), memberId)
}
