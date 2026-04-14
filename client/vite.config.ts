import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import biome from 'vite-plugin-biome';

export default defineConfig({
  plugins: [
    react(),
    biome({
      mode: 'lint',
      applyFixes: true,
    }),
  ],
  resolve: {
    alias: {
      '@app': resolve(__dirname, './src/app'),
      '@pages': resolve(__dirname, './src/pages'),
      '@widgets': resolve(__dirname, './src/widgets'),
      '@features': resolve(__dirname, './src/features'),
      '@entities': resolve(__dirname, './src/entities'),
      '@shared': resolve(__dirname, './src/shared'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        presenter: resolve(__dirname, 'src/app/presenter/index.html'),
        viewer: resolve(__dirname, 'src/app/viewer/index.html'),
      },
    },
  },
});