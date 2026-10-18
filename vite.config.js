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
        // React d'abord (sinon il finit dans le bloc « motion » et ce bloc se charge sur toutes les pages) ;
        // motion n'est utilisé que par la landing /votre-projet : il reste dans ses blocs à la demande.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react-vendor'
          if (id.includes('react-router')) return 'router'
          return undefined
        },
      },
    },
  },
})
