# Reconstruction Plan

## Core Truth
The CO-STAR prompt IS the product. SSE streaming is delivery. Everything else is waste.

## KEEP (modified)
| File | Why |
|------|-----|
| `src/lib/ai/prompts.ts` | CO-STAR system prompt + language detection (the product) |
| `src/lib/ai/provider.ts` | Claude streaming provider (delivery mechanism) |
| `src/lib/ai/optimize.ts` | Input sanitization (safety) |
| `src/lib/ai/models.ts` | Model config (needed by provider) |
| `src/app/layout.tsx` | Root layout (simplify) |
| `src/app/globals.css` | Tailwind base styles |
| `src/app/api/optimize/stream/route.ts` | SSE route (strip auth/quota/DB) |
| `middleware.ts` | Remove (was auth guard) |
| `package.json` | Strip 20+ unused deps |
| `.gitignore` | Keep |
| `tailwind.config.ts` | Keep |
| `postcss.config.js` | Keep |
| `tsconfig.json` | Keep |
| `next.config.mjs` | Keep |
| `.env.example` | Keep (simplify) |
| `vercel.json` | Keep |

## CREATE
| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Single-page app: input + result + copy |
| `RECONSTRUCTION-PLAN.md` | This file |

## DELETE (96% of codebase)
| Path | Reason |
|------|--------|
| `_legacy_expo/` | Dead legacy code |
| `src/app/(auth)/` | Auth pages — no auth needed |
| `src/app/dashboard/` | Dashboard — overengineered |
| `src/app/actions/` | Server actions — dead |
| `src/app/api/history/` | History API — no DB |
| `src/app/api/usage/` | Usage API — no DB |
| `src/app/api/subscription/` | Sub API — no Stripe |
| `src/app/api/webhooks/` | Stripe webhooks — dead |
| `src/app/api/optimize/route.ts` | Non-streaming optimize — redundant |
| `src/components/optimize/` | Replaced by inline UI |
| `src/components/subscription/` | Stripe pricing — dead |
| `src/components/ui/` | Over-engineered UI kit |
| `src/hooks/` | All hooks — replaced by inline |
| `src/lib/auth.ts` | Supabase auth — dead |
| `src/lib/quota.ts` | Quota system — dead |
| `src/lib/rate-limit.ts` | Rate limiter — dead |
| `src/lib/stripe.ts` | Stripe — dead |
| `src/lib/supabase/` | Supabase — dead |
| `src/lib/utils.ts` | cn() helper — dead |
| `src/lib/ai/templates.ts` | Template library — dead |
| `src/lib/ai/prompt-techniques.ts` | Techniques — dead |
| `src/lib/ai/prompt-library.ts` | Prompt library — dead |
| `src/mobile/` | Mobile code — dead |
| `src/store/` | Zustand store — dead |
| `src/types/` | DB types — dead |
| `src/__tests__/` | Tests — dead |
| `supabase/` | Migrations — dead |
| `.eslintrc.json` | ESLint — simplify |
| `vitest.config.ts` | Test config — dead |
| `CLAUDE.md` | Project docs — dead |
| `CODEMAP.md` | Project docs — dead |
| `DEPLOY.md` | Project docs — dead |
| `BLOCKERS.md` | Project docs — dead |
| `README.md` | Will recreate minimal |
| `REFACTOR_SUMMARY.md` | Dead docs |

## Simplified Dependencies
```json
{
  "dependencies": {
    "@anthropic-ai/sdk": "^0.30.0",
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.5.0"
  }
}
```

## Final Architecture (~300 lines)
```
src/
  app/
    page.tsx          — Single page (input + streaming result + copy)
    layout.tsx        — Minimal layout
    globals.css       — Tailwind base
    api/optimize/stream/route.ts — SSE streaming (no auth, no DB)
  lib/ai/
    prompts.ts        — CO-STAR system prompt (THE PRODUCT)
    provider.ts       — Claude streaming
    optimize.ts       — Input sanitization
    models.ts         — Model config
```
