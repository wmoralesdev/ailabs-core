import { useEffect, useRef, useState } from "react"

import type { HomePartnerMember, HomePartnerVoice } from "@/content"
import { cn } from "@/lib/utils"

type MemberSlot = {
  top: string
  left: string
  size: "sm" | "md" | "lg"
  fill: 0 | 1 | 2 | 3
}

/** Deterministic constellation — denser pack, no random on render. */
const MEMBER_SLOTS: ReadonlyArray<MemberSlot> = [
  { top: "4%", left: "1%", size: "sm", fill: 0 },
  { top: "18%", left: "4%", size: "md", fill: 1 },
  { top: "36%", left: "2%", size: "sm", fill: 2 },
  { top: "52%", left: "5%", size: "lg", fill: 3 },
  { top: "70%", left: "1%", size: "sm", fill: 0 },
  { top: "84%", left: "6%", size: "md", fill: 1 },
  { top: "8%", left: "10%", size: "md", fill: 2 },
  { top: "28%", left: "11%", size: "sm", fill: 3 },
  { top: "46%", left: "9%", size: "md", fill: 0 },
  { top: "64%", left: "12%", size: "sm", fill: 1 },
  { top: "80%", left: "14%", size: "lg", fill: 2 },
  { top: "2%", left: "18%", size: "sm", fill: 3 },
  { top: "20%", left: "17%", size: "lg", fill: 0 },
  { top: "40%", left: "19%", size: "sm", fill: 1 },
  { top: "58%", left: "16%", size: "md", fill: 2 },
  { top: "76%", left: "20%", size: "sm", fill: 3 },
  { top: "12%", left: "25%", size: "md", fill: 0 },
  { top: "32%", left: "24%", size: "sm", fill: 1 },
  { top: "50%", left: "26%", size: "lg", fill: 2 },
  { top: "68%", left: "23%", size: "sm", fill: 3 },
  { top: "88%", left: "27%", size: "md", fill: 0 },
  { top: "6%", left: "32%", size: "sm", fill: 1 },
  { top: "24%", left: "31%", size: "md", fill: 2 },
  { top: "42%", left: "33%", size: "sm", fill: 3 },
  { top: "60%", left: "30%", size: "md", fill: 0 },
  { top: "78%", left: "34%", size: "sm", fill: 1 },
  { top: "14%", left: "38%", size: "lg", fill: 2 },
  { top: "34%", left: "39%", size: "sm", fill: 3 },
  { top: "54%", left: "37%", size: "md", fill: 0 },
  { top: "72%", left: "40%", size: "sm", fill: 1 },
  { top: "90%", left: "36%", size: "md", fill: 2 },
  { top: "4%", left: "45%", size: "md", fill: 3 },
  { top: "22%", left: "46%", size: "sm", fill: 0 },
  { top: "44%", left: "44%", size: "lg", fill: 1 },
  { top: "62%", left: "47%", size: "sm", fill: 2 },
  { top: "82%", left: "45%", size: "md", fill: 3 },
  { top: "10%", left: "52%", size: "sm", fill: 0 },
  { top: "30%", left: "53%", size: "md", fill: 1 },
  { top: "48%", left: "51%", size: "sm", fill: 2 },
  { top: "66%", left: "54%", size: "lg", fill: 3 },
  { top: "86%", left: "52%", size: "sm", fill: 0 },
  { top: "16%", left: "59%", size: "md", fill: 1 },
  { top: "36%", left: "60%", size: "sm", fill: 2 },
  { top: "56%", left: "58%", size: "md", fill: 3 },
  { top: "74%", left: "61%", size: "sm", fill: 0 },
  { top: "8%", left: "66%", size: "lg", fill: 1 },
  { top: "26%", left: "67%", size: "sm", fill: 2 },
  { top: "46%", left: "65%", size: "md", fill: 3 },
  { top: "64%", left: "68%", size: "sm", fill: 0 },
  { top: "82%", left: "66%", size: "md", fill: 1 },
  { top: "12%", left: "74%", size: "sm", fill: 2 },
  { top: "32%", left: "75%", size: "md", fill: 3 },
  { top: "52%", left: "73%", size: "sm", fill: 0 },
  { top: "70%", left: "76%", size: "lg", fill: 1 },
  { top: "88%", left: "74%", size: "sm", fill: 2 },
  { top: "6%", left: "82%", size: "md", fill: 3 },
  { top: "24%", left: "84%", size: "sm", fill: 0 },
  { top: "42%", left: "81%", size: "md", fill: 1 },
  { top: "60%", left: "85%", size: "sm", fill: 2 },
  { top: "78%", left: "83%", size: "md", fill: 3 },
  { top: "18%", left: "90%", size: "sm", fill: 0 },
  { top: "38%", left: "92%", size: "lg", fill: 1 },
  { top: "58%", left: "89%", size: "sm", fill: 2 },
  { top: "76%", left: "91%", size: "md", fill: 3 },
]

