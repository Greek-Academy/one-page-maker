/// <reference types="vitest" />
/// <reference types="vite/client" />
// ↑ これがないと test: {...} がエラーになる. 参考: https://stackoverflow.com/questions/77153736/troubleshooting-vitest-setup-in-vite-config-js-with-react-ts-template
import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    define: {
        'import.meta.vitest': false,
    },
    test: {
        globals: true,
        environment: 'happy-dom',
        setupFiles: ['vitest.setup.ts'],
        exclude: [
            '**/node_modules/**',
            '**/dist/**',
            '**/cypress/**',
            '**/.{idea,git,cache,output,temp}/**',
            '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
            // ↑ここまでデフォルト値
            'tests/e2e/**'
        ]
    },
    optimizeDeps: {
        esbuildOptions: {
            tsconfig: 'tsconfig.json'
        }
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
})
