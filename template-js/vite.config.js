import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        begin: resolve(__dirname, "begin.html"),
        check: resolve(__dirname, "check.html"),
      },
    },
  },
});
