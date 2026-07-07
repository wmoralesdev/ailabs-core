# Ai Labs Styles

Implementation source of truth for the website: tokens, layout, components, texture, and motion.

Does **not** redefine brand meaning (`PRODUCT.md`) or voice/identity rules (`BRAND.md`). This file turns brand direction into buildable UI behavior.

Stack assumption: Vite + React + Tailwind-style tokens. Adapt names to CSS variables as needed.

## Doc Map

| File         | Owns                                      |
| ------------ | ----------------------------------------- |
| `PRODUCT.md` | What Ai Labs is                           |
| `BRAND.md`   | Voice, name, color intent, logo, type     |
| `STYLES.md`  | Tokens, components, motion, app behavior  |
| `CONTENT.md` | Page structure and copy (EN / ES)         |

## Design Principles

1. Light marketing default; graphite for brand moments.
2. Purple is a signal, not a wash — brand purple is intentional (logo-led); no neon glows, no purple gradient text, no full-page purple flood.
3. Confident motion — present, not noisy. Honor `prefers-reduced-motion`. Dial target: motion ~6 (CSS transforms/opacity + light scroll reveal; no perpetual particles).
4. mem0-like calm structure with higher layout variance: asymmetric heroes, bento/split pillar grids — not centered stock SaaS.
5. Stipple texture in section washes and footers only.
6. Airy density: generous section gaps; cards only when elevation helps hierarchy.
7. No emoji in UI. Icons from the project set (Hugeicons already in stack) — consistent stroke.

### design-taste overrides (locked)

Applied skill dials for this project: variance **8**, motion **6**, density **4**.

| Skill default              | Ai Labs decision                                      |
| -------------------------- | ----------------------------------------------------- |
| Ban “AI purple / Lila”     | **Override** — keep `#A78BFA` (brand mark)            |
| Ban equal 3-column features| **Follow** — asymmetric bento for pillars             |
| Ban centered heroes        | **Follow** — left copy + right mark/visual            |
| Ban Inter                  | **Follow** — Bricolage + DM Sans                      |
| Magnetic / perpetual loops | **Skip** — too heavy for this marketing v1            |
| Framer / GSAP required     | **Optional** — prefer CSS + IntersectionObserver first |

### Forbidden (even with purple kept)

- Outer neon / glow on buttons or mark.
- Pure `#000000` — use graphite `#303030`.
- Oversized screaming H1 for hierarchy alone — weight + tracking matter.
- Generic Unsplash / fake robot imagery.
- Copy clichés: elevate, seamless, unleash, next-gen, revolutionize.

## Color Tokens

Map from `BRAND.md`. Hex is the contract; CSS vars are implementation names.

| Token                 | Hex       | Role                                      |
| --------------------- | --------- | ----------------------------------------- |
| `--color-purple`      | `#A78BFA` | Accent, CTA fill, links, focus ring tint  |
| `--color-purple-soft` | `#C4ACF6` | Stipple ink, soft icons, hover tints      |
| `--color-lavender`    | `#EDE4FF` | Section / footer wash                     |
| `--color-graphite`    | `#303030` | Dark ground, primary text on light        |
| `--color-muted`       | `#5C5C5C` | Secondary text on light                   |
| `--color-white`       | `#FFFFFF` | Light ground, text on dark                |
| `--color-border`      | `#E8E4F0` | Hairlines on light (lavender-tinted grey) |
| `--color-border-dark` | `#44414F` | Hairlines on graphite                     |

### Semantic surfaces

| Surface            | Background           | Foreground            |
| ------------------ | -------------------- | --------------------- |
| Page default       | `--color-white`      | `--color-graphite`    |
| Section wash       | `--color-lavender`   | `--color-graphite`    |
| Dark band          | `--color-graphite`   | `--color-white`       |
| Primary button     | `--color-purple`     | `--color-graphite` or white — pick highest contrast |
| Secondary button   | transparent / white  | `--color-graphite`    |
| Input              | white                | graphite; border `--color-border` |

Contrast check required for purple buttons and logo on lavender. Prefer dark text on `#A78BFA` if white fails WCAG AA for the size used.

### Dark moments

Use graphite grounds for:

- Optional hero treatment or mid-page brand band.
- Logo lockup features.
- Event-style moments.
- Footer bottom bar if desired (optional; soft lavender footer is the default).

## Typography Tokens

Google Fonts:

- **Bricolage Grotesque** → `--font-display`
- **DM Sans** → `--font-sans`

