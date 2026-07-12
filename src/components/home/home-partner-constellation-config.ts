import type { HomePartnerMember } from "@/content"

export type MemberSlot = {
  top: string
  left: string
  size: "sm" | "md" | "lg"
  fill: 0 | 1 | 2 | 3
}

export type VoiceSlot = {
  top: string
  left: string
  anchor: "left" | "right"
}

/** One slot per real face — 15 avatars, each used exactly once. */
export const MEMBER_DISPLAY_COUNT = 15

/** Real faces from `public/community-avatars` (1–15.webp). */
export const COMMUNITY_AVATAR_SRCS = Array.from(
  { length: 15 },
  (_, index) => `/community-avatars/${index + 1}.webp`
) as ReadonlyArray<string>

/** Deterministic constellation — 15 slots scattered across the field, asymmetric. */
export const MEMBER_SLOTS: ReadonlyArray<MemberSlot> = [
  { top: "8%", left: "4%", size: "md", fill: 0 },
  { top: "58%", left: "3%", size: "sm", fill: 0 },
  { top: "32%", left: "13%", size: "lg", fill: 3 },
  { top: "74%", left: "18%", size: "md", fill: 3 },
  { top: "6%", left: "26%", size: "sm", fill: 0 },
  { top: "42%", left: "30%", size: "md", fill: 3 },
  { top: "70%", left: "40%", size: "lg", fill: 3 },
  { top: "18%", left: "46%", size: "md", fill: 3 },
  { top: "54%", left: "52%", size: "sm", fill: 2 },
  { top: "4%", left: "58%", size: "lg", fill: 3 },
  { top: "38%", left: "66%", size: "md", fill: 2 },
  { top: "72%", left: "64%", size: "md", fill: 3 },
  { top: "12%", left: "76%", size: "lg", fill: 1 },
  { top: "48%", left: "82%", size: "md", fill: 3 },
  { top: "78%", left: "84%", size: "sm", fill: 0 },
]

export const VOICE_SLOTS: ReadonlyArray<VoiceSlot> = [
  { top: "10%", left: "26%", anchor: "left" },
  { top: "46%", left: "38%", anchor: "left" },
  { top: "20%", left: "auto", anchor: "right" },
]

export const SM_BREAKPOINT_PX = 640
export const DRAG_CLICK_THRESHOLD_PX = 6

export const sizeClassName = {
  sm: "size-12 sm:size-14",
  md: "size-14 sm:size-16",
  lg: "size-16 sm:size-20",
} as const

export const fillClassName = [
  "bg-lavender text-graphite",
  "bg-purple/40 text-graphite",
  "bg-graphite/10 text-graphite",
  "bg-muted text-muted-foreground",
] as const

export function resolveMemberImageSrc(
  member: HomePartnerMember,
  index: number
): string | undefined {
  if (member.imageSrc) {
    return member.imageSrc
  }

  if (COMMUNITY_AVATAR_SRCS.length === 0) {
    return undefined
  }

  return COMMUNITY_AVATAR_SRCS[index % COMMUNITY_AVATAR_SRCS.length]
}
