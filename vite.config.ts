import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import * as dotenv from 'dotenv';
import path from 'path';
import { defineConfig } from 'vite';

dotenv.config();

// https://vite.dev/config
export default defineConfig({
  server: {
    port: parseInt(process.env.PORT || '3000'),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [react(), tailwindcss()],
});
