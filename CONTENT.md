# Ai Labs Website Content

Build-ready page structure and copy for v1.

Related:

- `PRODUCT.md` — substance
- `BRAND.md` — voice and identity
- `STYLES.md` — tokens, components, motion

## Scope (v1)

Pages:

1. Home `/`
2. Academy `/academy`
3. Agentic `/agentic`
4. Aperture `/aperture`

Contact lives as a **section** on every page (form). No separate contact page required.

Languages: **English** and **Spanish**. Default language for first ship can follow browser / user preference; both must exist in the CMS or content module.

Primary CTA: **Talk to us** → scrolls to or focuses the contact form.

Form destination: **UI + copy only** for now. Wire email/API later.

Proof numbers: from `PRODUCT.md` (use as-is).

---

## Shared Chrome

### Nav

| Item     | EN       | ES         | Target          |
| -------- | -------- | ---------- | --------------- |
| Pillar 1 | Academy  | Academy    | `/academy`      |
| Pillar 2 | Agentic  | Agentic    | `/agentic`      |
| Pillar 3 | Aperture | Aperture   | `/aperture`     |
| Link     | Contact  | Contacto   | `#contact`      |
| CTA      | Talk to us | Hablemos | `#contact`    |

Pillar names stay **Academy / Agentic / Aperture** in both languages (brand terms). Descriptors translate.

### Footer

**EN — Brand line**

Ai Labs helps companies adapt, develop, and learn with AI.

**ES — Brand line**

Ai Labs ayuda a las empresas a adaptarse, desarrollar y aprender con IA.

**EN — Columns**

- Pillars: Academy, Agentic, Aperture
- Company: Contact, ailabs.sv
- Social: (placeholders — add real URLs when confirmed)

**ES — Columns**

- Pilares: Academy, Agentic, Aperture
- Compañía: Contacto, ailabs.sv
- Redes: (placeholders)

**Copyright**

© {year} Ai Labs

### Contact form (shared)

**Section id:** `contact`

| Element        | EN                         | ES                            |
| -------------- | -------------------------- | ----------------------------- |
| Title          | Talk to us                 | Hablemos                      |
| Lead           | Tell us what you need — training, software, or a way into the community. We’ll follow up. | Cuéntanos qué necesitas: formación, software, o conectar con la comunidad. Te respondemos. |
| Name label     | Name                       | Nombre                        |
| Email label    | Email                      | Correo                        |
| Company label  | Company                    | Empresa                       |
| Interest label | What are you interested in?| ¿En qué te interesa?          |
| Interest opts  | Academy / Agentic / Aperture | Academy / Agentic / Aperture |
| Message label  | Message                    | Mensaje                       |
| Submit         | Send message               | Enviar mensaje                |
| Submitting     | Sending…                   | Enviando…                     |
| Success        | Thanks — we’ll get back to you soon. | Gracias — te contactamos pronto. |
| Error          | Something went wrong. Try again or email us. | Algo falló. Intenta de nuevo o escríbenos. |

Field notes:

- Name, email, company, message, interest required (company optional if you prefer — **default: company optional**, others required).
- Interest: select or chips; values `academy` | `agentic` | `aperture`.
- Backend TBD.

---

## Home `/`

### Meta

|         | EN | ES |
| ------- | -- | -- |
| Title   | Ai Labs — Adapt, develop, and learn with AI | Ai Labs — Adáptate, desarrolla y aprende con IA |
| Description | Ai Labs helps companies adapt, develop, and learn with AI through Academy, Agentic, and Aperture. Based in El Salvador. | Ai Labs ayuda a las empresas a adaptarse, desarrollar y aprender con IA a través de Academy, Agentic y Aperture. Con base en El Salvador. |

### Hero

Layout: **asymmetric** — left copy, right brand mark / graphite panel (see `STYLES.md`). Not a centered mem0 clone.

