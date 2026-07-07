import type { SiteContent } from "./types"

export const en: SiteContent = {
  locale: "en",
  chrome: {
    nav: {
      pillars: [
        { id: "academy", label: "Academy", href: "/academy" },
        { id: "agentic", label: "Agentic", href: "/agentic" },
        { id: "aperture", label: "Aperture", href: "/aperture" },
      ],
      contact: { label: "Contact", href: "#contact" },
      cta: { label: "Talk to us", href: "#contact" },
    },
    footer: {
      brandLine:
        "Ai Labs helps companies adapt, develop, and learn with AI.",
      columns: [
        {
          title: "Pillars",
          links: [
            { label: "Academy", href: "/academy" },
            { label: "Agentic", href: "/agentic" },
            { label: "Aperture", href: "/aperture" },
          ],
        },
        {
          title: "Company",
          links: [
            { label: "Contact", href: "#contact" },
            { label: "ailabs.sv", href: "https://ailabs.sv" },
          ],
        },
        {
          title: "Social",
          links: [],
        },
      ],
      copyright: "© {year} Ai Labs",
    },
    contact: {
      sectionId: "contact",
      title: "Talk to us",
      lead: "Tell us what you need — training, software, or a way into the community. We'll follow up.",
      nameLabel: "Name",
      emailLabel: "Email",
      companyLabel: "Company",
      interestLabel: "What are you interested in?",
      interestOptions: [
        { value: "academy", label: "Academy" },
        { value: "agentic", label: "Agentic" },
        { value: "aperture", label: "Aperture" },
      ],
      messageLabel: "Message",
      submit: "Send message",
      submitting: "Sending…",
      success: "Thanks — we'll get back to you soon.",
      error: "Something went wrong. Try again or email us.",
    },
  },
  home: {
    meta: {
      title: "Ai Labs — Adapt, develop, and learn with AI",
      description:
        "Ai Labs helps companies adapt, develop, and learn with AI through Academy, Agentic, and Aperture. Based in El Salvador.",
    },
    hero: {
      h1: "Adapt, develop, and learn with AI",
      sub: "Ai Labs helps companies through teaching, software work, and a real builder community. Based in El Salvador — open beyond.",
      primaryCta: { label: "Talk to us", href: "#contact" },
      secondaryCta: { label: "Explore the pillars", href: "#pillars" },
    },
    proof: {
      metrics: [
        { value: "700+", label: "Builders" },
        { value: "30+", label: "Events" },
        { value: "8", label: "Partners" },
      ],
      partnersLine:
        "Cursor, Codex, ElevenLabs, Notion, Devin, Mistral, and more — through real ambassador and partner work.",
    },
    pillars: {
      sectionId: "pillars",
      title: "Three ways to work with us",
      items: [
        {
          id: "academy",
          name: "Academy",
          title: "Learn with us",
          body: "Consultancies, workshops, bootcamps, and residencies so people learn AI in practice.",
          cta: { label: "See Academy", href: "/academy" },
        },
        {
          id: "agentic",
          name: "Agentic",
          title: "Build with us",
          body: "Software development on demand — plus workflows and automation — done with AI.",
          cta: { label: "See Agentic", href: "/agentic" },
        },
        {
          id: "aperture",
          name: "Aperture",
          title: "Connect with us",
          body: "A community and innovation hub that links people, profiles we work with, and the companies we represent.",
          cta: { label: "See Aperture", href: "/aperture" },
        },
      ],
    },
    community: {
      title: "Built on community",
      body: "The community is not a fourth product. It feeds trust, talent, events, and partner relevance across Academy, Agentic, and Aperture.",
    },
    founders: {
      title: "Co-founded by builders",
      body: "Walter Morales and Daniela Lopez — software engineers. Ambassadors and Regional Leads across tools we actually use.",
      details: [
        "Walter: Cursor Regional Lead; Codex, Devin, Mistral Ambassador.",
        "Daniela: ElevenLabs Ambassador; Cursor Ambassador; Notion Builder.",
      ],
    },
    brandBand: {
      line: "Practical AI. Real work. Real people.",
      cta: { label: "Talk to us", href: "#contact" },
    },
  },
  academy: {
    meta: {
      title: "Ai Labs Academy — Learn AI in practice",
      description:
        "Consultancies, workshops, bootcamps, and residencies from Ai Labs.",
    },
    hero: {
      overline: "Ai Labs Academy",
      h1: "Learn AI by building with it",
      sub: "Consultancies, workshops, bootcamps, and residencies for teams, founders, students, and job seekers.",
      primaryCta: { label: "Train your team", href: "#contact" },
      secondaryCta: { label: "Talk to us", href: "#contact" },
    },
    whatYouGet: {
      title: "What Academy looks like",
      items: [
        "Consultancies and workshops for companies and teams",
        "Bootcamps and residencies when the format fits",
        "Practical training — not passive lectures",
      ],
    },
    programs: {
      title: "Program examples",
      items: [
        {
          name: "Claude for Entrepreneurs",
          blurb: "A one-day intensive for founders and operators.",
        },
        {
          name: "Get Competitive Quick",
          blurb:
            "A full-day experience for students and job seekers looking for opportunities beyond El Salvador.",
        },
        {
          name: "AI and Automation",
          blurb: "Training for companies that want to scale operations.",
        },
      ],
    },
    whoItsFor:
      "Companies, sponsors, universities, and participants — whoever funds the format. The people in the room are founders, operators, students, and builders.",
    closingCta: {
      line: "Bring Academy to your team.",
      interest: "academy",
      href: "#contact",
    },
  },
  agentic: {
    meta: {
      title: "Ai Labs Agentic — Software and workflows with AI",
      description:
        "On-demand software development and workflow automation from Ai Labs.",
    },
    hero: {
      overline: "Ai Labs Agentic",
      h1: "Software on demand, built with AI",
      sub: "Products, internal tools, and workflow automation for startups, companies, and investors who need to move from idea to something usable.",
      primaryCta: { label: "Build with us", href: "#contact" },
      secondaryCta: { label: "Talk to us", href: "#contact" },
    },
    whatWeBuild: {
      title: "Typical work",
      items: [
        "Products and MVPs",
        "Internal tools",
        "Workflow automation",
        "Operational systems",
        "Iteration and technical partnership",
      ],
    },
    whoItsFor:
      "Startups building a product. Companies looking for a digital partner. Investors with concepts or MVPs to take further.",
    guardrails:
      "We're not staff augmentation, and we don't sell \"AI agents\" as magic. Scope stays clear before we oversell autonomy.",
    closingCta: {
      line: "Tell us what you want to ship.",
      interest: "agentic",
      href: "#contact",
    },
  },
  aperture: {
    meta: {
      title: "Ai Labs Aperture — Community and innovation hub",
      description:
        "Connect with the Ai Labs community, network, and partner companies.",
    },
    hero: {
      overline: "Ai Labs Aperture",
      h1: "Connect people and companies to the AI ecosystem around us",
      sub: "A community and innovation hub — introductions, programs, events, and partner channels when they're real.",
      primaryCta: { label: "Partner with us", href: "#contact" },
      secondaryCta: { label: "Talk to us", href: "#contact" },
    },
    twoSides: {
      title: "People and partners",
      items: [
        {
          id: "people",
          title: "People",
          body: "Connect participants with other profiles in the network, and bring them closer to companies we represent or partner with.",
        },
        {
          id: "partners",
          title: "Partners",
          body: "Help sponsors, companies, and institutions engage the ecosystem through programs, events, credits when available, and introductions.",
        },
      ],
    },
    offers: {
      title: "What Aperture offers",
      items: [
        "Direction on how to engage the builder ecosystem",
        "Access to the Ai Labs network",
        "Relevant introductions when appropriate",
        "Community programming and facilitation",
        "Credits and opportunities when available",
      ],
    },
    guardrail:
      "We can promise direction, programming, facilitation, and relevant introductions. We can't promise outcomes controlled by third parties.",
    closingCta: {
      line: "Let's design how you plug into the network.",
      interest: "aperture",
      href: "#contact",
    },
  },
  microcopy: {
    loading: "Loading…",
    notFoundTitle: "Page not found",
    notFoundBody: "That page doesn't exist. Head home or talk to us.",
    notFoundCtaHome: "Back home",
    languageSwitch: "ES",
    requiredField: "Required",
    invalidEmail: "Enter a valid email",
  },
}
