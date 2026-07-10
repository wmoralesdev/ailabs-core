import type { HomePartnerContent } from "@/content"
import { HomePartnerMembers } from "@/components/home/home-partner-members"
import { cn } from "@/lib/utils"
import {
  homeDisplayClassName,
  homeShellClassName,
} from "@/components/home/home-styles"

type HomePartnerProps = {
  partner: HomePartnerContent
}

function HomePartner({ partner }: HomePartnerProps) {
  return (
    <section className={cn(homeShellClassName, "flex flex-col gap-6 sm:gap-8")}>
      <div className="flex max-w-2xl flex-col gap-3">
        <h2
          className={cn(
            homeDisplayClassName,
            "text-3xl sm:text-4xl md:text-5xl"
          )}
        >
          {partner.headline}
        </h2>
        <p className="text-muted-foreground max-w-xl text-sm leading-relaxed md:text-base">
          {partner.lead}
        </p>
      </div>

      <HomePartnerMembers members={partner.members} voices={partner.voices} />
    </section>
  )
}

export { HomePartner }
