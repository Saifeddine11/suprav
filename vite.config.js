import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { rmSync } from 'node:fs'

function removeSensitivePublicFiles() {
  return {
    name: 'remove-sensitive-public-files',
    closeBundle() {
      rmSync('dist/api/contact-config.php', { force: true })
      rmSync('dist/api/contact-config.example.php', { force: true })
      rmSync('dist/api/.contact-recaps', { force: true, recursive: true })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), removeSensitivePublicFiles()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('motion') || id.includes('framer-motion')) return 'motion'
          if (id.includes('react-router')) return 'router'
          if (id.includes('react-dom') || id.includes('/react/')) return 'react-vendor'
          return undefined
        },
      },
    },
  },
})
