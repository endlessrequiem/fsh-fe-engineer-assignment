import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(() => {
  // Base path for GitHub Pages deployment
  const base = '/fsh-fe-engineer-assignment/'

  return {
    plugins: [react()],
    base,
  }
})
