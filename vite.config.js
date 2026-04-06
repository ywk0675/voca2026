import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalized = id.replace(/\\/g, '/')
          if (normalized.includes('node_modules/react') || normalized.includes('node_modules/react-dom')) {
            return 'vendor-react'
          }
          if (normalized.includes('node_modules/@supabase')) {
            return 'vendor-supabase'
          }
          if (normalized.endsWith('/src/wordCatalog.js')) {
            return 'word-catalog'
          }
          if (normalized.endsWith('/src/wordDataWw5.js')) {
            return 'word-data-ww5'
          }
          if (normalized.endsWith('/src/wordDataBew.js')) {
            return 'word-data-bew'
          }
          if (normalized.endsWith('/src/wordDataNew.js')) {
            return 'word-data-new'
          }
          if (normalized.endsWith('/src/wordDataWwp.js')) {
            return 'word-data-wwp'
          }
          return undefined
        },
      },
    },
  },
})
