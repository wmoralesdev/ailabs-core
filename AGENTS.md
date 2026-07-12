# Ai Labs Web

This is the durable working brief for agents in this repository. Keep it short
and stable. Current implementation details belong in code, not in parallel
planning documents.

## Source of truth

- Product and brand invariants live in this file.
- Exact customer-facing copy lives in `src/content/en.ts` and
  `src/content/es.ts`; their shared contract lives in `src/content/types.ts`.
- Design tokens, theme mappings, and global utilities live in `src/styles.css`.
- Current layout and behavior live in `src/components` and `src/routes`.
- Database models live in `prisma/schema.prisma`. Generated Prisma files under
  `src/generated/prisma` must not be edited by hand.
- `audit.md` is a separate, developer-owned workstream. Do not treat it as the
  product specification or edit it unless the task explicitly targets it.

When this file and the implementation disagree, inspect the recent code and
git history before acting. Do not revive an old layout or copy direction only
because it appears in a historical plan. Update this file only when a durable
invariant changes. Do not add another root source-of-truth Markdown file.

## Product

Ai Labs helps companies adapt, develop, and learn with AI. It is based in El
Salvador and works through three pillars:

- **Academy** — practical AI teaching through consultancies, workshops, and
  programs.
- **Agentic** — software, workflows, and automation built with AI.
- **Aperture** — community and partner programs that connect people,
  companies, and relevant opportunities.

Community supports all three pillars; it is not a fourth product line. Keep the
offer practical and grounded in real work. Never sell AI as magic or imply
guaranteed access, credits, partnerships, or third-party outcomes.

Metrics, program names, partner relationships, credits, and credentials can
change. Verify them before adding or changing public claims; do not copy a
possibly stale value into this file.

## Brand and content

- The written name is **Ai Labs**. Use **Ai /abs** only as an intentional visual
  lockup, never as the default name in prose, metadata, or speech.
- Pillar names remain Academy, Agentic, and Aperture in English and Spanish.
  Translate their descriptions and surrounding copy.
- Voice is clear, direct, concise, and builder-to-builder. Prefer concrete
  teaching, software, event, and community proof over AI-industry hype.
- Avoid inflated language such as "revolutionary," "unlock the future,"
  "empower," or unsupported "leading ecosystem" claims.
- Keep English and Spanish content in parity. Add customer-facing strings to
  the typed content modules rather than scattering literals through
  components.
- Use real Ai Labs event and community imagery. Do not introduce generic robot,
  neon-brain, fake server-room, or generic AI-gradient imagery.
- Reuse approved assets in `public/brand`; do not redraw, stretch, or casually
  recolor logos.

## Current application

- `/` redirects from the request language to `/en` or `/es`.
- The localized home page is implemented in this order: Hero, About, Features,
  Partner, Trust, and Contact, followed by the shared footer.
- `/en/academy`, `/en/agentic`, and `/en/aperture` (and their Spanish
  equivalents) currently have route metadata but render no page content.
  Do not describe them as shipped pages.
- `/$locale/redeem` is an authenticated credit-redemption flow backed by
  Clerk, TanStack server functions, Prisma, and PostgreSQL/Neon.
- The home contact form currently validates in the browser and simulates a
  successful submission; it is not connected to a delivery backend.

## Stack

- React 19 and strict TypeScript
- TanStack Start and TanStack Router on Vite
- Tailwind CSS v4 with shadcn/Base UI primitives
- Clerk authentication
- Prisma with PostgreSQL/Neon
- Vitest and Testing Library
- pnpm

The linked `ailabs-cli` package at `../ailabs-cli` powers the seed and image
scripts. Do not recreate deleted one-off scripts in this repo.

## Repository map

- `src/routes` — file-based routes, metadata, and route-level loading
- `src/components/chrome` — shared shell, header, footer, logo, and theme UI
- `src/components/home` — homepage sections and home-specific interactions
- `src/components/ui` — shared shadcn/Base UI primitives; reuse before adding a
  local replacement
- `src/content` — localized content and its TypeScript contract
- `src/server` — server functions and protected business operations
- `src/lib` — shared utilities and domain helpers
- `src/styles.css` — Tailwind theme, semantic tokens, dark theme, and global
  utilities
- `prisma` — schema and migrations
- `public/brand`, `public/carousel`, `public/community-avatars` — approved
  visual assets

## UI implementation rules

- Treat the current components as the geometry reference. The home uses large
  rounded surfaces, pill-shaped marketing controls, real-event media, stipple
  texture, and distinct desktop/mobile hero compositions.
- Preserve the established light, dark, and system theme behavior.
- Use semantic classes and existing CSS variables. Do not create a parallel
  palette or hard-code brand colors inside components.
- Display type is Bricolage Grotesque; body and UI type is DM Sans. Both are
  loaded locally through Fontsource.
- Reuse `src/components/ui` and the shared home/chrome utilities. Use
  Hugeicons for interface icons; do not use emoji as UI icons.
- Keep responsive behavior deliberate. The desktop and mobile home heroes have
  separate components because their compositions differ materially.
- Keep effects restrained and performant. Prefer transform and opacity for
  motion, and do not add decorative animation that competes with content.

## Accessibility

- Preserve semantic landmarks, heading order, labels, alt text, and the
  skip-to-content path.
- All interactive controls must work by keyboard and have visible focus states.
- Do not rely on color alone for status or validation.
- Check contrast in both themes, especially purple controls and logo surfaces.
- Every nonessential motion path must honor `prefers-reduced-motion`.
- Avoid hiding server-rendered content by default; reveal behavior must fail
  open if JavaScript or observers do not run.

## Engineering workflow

1. Inspect `git status` before editing and preserve unrelated or concurrent
   work.
2. Read the implementation source named above before changing copy, layout,
   tokens, authentication, or redemption behavior.
3. Keep localized types and both language modules synchronized.
4. Prefer small changes to existing components over parallel abstractions.
5. Run checks proportional to the change and report anything not run.

Common commands:

```bash
pnpm dev
pnpm typecheck
pnpm lint
pnpm test
pnpm check
pnpm build
```

`pnpm build` runs `prisma generate` before the Vite production build. Database
and Clerk-backed behavior may additionally require the relevant environment
variables.
