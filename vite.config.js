import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: ".", // index.html est à la racine

  build: {
    outDir: "dist", // dossier servi par Express
    emptyOutDir: true,

    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        tarifs: resolve(__dirname, "tarifs.html"),
        services: resolve(__dirname, "services.html"),
      },
    },
  },

  server: {
    port: 5173,
    strictPort: true,
  },
});
