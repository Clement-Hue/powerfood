import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import environmentPlugin from 'vite-plugin-environment'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    global: {}
  },
  plugins: [react(),
    tsconfigPaths(),
    environmentPlugin({
      NODE_ENV: "development",
      DEBUG: "false",
      API_BASE_URL: null,
    }),
  ],
})
