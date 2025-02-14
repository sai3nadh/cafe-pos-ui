import { defineConfig } from 'vite';
import angular from '@vitejs/plugin-angular'; // if Angular uses Vite, adjust if needed

export default defineConfig({
  server: {
    host: '0.0.0.0',
    allowedHosts: [
      'localhost',
      '*.ngrok-free.app'
    ]
  }
});
