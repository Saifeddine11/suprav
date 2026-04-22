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
})