|         | EN | ES |
| ------- | -- | -- |
| H1      | Adapt, develop, and learn with AI | Adáptate, desarrolla y aprende con IA |
| Sub     | Ai Labs helps companies through teaching, software work, and a real builder community. Based in El Salvador — open beyond. | Ai Labs ayuda a las empresas con formación, desarrollo de software y una comunidad real de builders. Con base en El Salvador — y más allá. |
| Primary CTA | Talk to us | Hablemos |
| Secondary CTA | Explore the pillars | Conoce los pilares |

Secondary CTA targets `#pillars`.

### Proof strip

| Metric | EN label | ES label |
| ------ | -------- | -------- |
| 700+   | Builders | Builders |
| 30+    | Events   | Eventos  |
| 8      | Partners | Partners |

Optional line under metrics:

**EN:** Cursor, Codex, ElevenLabs, Notion, Devin, Mistral, and more — through real ambassador and partner work.

**ES:** Cursor, Codex, ElevenLabs, Notion, Devin, Mistral y más — con trabajo real de ambassadors y partners.

### Pillars section (`#pillars`)

Layout: **asymmetric bento** — not three equal cards. One focal pillar (larger span) + two supporting tiles (see `STYLES.md`). Copy below stays the same; visual weight can favor the pillar most relevant to the campaign, defaulting to balanced rotation or Academy-first.

**EN — Section title:** Three ways to work with us  
**ES — Section title:** Tres formas de trabajar con nosotros

| Pillar   | EN title | ES title | EN body | ES body | CTA EN | CTA ES |
| -------- | -------- | -------- | ------- | ------- | ------ | ------ |
| Academy  | Learn with us | Aprende con nosotros | Consultancies, workshops, bootcamps, and residencies so people learn AI in practice. | Consultorías, talleres, bootcamps y residencias para aprender IA en la práctica. | See Academy | Ver Academy |
| Agentic  | Build with us | Construye con nosotros | Software development on demand — plus workflows and automation — done with AI. | Desarrollo de software bajo demanda — más flujos y automatización — con IA. | See Agentic | Ver Agentic |
| Aperture | Connect with us | Conéctate con nosotros | A community and innovation hub that links people, profiles we work with, and the companies we represent. | Un hub de comunidad e innovación que conecta personas, perfiles con los que trabajamos y las empresas que representamos. | See Aperture | Ver Aperture |

### How it fits

**EN — Title:** Built on community  
**EN — Body:** The community is not a fourth product. It feeds trust, talent, events, and partner relevance across Academy, Agentic, and Aperture.

**ES — Title:** Sobre la comunidad  
**ES — Body:** La comunidad no es un cuarto producto. Alimenta confianza, talento, eventos y relevancia con partners en Academy, Agentic y Aperture.

### Founders (short)

**EN — Title:** Co-founded by builders  
**EN — Body:** Walter Morales and Daniela Lopez — software engineers. Ambassadors and Regional Leads across tools we actually use.

**ES — Title:** Fundado por builders  
**ES — Body:** Walter Morales y Daniela Lopez — ingenieros de software. Ambassadors y Regional Leads de herramientas que usamos de verdad.

Detail lines (optional expand):

- Walter: Cursor Regional Lead; Codex, Devin, Mistral Ambassador.
- Daniela: ElevenLabs Ambassador; Cursor Ambassador; Notion Builder.

### Dark brand band (optional once)

**EN:** Practical AI. Real work. Real people.  
**ES:** IA práctica. Trabajo real. Personas reales.  
CTA → `#contact`

### Contact

Use shared form section.

---

## Academy `/academy`

### Meta

|         | EN | ES |
| ------- | -- | -- |
| Title   | Ai Labs Academy — Learn AI in practice | Ai Labs Academy — Aprende IA en la práctica |
| Description | Consultancies, workshops, bootcamps, and residencies from Ai Labs. | Consultorías, talleres, bootcamps y residencias de Ai Labs. |

### Hero

