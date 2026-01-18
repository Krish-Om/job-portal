import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    middlewareMode: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
    middlewareMode: true,
    allowedHosts: ['krishombasukala.com.np', 'www.krishombasukala.com.np', 'localhost'],
    hmr: false,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.js',
  },
}); 