const VOICE_SLOTS = [
  { top: "12%", left: "28%", anchor: "left" },
  { top: "48%", left: "40%", anchor: "left" },
  { top: "22%", left: "auto", anchor: "right" },
] as const

const sizeClassName = {
  sm: "size-7 sm:size-8",
  md: "size-9 sm:size-10",
  lg: "size-11 sm:size-12",
} as const

const fillClassName = [
  "bg-lavender text-graphite",
  "bg-purple/40 text-graphite",
  "bg-graphite/10 text-graphite",
  "bg-muted text-muted-foreground",
] as const

type HomePartnerMembersProps = {
  members: ReadonlyArray<HomePartnerMember>
  voices: ReadonlyArray<HomePartnerVoice>
}

function HomePartnerMembers({ members, voices }: HomePartnerMembersProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)
  const slots = MEMBER_SLOTS.slice(0, members.length)
  const visibleVoices = voices.slice(0, VOICE_SLOTS.length)

  useEffect(() => {
    const node = ref.current
    if (!node) {
      return
    }

    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (media.matches) {
      setRevealed(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      data-revealed={revealed ? "true" : "false"}
      className="home-partner-constellation relative h-56 w-full sm:h-72 md:h-80"
    >
      <div className="absolute inset-0" aria-hidden>
        {slots.map((slot, index) => {
          const member = members[index]
          if (!member) {
            return null
          }

          return (
            <span
              key={member.id}
              className={cn(
                "home-partner-avatar absolute inline-flex items-center justify-center overflow-hidden rounded-full border border-border/50 text-[0.65rem] font-semibold uppercase sm:text-xs",
                sizeClassName[slot.size],
                !member.imageSrc && fillClassName[slot.fill]
              )}
              style={{
                top: slot.top,
                left: slot.left,
                ["--i" as string]: index,
              }}
            >
              {member.imageSrc ? (
                <img
                  src={member.imageSrc}
                  alt=""
                  className="size-full object-cover"
                />
              ) : (
                member.initial
              )}
            </span>
          )
        })}
      </div>

      {visibleVoices.map((voice, index) => {
        const slot = VOICE_SLOTS[index]
        if (!slot) {
          return null
        }

        return (
          <figure
            key={`${voice.role}-${voice.quote}`}
            className="home-partner-voice absolute z-10 max-w-[10.5rem] rounded-2xl border border-border/80 bg-background/95 px-3.5 py-2.5 shadow-soft backdrop-blur-sm sm:max-w-[13rem]"
            style={{
              top: slot.top,
              left: slot.anchor === "left" ? slot.left : undefined,
              right: slot.anchor === "right" ? "3%" : undefined,
              ["--i" as string]: index + 6,
            }}
          >
            <blockquote className="text-foreground text-xs leading-snug font-medium sm:text-sm">
              {voice.quote}
            </blockquote>
            <figcaption className="text-muted-foreground mt-1 text-[0.65rem] tracking-wide uppercase sm:text-xs">
              {voice.role}
            </figcaption>
          </figure>
        )
      })}
    </div>
  )
}

export { HomePartnerMembers }
