import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    allowedHosts: ["1427-2402-a00-402-cd06-6d9f-f214-41e2-34a7.ngrok-free.app"],
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "/",
  assetsInclude: ["**/*.md", "**/*.mdx"],
});
