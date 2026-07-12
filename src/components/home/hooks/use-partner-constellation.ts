import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import type { PointerEvent as ReactPointerEvent, RefObject } from "react"

import type { HomePartnerMember } from "@/content"
import {
  clampAll,
  collisionRadius,
  resolveCollisions,
  slotToCenter,
} from "@/components/home/home-partner-avatar-physics"
import type { Point } from "@/components/home/home-partner-avatar-physics"
import {
  DRAG_CLICK_THRESHOLD_PX,
  MEMBER_DISPLAY_COUNT,
  MEMBER_SLOTS,
  SM_BREAKPOINT_PX,
} from "@/components/home/home-partner-constellation-config"
import type { MemberSlot } from "@/components/home/home-partner-constellation-config"

type DragSession = {
  id: string
  pointerId: number
  grabOffsetX: number
  grabOffsetY: number
  startX: number
  startY: number
  moved: boolean
}

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
  visibleMembers: ReadonlyArray<HomePartnerMember>
  slots: ReadonlyArray<MemberSlot>
  positions: Record<string, Point>
  enlargedId: string | null
  draggingId: string | null
  isSmUp: boolean
  handlePointerDown: (
    event: ReactPointerEvent<HTMLButtonElement>,
    memberId: string
  ) => void
  handlePointerMove: (event: ReactPointerEvent<HTMLButtonElement>) => void
  handlePointerEnd: (
    event: ReactPointerEvent<HTMLButtonElement>,
    memberId: string
  ) => void
}

function usePartnerConstellation(
  members: ReadonlyArray<HomePartnerMember>
): UsePartnerConstellationResult {
  const fieldRef = useRef<HTMLDivElement>(null)
  const positionsRef = useRef<Record<string, Point>>({})
  const dragRef = useRef<DragSession | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [enlargedId, setEnlargedId] = useState<string | null>(null)
  const [positions, setPositions] = useState<Record<string, Point>>({})
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [fieldSize, setFieldSize] = useState({ width: 0, height: 0 })

  const visibleMembers = members.slice(0, MEMBER_DISPLAY_COUNT)
  const slots = MEMBER_SLOTS.slice(0, visibleMembers.length)
  const isSmUp = fieldSize.width >= SM_BREAKPOINT_PX

  useEffect(() => {
    positionsRef.current = positions
  }, [positions])

  useEffect(() => {
    const node = fieldRef.current
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

  useEffect(() => {
    const node = fieldRef.current
    if (!node) {
      return
    }

    const layout = (width: number, height: number, enlarged: string | null) => {
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

        radii[member.id] = collisionRadius(
          slot.size,
          smUp,
          enlarged === member.id
        )

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
      layout(width, height, enlargedId)
    })

    observer.observe(node)
    const rect = node.getBoundingClientRect()
    layout(rect.width, rect.height, enlargedId)

    return () => observer.disconnect()
  }, [members, enlargedId])

  const applyPhysics = useCallback(
    (nextCenters: Record<string, Point>, activeDragId: string | null) => {
      const { width, height } = fieldSize
      if (width <= 0 || height <= 0) {
        return
      }

      const radii = buildRadii(visibleMembers, slots, enlargedId, isSmUp)
      const bodies = Object.entries(nextCenters).map(([id, center]) => ({
        id,
        center,
        radius: radii[id] ?? 0,
      }))

      const resolved = resolveCollisions(bodies, activeDragId)
      if (activeDragId && nextCenters[activeDragId]) {
        resolved[activeDragId] = nextCenters[activeDragId]!
      }
      const clamped = clampAll(resolved, radii, width, height)
      if (activeDragId && nextCenters[activeDragId]) {
        const r = radii[activeDragId] ?? 0
        clamped[activeDragId] = {
          x: Math.min(width - r, Math.max(r, nextCenters[activeDragId]!.x)),
          y: Math.min(height - r, Math.max(r, nextCenters[activeDragId]!.y)),
        }
      }

      setPositions(clamped)
    },
    [fieldSize, visibleMembers, slots, enlargedId, isSmUp]
  )

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>, memberId: string) => {
      if (event.button !== 0) {
        return
      }

      const node = fieldRef.current
      const center = positionsRef.current[memberId]
      if (!node || !center) {
        return
      }

      const bounds = node.getBoundingClientRect()
      const pointerX = event.clientX - bounds.left
      const pointerY = event.clientY - bounds.top

      dragRef.current = {
        id: memberId,
        pointerId: event.pointerId,
        grabOffsetX: pointerX - center.x,
        grabOffsetY: pointerY - center.y,
        startX: center.x,
        startY: center.y,
        moved: false,
      }

      setDraggingId(memberId)
      event.currentTarget.setPointerCapture(event.pointerId)
    },
    []
  )

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      const session = dragRef.current
      const node = fieldRef.current
      if (!session || session.pointerId !== event.pointerId || !node) {
        return
      }

      const bounds = node.getBoundingClientRect()
      const pointerX = event.clientX - bounds.left
      const pointerY = event.clientY - bounds.top
      const nextX = pointerX - session.grabOffsetX
      const nextY = pointerY - session.grabOffsetY
      const travel = Math.hypot(nextX - session.startX, nextY - session.startY)
      if (travel > DRAG_CLICK_THRESHOLD_PX) {
        session.moved = true
      }

      const nextCenters = {
        ...positionsRef.current,
        [session.id]: { x: nextX, y: nextY },
      }
      applyPhysics(nextCenters, session.id)
    },
    [applyPhysics]
  )

  const handlePointerEnd = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>, memberId: string) => {
      const session = dragRef.current
      if (!session || session.pointerId !== event.pointerId) {
        return
      }

      const wasClick = !session.moved
      dragRef.current = null
      setDraggingId(null)

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }

      if (wasClick && session.id === memberId) {
        setEnlargedId((current) => (current === memberId ? null : memberId))
      }
    },
    []
  )

  return {
    fieldRef,
    revealed,
    visibleMembers,
    slots,
    positions,
    enlargedId,
    draggingId,
    isSmUp,
    handlePointerDown,
    handlePointerMove,
    handlePointerEnd,
  }
}

export { usePartnerConstellation }
export type { UsePartnerConstellationResult }
