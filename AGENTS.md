# Split

Trip cost splitting PWA for friends. Product host: `split.ailabs.sv`.

## Source of truth

- Product invariants live here.
- UI tokens live in `src/styles.css`.
- Domain math lives in `src/lib/settle.ts` and `src/lib/money.ts`.
- Persistence models live in `prisma/schema.prisma`.
- Server operations live in `src/server`.

## Product

- No accounts. A room code is the access key.
- Create a room with currency + people, then enter expenses quickly.
- Each expense has who paid and who shares (equal split by default).
- Settlement is net balances → greedy transfers → “X owes Y $Z”.
- Optional ticket OCR (Mistral) prefills the expense form; user confirms.

## Stack

- React 19, TanStack Start, Vite, Tailwind v4, shadcn `base-mira`, Hugeicons
- Neon Postgres + Prisma
- pnpm

## Do not

- Add auth, orgs, or email invites.
- Store receipt images.
- Add FX conversion or realtime websockets in v1.
