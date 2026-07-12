import type { HomePartnerVoice } from "@/content"
import type { VoiceSlot } from "@/components/home/home-partner-constellation-config"

type HomePartnerVoiceCardProps = {
  voice: HomePartnerVoice
  slot: VoiceSlot
  index: number
}

function HomePartnerVoiceCard({ voice, slot, index }: HomePartnerVoiceCardProps) {
  return (
    <figure
      className="home-partner-voice absolute z-10 max-w-[11.5rem] rounded-2xl border border-border/80 bg-background/95 px-4 py-3 shadow-soft backdrop-blur-sm sm:max-w-[15rem]"
      style={{
        top: slot.top,
        left: slot.anchor === "left" ? slot.left : undefined,
        right: slot.anchor === "right" ? "2%" : undefined,
        ["--i" as string]: index + 6,
      }}
    >
      <blockquote className="text-foreground text-sm leading-snug font-medium sm:text-base">
        {voice.quote}
      </blockquote>
      <figcaption className="mt-2 flex flex-col gap-0.5">
        <span className="text-foreground text-[0.72rem] font-semibold sm:text-xs">
          {voice.name}
        </span>
        <span className="text-muted-foreground text-[0.65rem] tracking-wide uppercase sm:text-[0.7rem]">
          {voice.role}
        </span>
      </figcaption>
    </figure>
  )
}

export { HomePartnerVoiceCard }
