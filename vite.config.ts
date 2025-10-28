import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => ({
  base: process.env.GH_PAGES_BASE || '/',
  build: { target: 'es2020', sourcemap: true },
}))
