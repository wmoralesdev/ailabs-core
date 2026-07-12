import type { HomePartnerMember, HomePartnerVoice } from "@/content"
import { HomeApertureCanvas } from "@/components/home/home-aperture-canvas"
import { HomePartnerAvatar } from "@/components/home/home-partner-avatar"
import { HomePartnerVoiceCard } from "@/components/home/home-partner-voice-card"
import { VOICE_SLOTS } from "@/components/home/home-partner-constellation-config"
import { usePartnerConstellation } from "@/components/home/hooks/use-partner-constellation"

type HomePartnerMembersProps = {
  members: ReadonlyArray<HomePartnerMember>
  voices: ReadonlyArray<HomePartnerVoice>
}

function HomePartnerMembers({ members, voices }: HomePartnerMembersProps) {
  const {
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
  } = usePartnerConstellation(members)

  const visibleVoices = voices.slice(0, VOICE_SLOTS.length)

  return (
    <div
      ref={fieldRef}
      data-revealed={revealed ? "true" : "false"}
      className="home-partner-constellation relative h-80 w-full sm:h-96 md:h-[32rem]"
    >
      <HomeApertureCanvas active={revealed} />

      <div className="absolute inset-0">
        {visibleMembers.map((member, index) => (
          <HomePartnerAvatar
            key={member.id}
            member={member}
            slot={slots[index]!}
            index={index}
            center={positions[member.id]}
            isEnlarged={enlargedId === member.id}
            isDragging={draggingId === member.id}
            isSmUp={isSmUp}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerEnd={handlePointerEnd}
          />
        ))}
      </div>

      {visibleVoices.map((voice, index) => (
        <HomePartnerVoiceCard
          key={`${voice.role}-${voice.quote}`}
          voice={voice}
          slot={VOICE_SLOTS[index]!}
          index={index}
        />
      ))}
    </div>
  )
}

export { HomePartnerMembers }
