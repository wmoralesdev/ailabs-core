import type { SiteContent } from "./types"

export const es: SiteContent = {
  locale: "es",
  chrome: {
    nav: {
      pillars: [
        { id: "academy", label: "Academy", href: "/academy" },
        { id: "agentic", label: "Agentic", href: "/agentic" },
        { id: "aperture", label: "Aperture", href: "/aperture" },
      ],
      contact: { label: "Contacto", href: "#contact" },
      cta: { label: "Hablemos", href: "#contact" },
    },
    footer: {
      brandLine:
        "Ai Labs ayuda a las empresas a adaptarse, desarrollar y aprender con IA.",
      columns: [
        {
          title: "Pilares",
          links: [
            { label: "Academy", href: "/academy" },
            { label: "Agentic", href: "/agentic" },
            { label: "Aperture", href: "/aperture" },
          ],
        },
        {
          title: "Compañía",
          links: [
            { label: "Contacto", href: "#contact" },
            { label: "ailabs.sv", href: "https://ailabs.sv" },
          ],
        },
        {
          title: "Redes",
          links: [],
        },
      ],
      copyright: "© {year} Ai Labs",
    },
    contact: {
      sectionId: "contact",
      title: "Hablemos",
      lead: "Cuéntanos qué necesitas: formación, software, o conectar con la comunidad. Te respondemos.",
      nameLabel: "Nombre",
      emailLabel: "Correo",
      companyLabel: "Empresa",
      interestLabel: "¿En qué te interesa?",
      interestOptions: [
        { value: "academy", label: "Academy" },
        { value: "agentic", label: "Agentic" },
        { value: "aperture", label: "Aperture" },
      ],
      messageLabel: "Mensaje",
      submit: "Enviar mensaje",
      submitting: "Enviando…",
      success: "Gracias — te contactamos pronto.",
      error: "Algo falló. Intenta de nuevo o escríbenos.",
    },
  },
  home: {
    meta: {
      title: "Ai Labs — Adáptate, desarrolla y aprende con IA",
      description:
        "Ai Labs ayuda a las empresas a adaptarse, desarrollar y aprender con IA a través de Academy, Agentic y Aperture. Con base en El Salvador.",
    },
    hero: {
      h1: "Adáptate, desarrolla y aprende con IA",
      sub: "Ai Labs ayuda a las empresas con formación, desarrollo de software y una comunidad real de builders. Con base en El Salvador — y más allá.",
      primaryCta: { label: "Hablemos", href: "#contact" },
      secondaryCta: { label: "Conoce los pilares", href: "#pillars" },
    },
    proof: {
      metrics: [
        { value: "700+", label: "Builders" },
        { value: "30+", label: "Eventos" },
        { value: "8", label: "Partners" },
      ],
      partnersLine:
        "Cursor, Codex, ElevenLabs, Notion, Devin, Mistral y más — con trabajo real de ambassadors y partners.",
    },
    pillars: {
      sectionId: "pillars",
      title: "Tres formas de trabajar con nosotros",
      items: [
        {
          id: "academy",
          name: "Academy",
          title: "Aprende con nosotros",
          body: "Consultorías, talleres, bootcamps y residencias para aprender IA en la práctica.",
          cta: { label: "Ver Academy", href: "/academy" },
        },
        {
          id: "agentic",
          name: "Agentic",
          title: "Construye con nosotros",
          body: "Desarrollo de software bajo demanda — más flujos y automatización — con IA.",
          cta: { label: "Ver Agentic", href: "/agentic" },
        },
        {
          id: "aperture",
          name: "Aperture",
          title: "Conéctate con nosotros",
          body: "Un hub de comunidad e innovación que conecta personas, perfiles con los que trabajamos y las empresas que representamos.",
          cta: { label: "Ver Aperture", href: "/aperture" },
        },
      ],
    },
    community: {
      title: "Sobre la comunidad",
      body: "La comunidad no es un cuarto producto. Alimenta confianza, talento, eventos y relevancia con partners en Academy, Agentic y Aperture.",
    },
    founders: {
      title: "Fundado por builders",
      body: "Walter Morales y Daniela Lopez — ingenieros de software. Ambassadors y Regional Leads de herramientas que usamos de verdad.",
      details: [
        "Walter: Cursor Regional Lead; Codex, Devin, Mistral Ambassador.",
        "Daniela: ElevenLabs Ambassador; Cursor Ambassador; Notion Builder.",
      ],
    },
    brandBand: {
      line: "IA práctica. Trabajo real. Personas reales.",
      cta: { label: "Hablemos", href: "#contact" },
    },
  },
  academy: {
    meta: {
      title: "Ai Labs Academy — Aprende IA en la práctica",
      description:
        "Consultorías, talleres, bootcamps y residencias de Ai Labs.",
    },
    hero: {
      overline: "Ai Labs Academy",
      h1: "Aprende IA usándola de verdad",
      sub: "Consultorías, talleres, bootcamps y residencias para equipos, founders, estudiantes y personas buscando oportunidades.",
      primaryCta: { label: "Forma a tu equipo", href: "#contact" },
      secondaryCta: { label: "Hablemos", href: "#contact" },
    },
    whatYouGet: {
      title: "Cómo es Academy",
      items: [
        "Consultorías y talleres para empresas y equipos",
        "Bootcamps y residencias cuando el formato encaja",
        "Formación práctica — no clases pasivas",
      ],
    },
    programs: {
      title: "Ejemplos de programas",
      items: [
        {
          name: "Claude for Entrepreneurs",
          blurb: "Intensivo de un día para founders y operadores.",
        },
        {
          name: "Get Competitive Quick",
          blurb:
            "Experiencia de un día para estudiantes y personas buscando oportunidades fuera de El Salvador.",
        },
        {
          name: "AI and Automation",
          blurb: "Formación para empresas que quieren escalar operaciones.",
        },
      ],
    },
    whoItsFor:
      "Empresas, sponsors, universidades y participantes — según quién financie el formato. En la sala: founders, operadores, estudiantes y builders.",
    closingCta: {
      line: "Lleva Academy a tu equipo.",
      interest: "academy",
      href: "#contact",
    },
  },
  agentic: {
    meta: {
      title: "Ai Labs Agentic — Software y flujos con IA",
      description:
        "Desarrollo de software bajo demanda y automatización de flujos con Ai Labs.",
    },
    hero: {
      overline: "Ai Labs Agentic",
      h1: "Software bajo demanda, construido con IA",
      sub: "Productos, herramientas internas y automatización de flujos para startups, empresas e inversores que necesitan pasar de idea a algo usable.",
      primaryCta: { label: "Construyamos", href: "#contact" },
      secondaryCta: { label: "Hablemos", href: "#contact" },
    },
    whatWeBuild: {
      title: "Trabajo típico",
      items: [
        "Productos y MVPs",
        "Herramientas internas",
        "Automatización de flujos",
        "Sistemas operativos / de operación",
        "Iteración y partnership técnico",
      ],
    },
    whoItsFor:
      "Startups construyendo un producto. Empresas buscando un partner digital. Inversores con conceptos o MVPs para llevar más lejos.",
    guardrails:
      "No somos staff augmentation, y no vendemos \"agentes de IA\" como magia. El alcance queda claro antes de vender autonomía.",
    closingCta: {
      line: "Cuéntanos qué quieres lanzar.",
      interest: "agentic",
      href: "#contact",
    },
  },
  aperture: {
    meta: {
      title: "Ai Labs Aperture — Hub de comunidad e innovación",
      description:
        "Conéctate con la comunidad, la red y las empresas partner de Ai Labs.",
    },
    hero: {
      overline: "Ai Labs Aperture",
      h1: "Conecta personas y empresas al ecosistema de IA a nuestro alrededor",
      sub: "Un hub de comunidad e innovación: presentaciones, programas, eventos y canales con partners cuando son reales.",
      primaryCta: { label: "Sé partner", href: "#contact" },
      secondaryCta: { label: "Hablemos", href: "#contact" },
    },
    twoSides: {
      title: "Personas y partners",
      items: [
        {
          id: "people",
          title: "Personas",
          body: "Conecta participantes con otros perfiles de la red, y acércalos a las empresas que representamos o con las que hacemos partnership.",
        },
        {
          id: "partners",
          title: "Partners",
          body: "Ayuda a sponsors, empresas e instituciones a participar en el ecosistema con programas, eventos, créditos cuando hay, e introducciones.",
        },
      ],
    },
    offers: {
      title: "Qué ofrece Aperture",
      items: [
        "Dirección sobre cómo participar en el ecosistema",
        "Acceso a la red de Ai Labs",
        "Introducciones relevantes cuando corresponde",
        "Programación y facilitación de comunidad",
        "Créditos y oportunidades cuando hay",
      ],
    },
    guardrail:
      "Podemos prometer dirección, programación, facilitación e introducciones relevantes. No podemos prometer resultados controlados por terceros.",
    closingCta: {
      line: "Diseñemos cómo te conectas a la red.",
      interest: "aperture",
      href: "#contact",
    },
  },
  microcopy: {
    loading: "Cargando…",
    notFoundTitle: "Página no encontrada",
    notFoundBody: "Esa página no existe. Vuelve al inicio o háblanos.",
    notFoundCtaHome: "Ir al inicio",
    languageSwitch: "EN",
    requiredField: "Obligatorio",
    invalidEmail: "Ingresa un correo válido",
  },
}
