import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import environmentPlugin from 'vite-plugin-environment'
import react from '@vitejs/plugin-react'

export default defineConfig({
    main: {
        plugins: [externalizeDepsPlugin()],
        build: {
            lib: {
                entry: "src/electron/main/index.ts"
            }
        }
    },
    preload: {
        plugins: [externalizeDepsPlugin()],
        build: {
            lib: {
                entry: "src/electron/preload/index.ts"
            }
        }
    },
    renderer: {
        define: {
            global: {}
        },
        root: ".",
        build: {
            rollupOptions: {
                input: "index.html"
            }
        },
        plugins: [react(),
            tsconfigPaths(),
            environmentPlugin({
                NODE_ENV: "development",
                DEBUG: "false",
                API_BASE_URL: null,
            }),
        ]
    }
})