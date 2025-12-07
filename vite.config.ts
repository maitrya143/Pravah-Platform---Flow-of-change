import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/Pravah-Platform---Flow-of-change/",
  server: {
    port: 3000,
  }
})
