import { useEffect, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { QrCodeIcon } from "@hugeicons/core-free-icons"
import QRCode from "react-qr-code"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { buttonVariants } from "@/components/ui/button"
import type { CampaignQrCopy } from "@/content/types"
import { cn } from "@/lib/utils"

export function RedeemQrModal({
  content,
  onDark = true,
}: {
  content: CampaignQrCopy
  onDark?: boolean
}) {
  const [siteUrl, setSiteUrl] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) {
      return
    }
    setSiteUrl(window.location.href)
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "gap-1.5 text-xs font-semibold tracking-wider uppercase",
          onDark && "text-on-dark hover:bg-on-dark/10 hover:text-on-dark"
        )}
        aria-label={content.qrTitle}
      >
        <HugeiconsIcon icon={QrCodeIcon} strokeWidth={2} />
        {content.qrCta}
      </DialogTrigger>
      <DialogContent
        showCloseButton
        className={cn(
          "flex w-full max-w-[min(94vw,40rem)] flex-col items-center gap-8 overflow-hidden rounded-3xl border-on-dark/15 bg-black/80 p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md sm:max-w-160 sm:gap-10 sm:p-12",
          "supports-backdrop-filter:bg-black/60",
          "**:data-[slot=dialog-close]:text-on-dark **:data-[slot=dialog-close]:hover:bg-on-dark/10"
        )}
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <DialogTitle className="font-display text-on-dark text-2xl font-semibold tracking-tight sm:text-3xl">
            {content.qrTitle}
          </DialogTitle>
          <DialogDescription className="text-on-dark/70 max-w-md text-base leading-relaxed sm:text-lg">
            {content.qrBody}
          </DialogDescription>
        </div>

        <div className="bg-on-dark flex aspect-square w-full max-w-[min(78vw,28rem)] items-center justify-center rounded-2xl p-6 shadow-[0_12px_40px_rgba(0,0,0,0.35)] sm:p-8">
          {siteUrl ? (
            <QRCode
              value={siteUrl}
              size={256}
              className="size-full max-h-full max-w-full"
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              viewBox="0 0 256 256"
            />
          ) : (
            <div
              className="bg-muted size-full animate-pulse rounded-lg"
              aria-hidden
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
