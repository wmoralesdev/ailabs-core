import { useState } from "react"
import type { FormEvent } from "react"

import type { HomeContactContent, PillarId } from "@/content"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import {
  homeCardClassName,
  homeDisplayClassName,
  homeShellClassName,
} from "@/components/home/home-styles"

type HomeContactProps = {
  contact: HomeContactContent
}

type FormStatus = "idle" | "submitting" | "success" | "error"

const fieldClassName =
  "h-11 rounded-xl border-border bg-background text-sm shadow-none md:text-sm"

const textareaClassName =
  "min-h-28 rounded-xl border-border bg-background text-sm shadow-none md:text-sm"

const labelClassName = "text-sm font-medium text-foreground"

function HomeContact({ contact }: HomeContactProps) {
  const [status, setStatus] = useState<FormStatus>("idle")
  const [interest, setInterest] = useState<PillarId>(
    contact.interestOptions[0]?.value ?? "academy"
  )

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }

    setStatus("submitting")
    window.setTimeout(() => {
      setStatus("success")
      form.reset()
      setInterest(contact.interestOptions[0]?.value ?? "academy")
    }, 400)
  }

  return (
    <section id="contact" className={cn(homeShellClassName, "scroll-mt-8 pb-16 md:pb-24")}>
      <div
        className={cn(
          homeCardClassName,
          "grid w-full gap-8 p-6 sm:p-8 md:gap-10 md:p-10",
          "lg:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)] lg:items-start lg:gap-14"
        )}
      >
        <div className="flex max-w-md flex-col gap-3 lg:sticky lg:top-24">
          <h2
            className={cn(
              homeDisplayClassName,
              "text-3xl normal-case sm:text-4xl md:text-5xl"
            )}
          >
            {contact.title}
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed md:text-lg">
            {contact.lead}
          </p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="contact-name" className={labelClassName}>
                {contact.nameLabel}
              </Label>
              <Input
                id="contact-name"
                name="name"
                required
                autoComplete="name"
                placeholder={contact.namePlaceholder}
                className={fieldClassName}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="contact-email" className={labelClassName}>
                {contact.emailLabel}
              </Label>
              <Input
                id="contact-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder={contact.emailPlaceholder}
                className={fieldClassName}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="contact-company" className={labelClassName}>
              {contact.companyLabel}
            </Label>
            <Input
              id="contact-company"
              name="company"
              autoComplete="organization"
              placeholder={contact.companyPlaceholder}
              className={fieldClassName}
            />
          </div>

          <fieldset className="flex flex-col gap-3">
            <legend className={cn(labelClassName, "mb-2")}>{contact.interestLabel}</legend>
            <div className="flex flex-wrap gap-2">
              {contact.interestOptions.map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    "cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    interest === option.value
                      ? "border-purple bg-background text-graphite"
                      : "border-border bg-background/70 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <input
                    type="radio"
                    name="interest"
                    value={option.value}
                    checked={interest === option.value}
                    onChange={() => setInterest(option.value)}
                    className="sr-only"
                    required
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="flex flex-col gap-2">
            <Label htmlFor="contact-message" className={labelClassName}>
              {contact.messageLabel}
            </Label>
            <Textarea
              id="contact-message"
              name="message"
              required
              rows={4}
              placeholder={contact.messagePlaceholder}
              className={textareaClassName}
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              type="submit"
              disabled={status === "submitting"}
              className="h-11 rounded-full px-6 text-sm"
            >
              {status === "submitting" ? contact.submitting : contact.submit}
            </Button>
            {status === "success" ? (
              <p className="text-sm text-foreground" role="status">
                {contact.success}
              </p>
            ) : null}
            {status === "error" ? (
              <p className="text-destructive text-sm" role="alert">
                {contact.error}
              </p>
            ) : null}
          </div>
        </form>
      </div>
    </section>
  )
}

export { HomeContact }
