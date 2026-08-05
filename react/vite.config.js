import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // host: '20.20.51.5',
    host: 'localhost',
    port: 9200,
  },
})
