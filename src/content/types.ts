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
  yourCode: string
  yourCodes: string
  alreadyRedeemed: string
  copyCode: string
  copied: string
  openCode: string
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

export type HomeHeroBuilder = {
  name: string
  initial: string
  imageSrc?: string
  imageAlt?: string
}

export type HomeHeroContent = {
  label: string
  headline: string
  body: string
  primaryCta: NavItem
  secondaryCta: NavItem
  proof: HomeStat
  builders: ReadonlyArray<HomeHeroBuilder>
  slides: ReadonlyArray<HomeStat>
  mediaSrcs: ReadonlyArray<string>
  mediaAlt: string
}

export type HomeAboutBridgeItem = {
  title: string
  body: string
}

export type HomeAboutContent = {
  label: string
  body: string
  stats: readonly [HomeStat, HomeStat]
  bold: string
  bridgeLabel: string
  bridge: readonly [
    HomeAboutBridgeItem,
    HomeAboutBridgeItem,
    HomeAboutBridgeItem,
  ]
  mediaSrcs: ReadonlyArray<string>
  mediaAlt: string
  toastTitle: string
  toastMeta: string
}

export type HomePillarPoint = {
  title: string
  body: string
}

/** A standalone pillar section (Academy, Agentic). */
export type HomePillarContent = {
  id: Extract<PillarId, "academy" | "agentic">
  index: string
  eyebrow: string
  title: string
  lead: string
  points: ReadonlyArray<HomePillarPoint>
  cta: NavItem
  mediaSrcs: ReadonlyArray<string>
  mediaAlt: string
}

export type HomePartnerVoice = {
  quote: string
  name: string
  role: string
}

export type HomePartnerMember = {
  id: string
  initial: string
  imageSrc?: string
  imageAlt?: string
}

/** Aperture section — the funnel/community pillar (absorbs former Partner + Trust). */
export type HomeApertureContent = {
  id: "aperture"
  index: string
  eyebrow: string
  title: string
  lead: string
  stat: HomeStat
  quote: string
  attribution: string
  voices: ReadonlyArray<HomePartnerVoice>
  members: ReadonlyArray<HomePartnerMember>
  cta: NavItem
}

export type HomeContactInterest = {
  value: PillarId
  label: string
}

export type HomeContactContent = {
  title: string
  lead: string
  nameLabel: string
  namePlaceholder: string
  emailLabel: string
  emailPlaceholder: string
  companyLabel: string
  companyPlaceholder: string
  interestLabel: string
  interestOptions: ReadonlyArray<HomeContactInterest>
  messageLabel: string
  messagePlaceholder: string
  submit: string
  submitting: string
  success: string
  error: string
}

export type HomeContent = {
  hero: HomeHeroContent
  about: HomeAboutContent
  academy: HomePillarContent
  agentic: HomePillarContent
  aperture: HomeApertureContent
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