Layout: left-aligned copy; optional right visual (session photo or mark). Pillar pages can be slightly quieter than home.

|         | EN | ES |
| ------- | -- | -- |
| Overline| Ai Labs Academy | Ai Labs Academy |
| H1      | Learn AI by building with it | Aprende IA usándola de verdad |
| Sub     | Consultancies, workshops, bootcamps, and residencies for teams, founders, students, and job seekers. | Consultorías, talleres, bootcamps y residencias para equipos, founders, estudiantes y personas buscando oportunidades. |
| Primary CTA | Train your team | Forma a tu equipo |
| Secondary CTA | Talk to us | Hablemos |

Primary CTA → `#contact` with interest preselected `academy` when possible.

### What you get

**EN — Title:** What Academy looks like  
**ES — Title:** Cómo es Academy

| EN | ES |
| -- | -- |
| Consultancies and workshops for companies and teams | Consultorías y talleres para empresas y equipos |
| Bootcamps and residencies when the format fits | Bootcamps y residencias cuando el formato encaja |
| Practical training — not passive lectures | Formación práctica — no clases pasivas |

### Programs

**EN — Title:** Program examples  
**ES — Title:** Ejemplos de programas

| Name | EN blurb | ES blurb |
| ---- | -------- | -------- |
| Claude for Entrepreneurs | A one-day intensive for founders and operators. | Intensivo de un día para founders y operadores. |
| Get Competitive Quick | A full-day experience for students and job seekers looking for opportunities beyond El Salvador. | Experiencia de un día para estudiantes y personas buscando oportunidades fuera de El Salvador. |
| AI and Automation | Training for companies that want to scale operations. | Formación para empresas que quieren escalar operaciones. |

### Who it’s for

**EN:** Companies, sponsors, universities, and participants — whoever funds the format. The people in the room are founders, operators, students, and builders.

**ES:** Empresas, sponsors, universidades y participantes — según quién financie el formato. En la sala: founders, operadores, estudiantes y builders.

### Closing CTA

**EN:** Bring Academy to your team.  
**ES:** Lleva Academy a tu equipo.  
→ form, interest `academy`

---

## Agentic `/agentic`

### Meta

|         | EN | ES |
| ------- | -- | -- |
| Title   | Ai Labs Agentic — Software and workflows with AI | Ai Labs Agentic — Software y flujos con IA |
| Description | On-demand software development and workflow automation from Ai Labs. | Desarrollo de software bajo demanda y automatización de flujos con Ai Labs. |

### Hero

|         | EN | ES |
| ------- | -- | -- |
| Overline| Ai Labs Agentic | Ai Labs Agentic |
| H1      | Software on demand, built with AI | Software bajo demanda, construido con IA |
| Sub     | Products, internal tools, and workflow automation for startups, companies, and investors who need to move from idea to something usable. | Productos, herramientas internas y automatización de flujos para startups, empresas e inversores que necesitan pasar de idea a algo usable. |
| Primary CTA | Build with us | Construyamos |
| Secondary CTA | Talk to us | Hablemos |

Primary → `#contact`, interest `agentic`.

### What we build

**EN — Title:** Typical work  
**ES — Title:** Trabajo típico

| EN | ES |
| -- | -- |
| Products and MVPs | Productos y MVPs |
| Internal tools | Herramientas internas |
| Workflow automation | Automatización de flujos |
| Operational systems | Sistemas operativos / de operación |
| Iteration and technical partnership | Iteración y partnership técnico |

### Who it’s for

**EN:** Startups building a product. Companies looking for a digital partner. Investors with concepts or MVPs to take further.

**ES:** Startups construyendo un producto. Empresas buscando un partner digital. Inversores con conceptos o MVPs para llevar más lejos.

### Guardrails (short, honest)

**EN:** We’re not staff augmentation, and we don’t sell “AI agents” as magic. Scope stays clear before we oversell autonomy.

