import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves this repo at clarestar-c.github.io/Atlas/
  // (repo name is "Atlas" — capital A, and the path is case-sensitive).
  base: '/Atlas/',
})
