# Split

Trip cost splitting for friends. Create a room code, add expenses fast, see who owes whom. No accounts.

**Host:** [split.ailabs.sv](https://split.ailabs.sv)

## Stack

- TanStack Start + Vite + React 19
- Tailwind CSS v4 + shadcn (`base-mira`) + Hugeicons
- Neon Postgres + Prisma
- Optional Mistral OCR for ticket photos
- PWA install shell (`vite-plugin-pwa`)

## Setup

```bash
pnpm install
cp .env.example .env
# set DATABASE_URL (Neon) and optional MISTRAL_API_KEY
pnpm db:migrate
pnpm dev
```

## Scripts

| Script | Purpose |
|--------|---------|
| `pnpm dev` | Local app on port 3000 |
| `pnpm build` | `prisma generate` + production build |
| `pnpm test` | Vitest (settlement math) |
| `pnpm typecheck` | TypeScript |
| `pnpm lint` | ESLint |
| `pnpm db:migrate` | Apply Prisma migrations |
| `pnpm db:generate` | Generate Prisma client |

## Product notes

- Room code is the only access control (share it with the trip).
- Amounts are stored as integer cents.
- Settlement is greedy netting (Tricount-style owed sentences).
- OCR prefills the expense form; nothing is saved until you confirm.
