import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import environmentPlugin from 'vite-plugin-environment'
import VitePlainText from 'vite-plugin-plain-text';
import react from '@vitejs/plugin-react'

const plugins =  [externalizeDepsPlugin(), VitePlainText(["**/*.sql"], {
            namedExport: false
})];
export default defineConfig({
    main: {
        plugins,
        build: {
            lib: {
                entry: "src/electron/main/index.ts"
            },
            rollupOptions: {
                external: ['sqlite3']
            }
        }
    },
    preload: {
        plugins,
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