import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'node:process'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  if (!env.VITE_REPORTS_PROXY_PATH || !env.VITE_REPORTS_PROXY_TARGET) {
    throw new Error('VITE_REPORTS_PROXY_PATH and VITE_REPORTS_PROXY_TARGET must be configured')
  }
  return {
    plugins: [react()],
    server: {
      proxy: {
        [env.VITE_REPORTS_PROXY_PATH]: {
          target: env.VITE_REPORTS_PROXY_TARGET,
          changeOrigin: true,
        },
      },
    },
  }
})
