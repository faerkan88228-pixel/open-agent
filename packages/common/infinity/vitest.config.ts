import { fileURLToPath } from 'node:url';

import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    swc.vite({
      jsc: {
        parser: {
          syntax: 'typescript',
          tsx: true,
          decorators: true,
        },
        transform: { react: { runtime: 'automatic' } },
      },
    }),
  ],
  test: {
    name: '@afk/theme-infinity',
    environment: 'happy-dom',
    include: ['src/**/*.spec.{ts,tsx}'],
    // isolated from the monorepo setup files, which need a full install
    setupFiles: [],
  },
});
