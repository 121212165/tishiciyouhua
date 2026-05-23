# tishiciyouhua

AI 提示词优化工具 -- Next.js Web SaaS 应用。

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (strict: true)
- **Styling:** Tailwind CSS v3
- **Backend:** Supabase (Auth, Database, RLS)
- **AI:** Anthropic API (Claude 3.5 Sonnet)
- **State:** Zustand (client), SWR (server state)
- **Forms:** React Hook Form + Zod
- **Testing:** Vitest + Testing Library
- **Deploy:** Vercel

## Architecture

```
src/
  app/                    → Next.js App Router
    (auth)/               → Login, signup (auth group)
    dashboard/            → Protected dashboard pages
    api/optimize/         → API route for optimization
    actions/optimize.ts   → Server action for optimization
  components/
    ui/                   → Shared UI components (shadcn/ui)
    optimize/             → Optimization-specific components
  lib/
    supabase/             → Supabase clients (browser, server, admin)
    ai/                   → AI optimization logic (models, prompts, optimize)
    auth.ts               → Auth helpers (getUser, requireAuth)
    rate-limit.ts         → Rate limiting (dev: in-memory, prod: Redis)
  hooks/                  → Custom React hooks
  store/                  → Zustand client stores
  types/
    database.ts           → Supabase DB type definitions
  utils/                  → General utilities
  middleware.ts           → Auth middleware (session refresh, route protection)
supabase/
  migrations/             → SQL migrations (schema, RLS, indexes)
```

## Common Commands

```bash
npm run dev          # Dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm run type-check   # tsc --noEmit
npm run test         # Vitest
npm run test:watch   # Vitest watch mode
```

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ANTHROPIC_API_KEY
```

## Conventions

- Server Components by default; `'use client'` only when needed
- Server Actions for mutations; API routes for external clients
- Supabase SSR package (`@supabase/ssr`) for cookie-based auth
- Error messages in Chinese for user-facing content
- Zod validation on all user inputs
- Immutable data patterns throughout

## Legacy

- Expo RN source preserved in `src/mobile/` and `_legacy_expo/`
- Original app at `~/InsightFlow/`

> Detailed conventions: [tishiciyouhua rules](../.claude/rules/projects/tishiciyouhua.md)
