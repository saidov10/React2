import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": "/src"
    },
  },
  server: {
    proxy: { 
      '/api': {
        target: 'https://debt-back-prod.onrender.com',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})
