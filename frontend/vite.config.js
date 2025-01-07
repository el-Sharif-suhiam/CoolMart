/* eslint-disable no-undef */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as dotenv from "dotenv";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//

dotenv.config({ path: resolve(__dirname, "../.env") });

export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    proxy: {
      "/uploads": {
        target:
          process.env.NODE_ENV === "dev"
            ? process.env.SERVER_URL
            : process.env.PRODUCTION_URL,
        changeOrigin: true,
      },
      "/api": {
        target:
          process.env.NODE_ENV === "dev"
            ? process.env.SERVER_URL
            : process.env.PRODUCTION_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/create-checkout-session": {
        target:
          process.env.NODE_ENV === "dev"
            ? process.env.SERVER_URL
            : process.env.PRODUCTION_URL,
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
  define: {
    "process.env": JSON.stringify(process.env),
  },
});