**ES:** No somos staff augmentation, y no vendemos “agentes de IA” como magia. El alcance queda claro antes de vender autonomía.

### Closing CTA

**EN:** Tell us what you want to ship.  
**ES:** Cuéntanos qué quieres lanzar.  
→ form, interest `agentic`

---

## Aperture `/aperture`

### Meta

|         | EN | ES |
| ------- | -- | -- |
| Title   | Ai Labs Aperture — Community and innovation hub | Ai Labs Aperture — Hub de comunidad e innovación |
| Description | Connect with the Ai Labs community, network, and partner companies. | Conéctate con la comunidad, la red y las empresas partner de Ai Labs. |

### Hero

|         | EN | ES |
| ------- | -- | -- |
| Overline| Ai Labs Aperture | Ai Labs Aperture |
| H1      | Connect people and companies to the AI ecosystem around us | Conecta personas y empresas al ecosistema de IA a nuestro alrededor |
| Sub     | A community and innovation hub — introductions, programs, events, and partner channels when they’re real. | Un hub de comunidad e innovación: presentaciones, programas, eventos y canales con partners cuando son reales. |
| Primary CTA | Partner with us | Sé partner |
| Secondary CTA | Talk to us | Hablemos |

Primary → `#contact`, interest `aperture`.

### Two sides

**EN — Title:** People and partners  
**ES — Title:** Personas y partners

| Side | EN | ES |
| ---- | -- | -- |
| People | Connect participants with other profiles in the network, and bring them closer to companies we represent or partner with. | Conecta participantes con otros perfiles de la red, y acércalos a las empresas que representamos o con las que hacemos partnership. |
| Partners | Help sponsors, companies, and institutions engage the ecosystem through programs, events, credits when available, and introductions. | Ayuda a sponsors, empresas e instituciones a participar en el ecosistema con programas, eventos, créditos cuando hay, e introducciones. |

### What we can promise

**EN — Title:** What Aperture offers  
**ES — Title:** Qué ofrece Aperture

| EN | ES |
| -- | -- |
| Direction on how to engage the builder ecosystem | Dirección sobre cómo participar en el ecosistema |
| Access to the Ai Labs network | Acceso a la red de Ai Labs |
| Relevant introductions when appropriate | Introducciones relevantes cuando corresponde |
| Community programming and facilitation | Programación y facilitación de comunidad |
| Credits and opportunities when available | Créditos y oportunidades cuando hay |

### Guardrail

**EN:** We can promise direction, programming, facilitation, and relevant introductions. We can’t promise outcomes controlled by third parties.

**ES:** Podemos prometer dirección, programación, facilitación e introducciones relevantes. No podemos prometer resultados controlados por terceros.

### Closing CTA

**EN:** Let’s design how you plug into the network.  
**ES:** Diseñemos cómo te conectas a la red.  
→ form, interest `aperture`

---

## Microcopy

| Key | EN | ES |
| --- | -- | -- |
| Loading | Loading… | Cargando… |
| 404 title | Page not found | Página no encontrada |
| 404 body | That page doesn’t exist. Head home or talk to us. | Esa página no existe. Vuelve al inicio o háblanos. |
| 404 CTA home | Back home | Ir al inicio |
| Language switch | ES | EN |
| Required field | Required | Obligatorio |
| Invalid email | Enter a valid email | Ingresa un correo válido |

---

## Implementation Notes

- Keep pillar brand names untranslated in UI chrome; translate descriptors and body.
- Prefill contact `interest` from pillar page CTAs.
- Proof metrics: single source constants shared with any future CMS.
- Social URLs and partner logo strip: placeholders until assets and links are confirmed.
- Do not invent new program names beyond those listed.
- Spanish should stay plain and natural — same voice as English, not formal corporate ES.

## Open For Later

- Exact social URLs and partner logo order.
- Form backend / receiving inbox.
- Optional `/about` page (founders long-form) — not in v1 nav.
- Legal pages (privacy / terms) when needed for the form.
