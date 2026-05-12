/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [
    react(),
    dts(), // generates .d.ts type files
  ],
  build: {
    lib: {
      entry: resolve(import.meta.dirname, "src/index.ts"),
      // your barrel file — the "door" to your library
      formats: ["es", "umd"],
      // output both ESM and CommonJS
      name: "my-testing-library",
      // global variable name for UMD builds (if you add UMD later)
      fileName: "mtl", // base name for output files (e.g., mtl.es.js, mtl.cjs.js)
      // main/module/exports in package.json should match "fileName" in vite.config.ts
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"], // don't bundle React — consumer already has it
    },
  },
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, ".storybook"),
          }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: "chromium",
              },
            ],
          },
        },
      },
    ],
  },
});
