import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import type { RefObject } from "react"

import type { HomePartnerMember } from "@/content"
import {
  ENLARGE_DURATION_MS,
  clampAll,
  collisionRadius,
  resolveCollisions,
  slotToCenter,
} from "@/components/home/home-partner-avatar-physics"
import type { Point } from "@/components/home/home-partner-avatar-physics"
import {
  MEMBER_DISPLAY_COUNT,
  MEMBER_SLOTS,
  SM_BREAKPOINT_PX,
} from "@/components/home/home-partner-constellation-config"
import type { MemberSlot } from "@/components/home/home-partner-constellation-config"

function buildRadii(
  members: ReadonlyArray<HomePartnerMember>,
  slots: ReadonlyArray<MemberSlot>,
  enlargedId: string | null,
  isSmUp: boolean
): Record<string, number> {
  const radii: Record<string, number> = {}
  for (let index = 0; index < members.length; index += 1) {
    const member = members[index]
    const slot = slots[index]
    if (!member || !slot) {
      continue
    }
    radii[member.id] = collisionRadius(
      slot.size,
      isSmUp,
      enlargedId === member.id
    )
  }
  return radii
}

type UsePartnerConstellationResult = {
  fieldRef: RefObject<HTMLDivElement | null>
  revealed: boolean
  entered: boolean
  visibleMembers: ReadonlyArray<HomePartnerMember>
  slots: ReadonlyArray<MemberSlot>
  positions: Record<string, Point>
  enlargedId: string | null
  isSmUp: boolean
  toggleEnlarge: (memberId: string) => void
}

function usePartnerConstellation(
  members: ReadonlyArray<HomePartnerMember>
): UsePartnerConstellationResult {
  const fieldRef = useRef<HTMLDivElement>(null)
  const positionsRef = useRef<Record<string, Point>>({})
  const enlargedIdRef = useRef<string | null>(null)
  const fieldSizeRef = useRef({ width: 0, height: 0 })
  const enlargeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reduceMotionRef = useRef(false)

  const [revealed, setRevealed] = useState(false)
  const [entered, setEntered] = useState(false)
  const [enlargedId, setEnlargedId] = useState<string | null>(null)
  const [positions, setPositions] = useState<Record<string, Point>>({})
  const [fieldSize, setFieldSize] = useState({ width: 0, height: 0 })

  const visibleMembers = members.slice(0, MEMBER_DISPLAY_COUNT)
  const slots = MEMBER_SLOTS.slice(0, visibleMembers.length)
  const isSmUp = fieldSize.width >= SM_BREAKPOINT_PX

  useEffect(() => {
    positionsRef.current = positions
  }, [positions])

  useEffect(() => {
    enlargedIdRef.current = enlargedId
  }, [enlargedId])

  useEffect(() => {
    fieldSizeRef.current = fieldSize
  }, [fieldSize])

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    reduceMotionRef.current = media.matches
    const onChange = () => {
      reduceMotionRef.current = media.matches
    }
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [])

  useEffect(() => {
    const node = fieldRef.current
    if (!node) {
      return
    }

    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (media.matches) {
      setRevealed(true)
      setEntered(true)
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

  useEffect(() => {
    if (!revealed || reduceMotionRef.current) {
      return
    }
    // Enter delay max (~15 * 28ms) + enter duration (~480ms)
    const timer = window.setTimeout(() => setEntered(true), 920)
    return () => window.clearTimeout(timer)
  }, [revealed])

  const clearEnlargeTimer = useCallback(() => {
    if (enlargeTimerRef.current !== null) {
      clearTimeout(enlargeTimerRef.current)
      enlargeTimerRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => clearEnlargeTimer()
  }, [clearEnlargeTimer])

  const applyPhysics = useCallback(
    (nextCenters: Record<string, Point>, enlarged: string | null) => {
      const { width, height } = fieldSizeRef.current
      if (width <= 0 || height <= 0) {
        return
      }

      const smUp = width >= SM_BREAKPOINT_PX
      const layoutMembers = members.slice(0, MEMBER_DISPLAY_COUNT)
      const layoutSlots = MEMBER_SLOTS.slice(0, layoutMembers.length)
      const radii = buildRadii(layoutMembers, layoutSlots, enlarged, smUp)
      const bodies = Object.entries(nextCenters).map(([id, center]) => ({
        id,
        center,
        radius: radii[id] ?? 0,
      }))

      // Enlarged bubble stays put; neighbors absorb the growth, then clamp all in-bounds.
      const resolved = resolveCollisions(bodies, enlarged)
      if (enlarged && nextCenters[enlarged]) {
        resolved[enlarged] = nextCenters[enlarged]!
      }
      const clamped = clampAll(resolved, radii, width, height)
      setPositions(clamped)
    },
    [members]
  )

  useEffect(() => {
    const node = fieldRef.current
    if (!node) {
      return
    }

    const layout = (width: number, height: number) => {
      if (width <= 0 || height <= 0) {
        return
      }

      const smUp = width >= SM_BREAKPOINT_PX
      const previous = positionsRef.current
      const hadPositions = Object.keys(previous).length > 0
      const layoutMembers = members.slice(0, MEMBER_DISPLAY_COUNT)
      const layoutSlots = MEMBER_SLOTS.slice(0, layoutMembers.length)

      const nextCenters: Record<string, Point> = {}
      const radii: Record<string, number> = {}

      for (let index = 0; index < layoutMembers.length; index += 1) {
        const member = layoutMembers[index]
        const slot = layoutSlots[index]
        if (!member || !slot) {
          continue
        }

        radii[member.id] = collisionRadius(slot.size, smUp, false)

        if (hadPositions && previous[member.id]) {
          nextCenters[member.id] = previous[member.id]!
        } else {
          nextCenters[member.id] = slotToCenter(slot, width, height, smUp)
        }
      }

      const bodies = Object.entries(nextCenters).map(([id, center]) => ({
        id,
        center,
        radius: radii[id] ?? 0,
      }))

      const resolved = resolveCollisions(bodies, null)
      const clamped = clampAll(resolved, radii, width, height)

      setFieldSize({ width, height })
      setPositions(clamped)
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) {
        return
      }
      const { width, height } = entry.contentRect
      layout(width, height)
    })

    observer.observe(node)
    const rect = node.getBoundingClientRect()
    layout(rect.width, rect.height)

    return () => observer.disconnect()
  }, [members])

  // Nudge neighbors when the enlarge radius changes; keep the enlarged center fixed.
  useEffect(() => {
    if (Object.keys(positionsRef.current).length === 0) {
      return
    }
    applyPhysics(positionsRef.current, enlargedId)
  }, [enlargedId, applyPhysics])

  const toggleEnlarge = useCallback(
    (memberId: string) => {
      clearEnlargeTimer()
      const nextId = enlargedIdRef.current === memberId ? null : memberId
      setEnlargedId(nextId)

      if (nextId) {
        enlargeTimerRef.current = setTimeout(() => {
          setEnlargedId((current) => (current === nextId ? null : current))
          enlargeTimerRef.current = null
        }, ENLARGE_DURATION_MS)
      }
    },
    [clearEnlargeTimer]
  )

  return {
    fieldRef,
    revealed,
    entered,
    visibleMembers,
    slots,
    positions,
    enlargedId,
    isSmUp,
    toggleEnlarge,
  }
}

export { usePartnerConstellation }
export type { UsePartnerConstellationResult }
