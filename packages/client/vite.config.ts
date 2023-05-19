import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 3000,
    fs: {
      strict: false,
    },
    watch: {
      usePolling: true
    }
  },
  build: {
    target: "es2022",
  },
});
