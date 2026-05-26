import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/__tests__/**/*.test.ts'],
    exclude: ['src/mobile/**'],
    globals: true,
    coverage: {
      provider: 'v8',
      include: ['src/lib/**/*.ts', 'src/store/**/*.ts'],
      exclude: [
        'src/lib/supabase/**',
        'src/lib/ai/prompt-library.ts',
        'src/lib/ai/prompt-techniques.ts',
        'src/lib/ai/templates.ts',
        'src/lib/ai/provider.ts',
        'src/lib/auth.ts',
        'src/lib/stripe.ts',
        'src/lib/utils.ts',
        'src/mobile/**',
      ],
      thresholds: {
        statements: 70,
        branches: 60,
        functions: 70,
        lines: 70,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
