# Ai Labs home — copy & narrative audit

Date: 2026-07-10  
Sources: copywriting + repetition + brand/voice Grok audits  
Scope: home + chrome strings (`src/content/en.ts`, `src/content/es.ts`), home components under `src/components/home/`

## Executive summary

- **Fake social proof is the top trust risk:** `trust.quote` is self-attributed, and hero shows a decorative A/L/S avatar stack — both read as testimonials that aren’t.
- **Pillars are explained three times** (features accordion + cards + `partner.rows`) — pick one features surface; delete partner pillar restatement.
- **Proof numbers duplicate:** `700+` in hero + trust; `30+` in hero + about — assign ownership and cut the extras.
- **“Talk to us” / “Hablemos” floods mid-page** (features + partner + contact + chrome) — keep as default CTA; cut or path-specify mid-page repeats.
- **Partner copy is clever/vague** (EN left) and under-names tools (EN right); ES has Shippea, partnership Spanglish, and headline drift.
- **About vs trust headlines collide** (“why companies/teams come/work with us”).
- **Goal:** one idea per section (see ownership table), honest proof chrome, stronger path CTAs, ES aligned after EN cuts.
- **Keep:** hero H1, `about.bold`, features card bodies, `contact.lead` (tighten to form-only), “Talk to us” as default primary CTA. Proof `700+` / `30+` / `8` are product-allowed.

## Narrative ownership (target)

| Section | Owns | Does not own |
| --- | --- | --- |
| **Hero** | Who we are + headline + primary CTA + ES once | Pillar menus, `700+`, `30+`, mid-funnel CTAs |
| **About** | Why companies come + verb definitions (`bold`) + events/partners proof | Competitive “why us” line, pillar catalogs |
| **Features** | **One** pillar menu (accordion *or* cards) | Second pillar UI, contact CTA spam |
| **Partner** | Community feeds the work + founders/tools | Pillar restatement (`rows`), generic “Talk to us” |
| **Trust** | `700+` + competitive positioning line | Testimonial chrome, “why companies come” |
| **Contact** | Form only | Re-pitching pillars / community essay |

## Repetition scoreboard

| Idea | ~Count | Verdict |
| --- | --- | --- |
| adapt · develop · learn | ×5 | Keep hero H1 + `about.bold`; cut elsewhere |
| Triad / three ways | ×4–5 | One features surface only |
| Three pillar menus | ×3 | Accordion **or** cards; remove `partner.rows` |
| Community | ×9+ | Partner owns; trim echoes |
| `700+` | ×2 | Trust only — drop hero proof |
| `30+` | ×2 | About only — drop hero overlay |
| Anti-deck / anti-hype | ×5 | Once (prefer `about.bold`); cut “future of AI” even as negation if possible |
| Why companies/teams come | ×2 | About only — rewrite `trust.headline` |
| Talk to us / Hablemos | ×6+ | Chrome + hero + contact title OK; cut features/partner CTAs or path-specify |

## Action backlog (implement in order)

### P0

- [ ] **P0-1 — Kill fake avatar stack**  
  **Change:** Remove `["A","L","S"]` avatar row; keep numeric proof UI only (until hero proof is removed per P0-4).  
  **Files:** `src/components/home/home-hero.tsx` (~lines 107–116).  
  **AC:** No decorative initials implying unnamed people; no aria-hidden fake faces.

- [ ] **P0-2 — Restyle trust quote as positioning (not testimonial)**  
  **Change:** Stop rendering quote + “Ai Labs” attribution as social proof. Treat copy as a competitive positioning line (plain text / section body). Remove or hide `attribution` + portrait-as-endorser chrome if it implies a third-party quote.  
  **Files/fields:** `src/components/home/home-trust.tsx`; `home.trust.quote`, `home.trust.attribution` in `en.ts` / `es.ts`.  
  **AC:** No quote marks / avatar / self-attribution pattern; line still states learning + software + ecosystem vs single-lane alternatives.

- [ ] **P0-3 — Remove `partner.rows` (pillar restatement)**  
  **Change:** Delete `rows` data and UI that re-lists Train/Build/Connect pillars.  
  **Files/fields:** `home.partner.rows` in `en.ts` / `es.ts`; `src/components/home/home-partner.tsx`; types `HomePartnerContent.rows` if unused.  
  **AC:** Partner section = community + founders only; pillars appear once under Features.

- [ ] **P0-4 — One features surface**  
  **Change:** Keep **either** accordion **or** cards (recommend **cards** — stronger path CTAs; accordion bodies become redundant). Remove the unused surface from content + component.  
  **Files/fields:** `home.features.accordion` *or* `home.features.cards`; `src/components/home/home-features.tsx`.  
  **AC:** Exactly one pillar menu on home; no third restatement via partner.

- [ ] **P0-5 — Rewrite `trust.headline` (drop “why come” collision)**  
  **Change:** About keeps “why companies come”; trust owns competitive/community proof framing.  
  **Files/fields:** `home.trust.headline` EN/ES.  
  **AC:** Does not paraphrase `about.label`; pairs with `700+` + positioning line.

