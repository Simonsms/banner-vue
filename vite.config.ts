import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    host: "0.0.0.0",
    proxy: {
      "/dev-api": {
        target: "http://39.106.88.72:18000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dev-api/, ""),
      },
    },
  },
});