| Step        | Font        | Size (desktop) | Size (mobile) | Weight | Line height | Use                |
| ----------- | ----------- | -------------- | ------------- | ------ | ----------- | ------------------ |
| Display     | Bricolage   | 56–64px        | 36–40px       | 600–700| 1.05–1.1    | Hero H1            |
| H2          | Bricolage   | 36–40px        | 28–32px       | 600    | 1.15        | Section titles     |
| H3          | Bricolage   | 24–28px        | 22–24px       | 600    | 1.2         | Cards, pillars     |
| Body LG     | DM Sans     | 18–20px        | 16–18px       | 400    | 1.5         | Hero sub, lead     |
| Body        | DM Sans     | 16px           | 16px          | 400    | 1.55        | Default copy       |
| Small       | DM Sans     | 14px           | 13–14px       | 400–500| 1.4         | Captions, proof    |
| Overline    | DM Sans     | 12–13px        | 12px          | 500–600| 1.3         | Nav, labels (caps optional, tracked) |

Rules:

- Never set long paragraphs in Bricolage.
- Nav and buttons: DM Sans, medium weight.
- Letter-spacing: slight tracking on overlines (+0.04–0.08em); neutral on body.

## Spacing And Layout

Base unit: `4px`. Prefer the 4 / 8 / 16 / 24 / 32 / 48 / 64 / 96 scale.

| Token           | Value   | Use                          |
| --------------- | ------- | ---------------------------- |
| `--space-section-y` | 96px (desktop) / 64px (mobile) | Vertical section padding |
| `--space-gutter`    | 24px (mobile) / 32–48px        | Page horizontal gutter   |
| `--max-width`       | 1120–1200px                    | Content column           |
| `--max-width-narrow`| 720px                          | Long reading / forms     |

Grid:

- Default content: single column on mobile; CSS Grid on desktop — prefer asymmetric fractions over equal thirds.
- **Pillars (home):** asymmetric bento — e.g. `md:grid-cols-12` with one feature pillar spanning 7 and two stacked in 5, or 2fr/1fr/1fr. Not three equal cards. Titles may sit in-cell; avoid identical card chrome on all three.
- Proof strip: open metrics row with hairline dividers (not boxed cards). Mono optional for numbers only.
- Nav: logo left, links, primary CTA right.

Hero:

- **Asymmetric:** left-aligned copy column; right column holds mark / graphite panel / soft visual. `min-h-[100dvh]` if full-viewport, never `h-screen`.
- Mobile (`< md`): single column — copy first, visual second or omitted.
- Max content width ~1120–1200px; generous left bias OK within the shell.

Border radius:

| Token            | Value  | Use                |
| ---------------- | ------ | ------------------ |
| `--radius-sm`    | 6–8px  | Inputs, chips      |
| `--radius-md`    | 10–12px| Buttons, cards     |
| `--radius-lg`    | 16–20px| Large panels       |
| `--radius-full`  | 9999px | Pills if needed    |

Prefer rounded-rect buttons over pills for a calmer product feel (mem0-adjacent).

Shadows:

- Default: almost none.
- Cards: very soft (`0 1px 2px` + slight purple-tinted ambient) or border-only.
- Avoid heavy drop shadows and glow.

## Texture

### Organic stipple

Implementation options (pick one, keep reusable):

1. Inline SVG pattern (dots) masked into an organic blob shape.
2. Canvas / pre-rendered asset at 1x/2x.
3. CSS `radial-gradient` dots + SVG mask for the organic silhouette.

Specs:

- Field: `--color-lavender`.
- Dot color: `--color-purple-soft` at ~40–70% opacity.
- Dot size: small (1–2px) at 1x; denser than a grid paper, softer than noise.
- Shape: branching / network silhouette; fade edges to transparent.
- Placement: behind footer content and select mid-page washes; never full-viewport wallpaper; never competing with H1.

Motion with texture (optional, confident tier):

- On section enter: stipple opacity 0 → target over ~600–800ms.
- Prefer reduced-motion: show final state only, no fade.

Do not animate individual dots or create continuous shimmer.

## Motion

Taste: **confident** — section entrances, one brand texture moment, clear CTA hover. Not playful; not cinematic.

### Global

| Token                 | Value        |
| --------------------- | ------------ |
| `--ease-out`          | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `--ease-standard`     | `cubic-bezier(0.2, 0.8, 0.2, 1)` |
| `--dur-fast`          | 150–180ms    |
| `--dur-base`          | 220–280ms    |
| `--dur-enter`         | 500–700ms    |

### `prefers-reduced-motion: reduce`

- Disable scroll-triggered transforms and opacity journeys.
- Keep instant state changes and focus styles.
- Hovers may keep color/border only (no large translate).

### Allowed motion