- [ ] **P0-6 — Dedupe `700+`**  
  **Change:** Remove hero `proof` (value/label UI). Trust keeps `stat: 700+`.  
  **Files/fields:** `home.hero.proof`; hero component proof block.  
  **AC:** `700+` appears once on home (trust).

- [ ] **P0-7 — Dedupe `30+`**  
  **Change:** Remove hero `overlay` (or stop rendering it). About keeps `stats[0]: 30+`.  
  **Files/fields:** `home.hero.overlay`; hero overlay UI.  
  **AC:** `30+` appears once on home (about). Align Events label wording (see P2).

### P1

- [ ] **P1-1 — Rewrite `hero.secondaryCta`**  
  **Change:** Replace weak “Explore the pillars” with a concrete scroll/path label (not CTA-slop).  
  **Files/fields:** `home.hero.secondaryCta` EN/ES.  
  **AC:** Label names the destination (how we work / pillars section); still links `#pillars`.

- [ ] **P1-2 — Cut mid-page “Talk to us”**  
  **Change:** Remove or replace `features.cta` and `partner.cta` (path-specific if kept, e.g. “Train with Academy”). Keep chrome nav CTA + hero primary + contact title.  
  **Files/fields:** `home.features.cta`, `home.partner.cta` EN/ES + components.  
  **AC:** ≤3 “Talk to us”/“Hablemos” on full home scroll (nav, hero, contact).

- [ ] **P1-3 — Accordion bodies → outcomes** (only if accordion kept)  
  **Change:** Each body ends with a business outcome, not a feature catalog.  
  **Files/fields:** `home.features.accordion[].body` EN/ES.  
  **AC:** Reader knows what changes for the team/company, not only what formats exist.

- [ ] **P1-4 — Card CTAs: See X → Train/Build/Connect**  
  **Change:** `See Academy` → `Train with Academy`; `See Agentic` → `Build with Agentic`; `See Aperture` → `Connect with Aperture` (ES: Entrena/Construye/Conéctate — not Ver).  
  **Files/fields:** `home.features.cards[].cta.label` EN/ES.  
  **AC:** Path verb matches pillar job; no “See/Ver”.

- [ ] **P1-5 — Clarify `partner.left`**  
  **Change:** Replace clever “Trust moves through the work” with plain: community feeds Academy / Agentic / Aperture (talent, events, partners).  
  **Files/fields:** `home.partner.left.title` (+ body tighten if needed) EN/ES.  
  **AC:** First-time reader gets the loop without metaphor decoding.

- [ ] **P1-6 — Name tools in `partner.right`**  
  **Change:** Name confirmed tools founders/ambassadors represent (do not invent — use approved partner list).  
  **Files/fields:** `home.partner.right.body` EN/ES.  
  **AC:** At least one real tool name; no “tools we actually use” alone.

- [ ] **P1-7 — Differentiate about vs trust labels**  
  **Change:** Soften/replace overlapping “why…”; optionally retitle `trust.label` away from bare “Proof”/“Prueba”.  
  **Files/fields:** `home.about.label` (keep ownership), `home.trust.label`, `home.trust.headline`.  
  **AC:** Skim test: about = motive; trust = proof + competitive line.

- [ ] **P1-8 — Tighten `about.body`; `about.bold` sole definition**  
  **Change:** Shorten body; ensure adapt/develop/learn definitions live only in `bold`. Strip “future of AI” negation if still present.  
  **Files/fields:** `home.about.body`, `home.about.bold` EN/ES.  
  **AC:** Verb definitions appear once; anti-hype once max.

- [ ] **P1-9 — `contact.lead` form-only**  
  **Change:** Keep short form instruction; drop re-pitch of training/software/community essay if redundant with title.  
  **Files/fields:** `home.contact.lead` EN/ES.  
  **AC:** Lead tells user what to fill / expect reply — not a second hero.

### P2

