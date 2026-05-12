import { defineConfig } from "vite";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts(), // generates .d.ts type files
  ],
  build: {
    lib: {
      entry: resolve(import.meta.dirname, "src/index.ts"), // your barrel file — the "door" to your library
      formats: ["es", "umd"], // output both ESM and CommonJS
      name: "my-testing-library", // global variable name for UMD builds (if you add UMD later)
      fileName: "mtl", // base name for output files (e.g., mtl.es.js, mtl.cjs.js)
      // main/module/exports in package.json should match "fileName" in vite.config.ts
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"], // don't bundle React — consumer already has it
    },
  },
});
