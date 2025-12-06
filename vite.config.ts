/*
 * @Author       : LAPTOP-T1PV1M6U\赵祥 18201492987@163.com
 * @Date         : 2025-12-01 21:59:07
 * @LastEditors  : LAPTOP-T1PV1M6U\赵祥 18201492987@163.com
 * @LastEditTime : 2025-12-04 11:02:44
 * @FilePath     : \iosbanner-vue\vite.config.ts
 * @Description  :
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd());

  return {
    base: mode === "production" ? "/dev-daping" : "/",
    plugins: [vue()],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    server: {
      host: "0.0.0.0",
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_APP_API_URL,
          changeOrigin: true,
          // rewrite: (path) => path.replace(new RegExp(`^${env.VITE_APP_BASE_API}`), ""),
        },
      },
    },
    build: {
      // 生产环境构建配置
      outDir: "dist",
      assetsDir: "assets",
      sourcemap: mode === "development",
      // 消除打包大小超过500kb警告
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          // 分包策略
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return "vendor";
            }
          },
        },
      },
      // 排除图片资源打包（使用 CDN）
      assetsInlineLimit: 0, // 禁用内联
      // 注意：由于已改为使用 CDN，本地图片不会被引用
    },
    optimizeDeps: {
      exclude: ["src/assets/images"],
    },
  };
});
