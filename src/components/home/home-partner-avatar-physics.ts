type Point = {
  x: number
  y: number
}

type AvatarSize = "sm" | "md" | "lg"

type SlotPercent = {
  top: string
  left: string
  size: AvatarSize
}

/** Base radii in px matching Tailwind size tiers (outer button, pre-enlarge). */
const SIZE_RADIUS_PX: Record<AvatarSize, { base: number; sm: number }> = {
  sm: { base: 24, sm: 28 },
  md: { base: 28, sm: 32 },
  lg: { base: 32, sm: 40 },
}

/** Modal-like in-place grow — keep in sync with CSS `--home-partner-enlarge`. */
const ENLARGE_SCALE = 2.4
const ENLARGE_DURATION_MS = 5000
const RESOLVE_ITERATIONS = 4

function parsePercent(value: string): number {
  return Number.parseFloat(value) / 100
}

function radiusForSize(size: AvatarSize, isSmUp: boolean): number {
  const tier = SIZE_RADIUS_PX[size]
  return isSmUp ? tier.sm : tier.base
}

function collisionRadius(
  size: AvatarSize,
  isSmUp: boolean,
  enlarged: boolean
): number {
  const base = radiusForSize(size, isSmUp)
  return enlarged ? base * ENLARGE_SCALE : base
}

function slotToCenter(
  slot: SlotPercent,
  width: number,
  height: number,
  isSmUp: boolean
): Point {
  const r = radiusForSize(slot.size, isSmUp)
  const leftRatio = parsePercent(slot.left)
  const topRatio = parsePercent(slot.top)
  return {
    x: leftRatio * width + r,
    y: topRatio * height + r,
  }
}

function clampToBounds(
  center: Point,
  radius: number,
  width: number,
  height: number
): Point {
  return {
    x: Math.min(width - radius, Math.max(radius, center.x)),
    y: Math.min(height - radius, Math.max(radius, center.y)),
  }
}

type Body = {
  id: string
  center: Point
  radius: number
}

/**
 * Resolve circle-circle overlaps.
 * When `draggedId` is set, that body stays fixed and others absorb the full push.
 * Otherwise overlap is split 50/50.
 */
function resolveCollisions(
  bodies: ReadonlyArray<Body>,
  draggedId: string | null,
  iterations = RESOLVE_ITERATIONS
): Record<string, Point> {
  const next = bodies.map((body) => ({
    ...body,
    center: { ...body.center },
  }))

  for (let iter = 0; iter < iterations; iter += 1) {
    for (let i = 0; i < next.length; i += 1) {
      for (let j = i + 1; j < next.length; j += 1) {
        const a = next[i]!
        const b = next[j]!
        const dx = b.center.x - a.center.x
        const dy = b.center.y - a.center.y
        const dist = Math.hypot(dx, dy)
        const minDist = a.radius + b.radius

        if (dist >= minDist || minDist <= 0) {
          continue
        }

        const nx = dist > 0.0001 ? dx / dist : 1
        const ny = dist > 0.0001 ? dy / dist : 0
        const overlap = minDist - (dist > 0.0001 ? dist : 0)

        const aDragged = a.id === draggedId
        const bDragged = b.id === draggedId

        if (aDragged && !bDragged) {
          b.center.x += nx * overlap
          b.center.y += ny * overlap
        } else if (bDragged && !aDragged) {
          a.center.x -= nx * overlap
          a.center.y -= ny * overlap
        } else {
          const half = overlap / 2
          a.center.x -= nx * half
          a.center.y -= ny * half
          b.center.x += nx * half
          b.center.y += ny * half
        }
      }
    }
  }

  const result: Record<string, Point> = {}
  for (const body of next) {
    result[body.id] = body.center
  }
  return result
}

function clampAll(
  centers: Record<string, Point>,
  radii: Record<string, number>,
  width: number,
  height: number
): Record<string, Point> {
  const result: Record<string, Point> = {}
  for (const [id, center] of Object.entries(centers)) {
    const radius = radii[id] ?? 0
    result[id] = clampToBounds(center, radius, width, height)
  }
  return result
}

export {
  ENLARGE_DURATION_MS,
  ENLARGE_SCALE,
  clampAll,
  clampToBounds,
  collisionRadius,
  radiusForSize,
  resolveCollisions,
  slotToCenter,
}
export type { AvatarSize, Body, Point, SlotPercent }
