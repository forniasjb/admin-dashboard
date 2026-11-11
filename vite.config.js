import react from "@vitejs/plugin-react";
import process from "node:process";
import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "VITE_");
    if (!env.VITE_REPORTS_PROXY_PATH || !env.VITE_REPORTS_PROXY_TARGET) {
        throw new Error("VITE_REPORTS_PROXY_PATH and VITE_REPORTS_PROXY_TARGET must be configured");
    }
    return {
        plugins: [react()],
        server: {
            host: "0.0.0.0",
            port: 5173,
            strictPort: true,
            proxy: {
                [env.VITE_REPORTS_PROXY_PATH]: {
                    target: env.VITE_REPORTS_PROXY_TARGET,
                    changeOrigin: true,
                },
            },
        },
    };
});
