import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './', // important for Tauri!
  plugins: [react()],
  optimizeDeps: {
    include: [
      '@tauri-apps/api/tray',
      '@tauri-apps/api/menu',
      '@tauri-apps/api/process',
    ],
  },
})
