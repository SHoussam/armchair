import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  const backendTarget = env.VITE_BACKEND_URL || "http://localhost:8000"
  const basePath = env.VITE_BASE_PATH || env.VITE_BASE_URL || "/armchair/"

  return {
    plugins: [react()],
    base: basePath,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: ["react", "react-dom"],
    },
    optimizeDeps: {
      include: ["react", "react-dom", "i18next", "react-i18next"],
    },
    server: {
      host: true,
      proxy: {
        "/api": {
          target: backendTarget,
          changeOrigin: true,
        },
        "/storage": {
          target: backendTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
