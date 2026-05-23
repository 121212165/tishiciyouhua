# CODEMAP

| Path | Responsibility |
|------|---------------|
| `app/(tabs)/` | Tab navigation (home, refine, settings) |
| `app/refine/` | Prompt refinement flow |
| `src/components/tools/` | 3 tool components for prompt optimization |
| `src/lib/anthropic.ts` | Anthropic API client |
| `src/lib/supabase.ts` | Supabase client |
| `src/lib/clipboard.ts` | Clipboard utilities |
| `src/store/` | Zustand state stores |
| `src/types/` | TypeScript type definitions |

## Relationship to InsightFlow

This repo (`tishiciyouhua_repo`) is the refactored version of `~/InsightFlow/`.
Make changes here, not in InsightFlow. InsightFlow is preserved for its Android build artifacts.
