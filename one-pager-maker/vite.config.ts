/// <reference types="vitest" />
/// <reference types="vite/client" />
// ↑ これがないと test: {...} がエラーになる. 参考: https://stackoverflow.com/questions/77153736/troubleshooting-vitest-setup-in-vite-config-js-with-react-ts-template
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom'
  },
})
