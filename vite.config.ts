
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'charts-vendor': ['recharts'],
          'icons-vendor': ['lucide-react'],
          'genai-vendor': ['@google/genai']
        },
      },
    },
  },
  // Injeta a API_KEY do ambiente de build (Vercel) para o código cliente
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
  },
  server: {
    port: 3000,
    host: true
  }
});
