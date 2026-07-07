export const LOCALES = ["en", "es"] as const

export type Locale = (typeof LOCALES)[number]

export type PillarId = "academy" | "agentic" | "aperture"

export type PageMeta = {
  title: string
  description: string
}

export type NavItem = {
  label: string
  href: string
}

export type NavContent = {
  pillars: ReadonlyArray<{
    id: PillarId
    label: string
    href: string
  }>
  contact: NavItem
  cta: NavItem
}

export type FooterColumn = {
  title: string
  links: ReadonlyArray<NavItem>
}

export type FooterContent = {
  brandLine: string
  columns: ReadonlyArray<FooterColumn>
  copyright: string
}

export type ContactInterestOption = {
  value: PillarId
  label: string
}

export type ContactFormContent = {
  sectionId: "contact"
  title: string
  lead: string
  nameLabel: string
  emailLabel: string
  companyLabel: string
  interestLabel: string
  interestOptions: ReadonlyArray<ContactInterestOption>
  messageLabel: string
  submit: string
  submitting: string
  success: string
  error: string
}

export type ChromeContent = {
  nav: NavContent
  footer: FooterContent
  contact: ContactFormContent
}

export type CtaLink = {
  label: string
  href: string
}

export type HomeHeroContent = {
  h1: string
  sub: string
  primaryCta: CtaLink
  secondaryCta: CtaLink
}

export type ProofMetric = {
  value: string
  label: string
}

export type ProofContent = {
  metrics: ReadonlyArray<ProofMetric>
  partnersLine: string
}

export type HomePillarCard = {
  id: PillarId
  name: string
  title: string
  body: string
  cta: CtaLink
}

export type HomePillarsContent = {
  sectionId: "pillars"
  title: string
  items: ReadonlyArray<HomePillarCard>
}

export type TextBlock = {
  title: string
  body: string
}

export type FoundersContent = TextBlock & {
  details: ReadonlyArray<string>
}

export type BrandBandContent = {
  line: string
  cta: CtaLink
}

export type HomeContent = {
  meta: PageMeta
  hero: HomeHeroContent
  proof: ProofContent
  pillars: HomePillarsContent
  community: TextBlock
  founders: FoundersContent
  brandBand: BrandBandContent
}

export type PillarHeroContent = {
  overline: string
  h1: string
  sub: string
  primaryCta: CtaLink
  secondaryCta: CtaLink
}

export type ClosingCtaContent = {
  line: string
  interest: PillarId
  href: string
}

export type AcademyContent = {
  meta: PageMeta
  hero: PillarHeroContent
  whatYouGet: {
    title: string
    items: ReadonlyArray<string>
  }
  programs: {
    title: string
    items: ReadonlyArray<{ name: string; blurb: string }>
  }
  whoItsFor: string
  closingCta: ClosingCtaContent
}

export type AgenticContent = {
  meta: PageMeta
  hero: PillarHeroContent
  whatWeBuild: {
    title: string
    items: ReadonlyArray<string>
  }
  whoItsFor: string
  guardrails: string
  closingCta: ClosingCtaContent
}

export type ApertureSide = {
  id: "people" | "partners"
  title: string
  body: string
}

export type ApertureContent = {
  meta: PageMeta
  hero: PillarHeroContent
  twoSides: {
    title: string
    items: ReadonlyArray<ApertureSide>
  }
  offers: {
    title: string
    items: ReadonlyArray<string>
  }
  guardrail: string
  closingCta: ClosingCtaContent
}

export type MicrocopyContent = {
  loading: string
  notFoundTitle: string
  notFoundBody: string
  notFoundCtaHome: string
  languageSwitch: string
  requiredField: string
  invalidEmail: string
}

export type SiteContent = {
  locale: Locale
  chrome: ChromeContent
  home: HomeContent
  academy: AcademyContent
  agentic: AgenticContent
  aperture: ApertureContent
  microcopy: MicrocopyContent
}
