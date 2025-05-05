import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/IFN666-Assignment2/',
  plugins: [react()],
  resolve: {
    // ensure all imports of @tanstack/react-query use the same module instance
    dedupe: ["@tanstack/react-query"]
  }
})
