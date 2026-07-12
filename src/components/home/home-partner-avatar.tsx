import type { PointerEvent as ReactPointerEvent } from "react"

import type { HomePartnerMember } from "@/content"
import { radiusForSize } from "@/components/home/home-partner-avatar-physics"
import type { Point } from "@/components/home/home-partner-avatar-physics"
import {
  fillClassName,
  resolveMemberImageSrc,
  sizeClassName,
} from "@/components/home/home-partner-constellation-config"
import type { MemberSlot } from "@/components/home/home-partner-constellation-config"
import { cn } from "@/lib/utils"

type HomePartnerAvatarProps = {
  member: HomePartnerMember
  slot: MemberSlot
  index: number
  center: Point | undefined
  isEnlarged: boolean
  isDragging: boolean
  isSmUp: boolean
  onPointerDown: (
    event: ReactPointerEvent<HTMLButtonElement>,
    memberId: string
  ) => void
  onPointerMove: (event: ReactPointerEvent<HTMLButtonElement>) => void
  onPointerEnd: (
    event: ReactPointerEvent<HTMLButtonElement>,
    memberId: string
  ) => void
}

function HomePartnerAvatar({
  member,
  slot,
  index,
  center,
  isEnlarged,
  isDragging,
  isSmUp,
  onPointerDown,
  onPointerMove,
  onPointerEnd,
}: HomePartnerAvatarProps) {
  const imageSrc = resolveMemberImageSrc(member, index)
  const label = member.imageAlt ?? "Community member"
  const radius = radiusForSize(slot.size, isSmUp)

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={isEnlarged}
      data-dragging={isDragging ? "true" : "false"}
      className={cn(
        "home-partner-avatar absolute inline-flex cursor-grab items-center justify-center rounded-full border border-border/50 p-0 text-xs font-semibold uppercase focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:cursor-grabbing sm:text-sm",
        sizeClassName[slot.size],
        !imageSrc && fillClassName[slot.fill],
        (isEnlarged || isDragging) && "z-20"
      )}
      style={{
        top: center ? center.y - radius : slot.top,
        left: center ? center.x - radius : slot.left,
        ["--i" as string]: index,
      }}
      onPointerDown={(event) => onPointerDown(event, member.id)}
      onPointerMove={onPointerMove}
      onPointerUp={(event) => onPointerEnd(event, member.id)}
      onPointerCancel={(event) => onPointerEnd(event, member.id)}
    >
      <span
        className="home-partner-avatar-face inline-flex size-full items-center justify-center overflow-hidden rounded-full"
        data-enlarged={isEnlarged ? "true" : "false"}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt=""
            className="pointer-events-none size-full object-cover"
            draggable={false}
          />
        ) : (
          member.initial
        )}
      </span>
    </button>
  )
}

export { HomePartnerAvatar }
