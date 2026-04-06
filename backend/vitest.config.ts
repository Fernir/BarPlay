import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: [],
    include: ['src/**/*.{test,spec}.{js,ts}'],
    testTimeout: 10000,
    hookTimeout: 10000,
    // Исключаем E2E тесты из автоматического запуска
    exclude: ['src/**/*.controller.spec.ts', '**/e2e/**'],
  },
});