- [ ] **P2-1 — `trust.label`:** “Proof”/“Prueba” → sharper (e.g. community scale / positioning).  
- [ ] **P2-2 — `hero.label`:** strengthen beyond soft “Practical AI work” / “IA práctica”.  
- [ ] **P2-3 — `hero.body`:** tighten after proof cuts; keep El Salvador once.  
- [ ] **P2-4 — Aperture accordion/card clarity:** less vague “hub/room”; say who meets whom and why.  
- [ ] **P2-5 — `contact.submit`:** stronger than “Send message” / “Enviar mensaje” if brand allows (avoid banned CTA slop).  
- [ ] **P2-6 — About toast:** `toastTitle`/`toastMeta` may feel fake live status — restyle as caption or remove.  
- [ ] **P2-7 — ES Shippea:** `partner.rows` body (if rows not yet deleted) / any remaining “Shippea” → natural ES (“Entrega” / “Lanza”).  
- [ ] **P2-8 — Events labels:** align `Events run` / `Events hosted` / `Eventos` / `Eventos realizados` → one phrase EN + ES (`Eventos` OK; prefer consistent “Eventos realizados” in about if hero overlay gone).  
- [ ] **P2-9 — Partner tools strip:** optional logo/name strip for confirmed tools (assets under `public/brand/`).  
- [ ] **P2-10 — ES `partner.headline` drift:** “Sobre la comunidad” → match EN intent (“Built on community” / “Hecha en comunidad” or equivalent).  
- [ ] **P2-11 — ES Spanglish:** `partnership` in aperture accordion → “alianzas” / “socios”; `Ambassadors` / `regional leads` → natural ES.  
- [ ] **P2-12 — `partner.right.stat`:** EN “Co-founded” → ES already “Fundado”; confirm EN/ES pair intentional.  
- [ ] **P2-13 — Hardcoded aria/chips** in home components → content/microcopy keys.  
- [ ] **P2-14 — Align full ES file** after EN structural cuts (remove unused fields, mirror ownership).

## Proposed string patches (EN)

Highest-priority fields only. Apply after structural P0 cuts where noted.

| Field | Before | After |
| --- | --- | --- |
| `home.hero.secondaryCta.label` | `Explore the pillars` | `See how we work` |
| `home.trust.headline` | `Why teams work with us` | `Learning, shipping, and access — together` |
| `home.trust.label` | `Proof` | `Community` |
| `home.trust.quote` | `We combine practical learning, software work, and ecosystem access. Most alternatives only cover one of those.` | Keep sense; render as positioning (not a quote). Optional tighten: `Practical learning, shipped software, and ecosystem access — most alternatives only cover one.` |
| `home.trust.attribution` | `Ai Labs` | Remove from UI (or empty / delete field) |
| `home.features.cards[0].cta.label` | `See Academy` | `Train with Academy` |
| `home.features.cards[1].cta.label` | `See Agentic` | `Build with Agentic` |
| `home.features.cards[2].cta.label` | `See Aperture` | `Connect with Aperture` |
| `home.partner.left.title` | `Trust moves through the work` | `Community feeds the three pillars` |
| `home.partner.right.body` | `Walter Morales and Daniela Lopez — software engineers. Ambassadors and regional leads for tools we actually use.` | `Walter Morales and Daniela Lopez — software engineers. Ambassadors / regional leads for [CONFIRMED_TOOL_NAMES].` |
| `home.about.bold` | `…not another deck about the future of AI.` | `…not another slide deck.` (drop “future of AI” even as negation) |
| `home.contact.lead` | `Tell us what you need — training, software, or a way into the community. We’ll follow up.` | `Tell us what you need. We’ll follow up.` |

**Delete (no replacement string):**

- `home.hero.proof` (UI + fields) — `700+` lives in trust  
- `home.hero.overlay` (UI + fields) — `30+` lives in about  
- `home.partner.rows` (all three)  
- `home.features.cta` and/or `home.partner.cta` (P1-2)  
- One of: entire `home.features.accordion` **or** `home.features.cards` (P0-4)

## ES follow-ups

1. Mirror all P0 deletions (`proof`, `overlay`, `rows`, unused features surface, mid-page CTAs).  
2. `secondaryCta`: `Conoce los pilares` → match EN (e.g. `Mira cómo trabajamos`).  
3. Card CTAs: `Ver X` → `Entrena/Construye/Conéctate con X`.  
4. `trust.headline` / `trust.label`: rewrite in parallel with EN; kill self-quote chrome.  
5. `partner.headline`: fix drift from “Sobre la comunidad”.  
6. Kill **Shippea**; fix **partnership** Spanglish in aperture body.  
7. `about.bold`: drop “el futuro de la IA” negation; keep verb definitions.  
8. Events labels: one consistent phrase (`Eventos realizados` recommended for about).  
9. `partner.right`: same confirmed tool names as EN; naturalize Ambassadors/regional leads.  
10. `contact.lead`: form-only mirror of EN tighten.  
11. Hardcoded component strings / aria → ES-aware content keys.

## Keep (do not “improve” away)

- `home.hero.headline` — Adapt, develop, and learn with AI  
- `home.about.bold` — sole verb definitions (after anti-hype trim)  
- `home.features.cards[].body` — audience clarity  
- `home.contact.lead` — as short form helper (after tighten)  
- “Talk to us” / “Hablemos” as **default** primary (chrome + hero + contact title)  
- Proof numbers `700+`, `30+`, `8` — product-allowed; just don’t duplicate  
- Chrome/meta brand echo of adapt·develop·learn — OK

## Out of scope

- Pillar page bodies (`/academy`, `/agentic`, `/aperture`)  
- Contact form backend / delivery  
- Non-home routes and marketing beyond home + chrome strings  
- Re-auditing visual design system (except fake-proof chrome called out above)  
- Inventing partner/tool names not on an approved list  
