import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Any request to /api is forwarded to the Express server, so we avoid CORS problems in dev.
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: { '/api': 'http://127.0.0.1:5000' },
  },
});
