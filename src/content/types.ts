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

export type ChromeContent = {
  nav: NavContent
  footer: FooterContent
}

export type MicrocopyContent = {
  loading: string
  notFoundTitle: string
  notFoundBody: string
  notFoundCtaHome: string
  languageSwitch: string
  skipToContent: string
  menuOpen: string
  menuClose: string
  themeCycle: string
  themeToLight: string
  themeToDark: string
  themeToSystem: string
}

export type RedeemProductCopy = {
  title: string
  blurb: string
}

export type RedeemStep = {
  title: string
  body: string
}

export type RedeemContent = {
  metaTitle: string
  eventLabel: string
  howItWorksLabel: string
  steps: ReadonlyArray<RedeemStep>
  poweredBy: string
  signInPrompt: string
  signInCta: string
  claimCta: string
  claiming: string
  signedInAs: string
  signOutCta: string
  yourCodes: string
  alreadyRedeemed: string
  copyCode: string
  copied: string
  invalidTitle: string
  invalidBody: string
  inactiveTitle: string
  inactiveBody: string
  notEligibleTitle: string
  notEligibleBody: string
  soldOutTitle: string
  soldOutBody: string
  noVerifiedEmailTitle: string
  noVerifiedEmailBody: string
  missingCodeTitle: string
  missingCodeBody: string
  poolLabels: {
    CURSOR: string
    CODEX: string
    OPENAI: string
  }
  products: {
    cursor: RedeemProductCopy
    codex: RedeemProductCopy
    openai: RedeemProductCopy
    codexOpenai: RedeemProductCopy
  }
}

export type HomeStatIcon = "builders" | "events" | "partners"

export type HomeStat = {
  value: string
  label: string
  icon?: HomeStatIcon
}

export type HomeHeroContent = {
  label: string
  headline: string
  body: string
  primaryCta: NavItem
  secondaryCta: NavItem
  proof: HomeStat
  slides: ReadonlyArray<HomeStat>
  mediaSrcs: ReadonlyArray<string>
  mediaAlt: string
}

export type HomeAboutContent = {
  label: string
  body: string
  stats: readonly [HomeStat, HomeStat]
  bold: string
  mediaSrcs: ReadonlyArray<string>
  mediaAlt: string
  toastTitle: string
  toastMeta: string
}

export type HomeAccordionItem = {
  id: PillarId
  title: string
  subtitle: string
  body: string
}

export type HomeFeaturesContent = {
  label: string
  headline: string
  cta: NavItem
  showcaseImageSrcs: ReadonlyArray<string>
  showcaseImageAlt: string
  accordion: ReadonlyArray<HomeAccordionItem>
}

export type HomePartnerVoice = {
  quote: string
  role: string
}

export type HomePartnerMember = {
  id: string
  initial: string
  imageSrc?: string
  imageAlt?: string
}

export type HomePartnerContent = {
  headline: string
  lead: string
  voices: ReadonlyArray<HomePartnerVoice>
  members: ReadonlyArray<HomePartnerMember>
}

export type HomeTrustContent = {
  label: string
  headline: string
  stat: HomeStat
  quote: string
  attribution: string
  portraitSrcs: ReadonlyArray<string>
  portraitAlt: string
}

export type HomeContactInterest = {
  value: PillarId
  label: string
}

export type HomeContactContent = {
  title: string
  lead: string
  nameLabel: string
  emailLabel: string
  companyLabel: string
  interestLabel: string
  interestOptions: ReadonlyArray<HomeContactInterest>
  messageLabel: string
  submit: string
  submitting: string
  success: string
  error: string
}

export type HomeContent = {
  hero: HomeHeroContent
  about: HomeAboutContent
  features: HomeFeaturesContent
  partner: HomePartnerContent
  trust: HomeTrustContent
  contact: HomeContactContent
}

export type SiteContent = {
  locale: Locale
  meta: PageMeta
  chrome: ChromeContent
  microcopy: MicrocopyContent
  home: HomeContent
  redeem: RedeemContent
}
