import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const port = 5173;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
