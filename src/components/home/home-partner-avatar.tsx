import type { HomePartnerMember } from "@/content"
import {
  ENLARGE_DURATION_MS,
  ENLARGE_SCALE,
  radiusForSize,
} from "@/components/home/home-partner-avatar-physics"
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
  isSmUp: boolean
  onToggle: (memberId: string) => void
}

function HomePartnerAvatar({
  member,
  slot,
  index,
  center,
  isEnlarged,
  isSmUp,
  onToggle,
}: HomePartnerAvatarProps) {
  const imageSrc = resolveMemberImageSrc(member, index)
  const label = member.imageAlt ?? "Community member"
  const radius = radiusForSize(slot.size, isSmUp)

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={isEnlarged}
      data-enlarged={isEnlarged ? "true" : "false"}
      className={cn(
        "home-partner-avatar absolute inline-flex cursor-pointer items-center justify-center rounded-full border border-border/50 p-0 text-xs font-semibold uppercase focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:text-sm",
        sizeClassName[slot.size],
        !imageSrc && fillClassName[slot.fill],
        isEnlarged && "z-30"
      )}
      style={{
        top: center ? center.y - radius : slot.top,
        left: center ? center.x - radius : slot.left,
        ["--i" as string]: index,
        ["--home-partner-enlarge" as string]: ENLARGE_SCALE,
        ["--home-partner-enlarge-ms" as string]: `${ENLARGE_DURATION_MS}ms`,
      }}
      onClick={() => onToggle(member.id)}
    >
      {isEnlarged ? (
        <svg
          className="home-partner-avatar-timer pointer-events-none absolute inset-[-3px] size-[calc(100%+6px)] -rotate-90"
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          <circle
            className="home-partner-avatar-timer-progress"
            cx="50"
            cy="50"
            r="48"
            fill="none"
            pathLength={100}
          />
        </svg>
      ) : null}
      <span className="home-partner-avatar-face inline-flex size-full items-center justify-center overflow-hidden rounded-full">
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