| Element              | Behavior                                                                 |
| -------------------- | ------------------------------------------------------------------------ |
| Page load / hero     | Title + sub + CTA fade/slide up slightly (8–16px), staggered 60–100ms    |
| Sections             | On enter viewport (~20%): content fades/rises once                       |
| Pillar cards         | Hover: +1–2px lift or border tint to purple; image if any scales 1.02 max|
| Primary CTA          | Hover: slight darken/brighten; optional 1px translateY                   |
| Secondary CTA        | Border → purple tint                                                     |
| Links                | Underline or color to purple, ~150ms                                     |
| Stipple sections     | Opacity enter once                                                       |
| Dark brand band      | Optional mark fade-in                                                    |
| Form                 | Field focus ring; submit → loading state; success message fade           |

### Disallowed motion

- Continuous parallax on scroll.
- Bounce / spring overshoot on marketing CTAs.
- Autoplay video backgrounds.
- Glow pulses, particle systems, “AI network” line animations as wallpaper.
- Stagger more than ~6 items per section (feels busy).

### Scroll

Smooth scroll to anchors OK if OS allows. Sticky nav: solid white (or translucent white) with hairline border after scroll; no heavy blur needed.

## Components

### Header / Nav

- Height ~64–72px.
- Logo: mark + wordmark on light; mark alone OK at small breakpoints.
- Links: Academy, Agentic, Aperture, Contact.
- Right: primary CTA `Talk to us` → contact section or form anchor.
- Mobile: icon button → drawer/sheet; same links + CTA.
- Active route: purple underline or weight change, not a loud pill.

### Buttons

| Variant   | Look                                              |
| --------- | ------------------------------------------------- |
| Primary   | Purple fill, graphite or white label, `--radius-md` |
| Secondary | White/transparent, graphite text, `1px` border    |
| Ghost     | Text only, hover lavender or purple soft         |
| On dark   | White or purple fill; verify contrast             |

Sizes: `sm` 32–36px, `md` 40–44px, `lg` 48px. Icon optional trailing arrow on primary marketing CTAs.

### Links

Default graphite; hover/focus purple. External links: same treatment (optional arrow for partner sites).

### Cards (pillars, programs)

- Prefer border + space over heavy elevation. Soft border OK; no glow.
- Pillar **home** presentation: asymmetric bento tiles (unequal spans / one taller focal tile). Program lists on Academy may stay simpler stacked rows.
- Title (Bricolage H3), short body (DM Sans), text link or button.
- Shared purple accent only (bar, mark fragment, or hover border) — no per-pillar rainbow.

### Proof strip

- Row of metrics: number (Bricolage or DM Sans semibold) + label (small muted).
- Dividers: vertical hairlines or spacing only.
- On mobile: wrap or horizontal snap scroll.

### Form

Fields:

- Name, email, company, message, interest (Academy / Agentic / Aperture) — select or radio/chips.
- Labels above fields; helper text muted.
- Focus: purple ring (`2px` / offset) + border tint.
- Errors: clear text under field; do not rely on color alone.
- SubmitBudget/etc. not in v1.

States: idle → submitting (disabled + spinner or “Sending…”) → success message → optional reset.

Destination: wire later; UI and copy are ready in `CONTENT.md`.

### Footer

- Lavender wash + organic stipple behind content.
- Columns: brand blurb + socials; pillars; company/contact.
- Bottom bar: copyright, thin border.
- Optional small dark strip only if needed for logo lockup — default is soft footer.

### Dark brand band

- Graphite background.
- Purple mark + short line of copy + CTA.
- Use once per page max.

## Page Shell Rhythm

Shared across Home and pillar pages:

1. Sticky header.
2. Hero (light or light + optional dark band below).
3. Body sections with alternating white / lavender wash.
4. Contact form section (lavender or white).
5. Footer with stipple.

Pillar pages: same shell; hero framed for that pillar; proof optional/shorter; deep content unique; shared contact + footer.

## Iconography And Media

- Icons: simple line or solid geometric set; one family sitewide. Purple or graphite.
- Images: real events/work; rounded `--radius-md`; no heavy filters.
- Favicon: purple mark on graphite or transparent as approved.

## Accessibility

- Visible focus rings always.
- Text contrast AA for body and UI controls.
- Motion reduced path required.
- Form labels associated; errors announced.
- Skip-to-content link on keyboard.

## Implementation Notes

- Prefer CSS variables in `:root` for colors, type, space, motion.
- Load fonts via Google Fonts or `fontsource` equivalents: Bricolage Grotesque + DM Sans (variable OK).
- Stipple as a reusable `<StippleField />` or CSS background utility (`.bg-stipple`).
- Animate with CSS or a light library; keep scroll observers simple.
- Do not invent secondary pillar colors in v1.

## Out Of Scope For STYLES.md

- Exact final marketing copy → `CONTENT.md`
- Partner deal legal language → `PRODUCT.md` / sales
- Exact form backend → implement later
