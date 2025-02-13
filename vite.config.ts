import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const PORT = process.env.VITE_PORT;
const API_URL = process.env.VITE_API_URL;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Ensure `@` maps to `src/`
    },
  },
  server: {
    port: Number(PORT), // Get port from .env, default to 8002
    host: '0.0.0.0', // Allow access from any IP
  },
  define: {
    'process.env.VITE_API_URL': JSON.stringify(API_URL),
  },
});