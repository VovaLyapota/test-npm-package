# Step 3 — Bundler Setup

## Overview

Vite is the **bundler** that compiles your library source code into distributable files. For a component library, you use Vite in **library mode** — it outputs optimized `.js` files (ESM + UMD) and type declaration files (`.d.ts`) that consumers can import.

> Why TypeScript? That's covered separately. For now, assume your source is `.ts`/`.tsx`.

---

## Install Dependencies

```bash
npm install --save-dev vite @vitejs/plugin-react vite-plugin-dts
```

| Package | Purpose |
|---|---|
| `vite` | The core bundler |
| `@vitejs/plugin-react` | Enables JSX/TSX transformation |
| `vite-plugin-dts` | Generates `.d.ts` type declaration files alongside the JS output |

---

## Create `vite.config.ts`

Create a `vite.config.ts` file at the root of your project:

```ts
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
      name: "my-testing-library", // global variable name for UMD builds
      fileName: "mtl", // base name for output files (e.g., mtl.js, mtl.umd.cjs)
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"], // don't bundle React — consumer already has it
    },
  },
});
```

---

## Config Fields Explained

### `entry`

```ts
entry: resolve(import.meta.dirname, "src/index.ts")
```

Points Vite to your **barrel file** — the single file that re-exports everything your library exposes publicly. Everything that `src/index.ts` exports becomes part of the public API.

---

### `formats`

```ts
formats: ["es", "umd"]
```

Tells Vite to produce two output formats:

| Format | Output file | Used by |
|---|---|---|
| `"es"` | `mtl.js` | Modern bundlers (Vite, Webpack, Rollup) via `import` |
| `"umd"` | `mtl.umd.cjs` | Legacy environments, `require()`, CDN scripts |

---

### `name`

```ts
name: "my-testing-library"
```

The **global variable name** used in UMD builds when loaded via a `<script>` tag (e.g., `window.myTestingLibrary`). Not relevant for bundler environments, but required when `"umd"` is in `formats`.

---

### `fileName`

```ts
fileName: "mtl"
```

The **base name** for all generated output files. Vite appends the format and extension automatically:

- `mtl.js` → ESM output
- `mtl.umd.cjs` → UMD/CommonJS output
- `mtl.d.ts` → Type declarations (from `vite-plugin-dts`)

> ⚠️ **This value must match the paths declared in `package.json`.** See below.

---

### `external`

```ts
external: ["react", "react-dom", "react/jsx-runtime"]
```

Excludes React from the bundle. Since every consumer of your library will already have React installed, bundling it would be wasteful and cause version conflicts.

---

## What Must Match Between `vite.config.ts` and `package.json`

The `fileName` in `vite.config.ts` determines the actual filenames Vite outputs to `dist/`. Your `package.json` entry points must reference those exact filenames:

| `vite.config.ts` | `package.json` |
|---|---|
| `fileName: "mtl"` + `format: "es"` → `dist/mtl.js` | `"module": "./dist/mtl.js"` |
| `fileName: "mtl"` + `format: "umd"` → `dist/mtl.umd.cjs` | `"main": "./dist/mtl.umd.cjs"` |
| `fileName: "mtl"` + `format: "es"` → `dist/mtl.js` | `"exports" > "import": "./dist/mtl.js"` |
| `fileName: "mtl"` + `format: "umd"` → `dist/mtl.umd.cjs` | `"exports" > "require": "./dist/mtl.umd.cjs"` |

If these don't match, consumers will get a "module not found" error when installing your package.

---

## Add a Build Script

In `package.json`, add:

```json
"scripts": {
  "build": "vite build"
}
```

Run `npm run build` to compile your library. The output lands in the `dist/` folder.

---

## Summary

| Config key | What it controls |
|---|---|
| `entry` | Which file is the public API of your library |
| `formats` | What module formats are output (`es`, `umd`) |
| `name` | UMD global variable name |
| `fileName` | Base name of output files — **must match `package.json` paths** |
| `external` | Dependencies excluded from the bundle (like React) |

---

## Configuring TypeScript (`tsconfig.json`)

Vite handles the bundling, but TypeScript needs its own config file to understand your project — for editor tooling, type checking, and `.d.ts` generation.

Create a `tsconfig.json` at the root of your project:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "declaration": true,
    "rootDir": "src",
    "outDir": "dist",
    "declarationDir": "dist",
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

### Fields Explained

#### `target`

```json
"target": "ES2020"
```

The JavaScript version your TypeScript compiles down to. `ES2020` is a safe modern baseline — it supports async/await, optional chaining, and nullish coalescing without being so old that output becomes bloated with polyfills.

---

#### `module` and `moduleResolution`

```json
"module": "ESNext",
"moduleResolution": "bundler"
```

- `module: "ESNext"` — keeps `import`/`export` syntax as-is in the TypeScript output. Vite (Rollup under the hood) handles the final module transformation.
- `moduleResolution: "bundler"` — tells TypeScript to resolve modules the same way a modern bundler would. This correctly handles bare imports, path aliases, and `exports` fields in `package.json`. Use this instead of the older `"node"` or `"node16"` modes when your project is bundled by Vite.

---

#### `jsx`

```json
"jsx": "react-jsx"
```

Uses the modern React JSX transform (React 17+). You don't need to `import React from "react"` at the top of every file — the transform injects it automatically.

---

#### `strict`

```json
"strict": true
```

Enables the full set of TypeScript strict checks in one flag. This includes `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`, and others. For a library, this is non-negotiable — it prevents subtle type holes that would surface as runtime bugs for your consumers.

---

#### `declaration` and `declarationDir`

```json
"declaration": true,
"declarationDir": "dist"
```

- `declaration: true` — instructs TypeScript to emit `.d.ts` type declaration files alongside the compiled output.
- `declarationDir: "dist"` — places those `.d.ts` files in the same `dist/` folder as the JS output.

> In practice, `vite-plugin-dts` handles `.d.ts` generation during `vite build`. These options ensure your editor and any direct `tsc` runs also produce declarations correctly.

---

#### `rootDir` and `outDir`

```json
"rootDir": "src",
"outDir": "dist"
```

- `rootDir` — the root of your source files. TypeScript uses this to mirror the folder structure in the output.
- `outDir` — where compiled output goes. Matches the `dist/` folder Vite writes to.

---

#### `skipLibCheck`

```json
"skipLibCheck": true
```

Skips type checking of `.d.ts` files inside `node_modules`. Without this, TypeScript would validate every dependency's type declarations — which is slow and often noisy due to type issues in third-party packages you don't control.

---

#### `include`

```json
"include": ["src"]
```

Tells TypeScript to only compile files inside `src/`. Config files, scripts, and anything outside `src/` are excluded from the compilation.

---

### What Must Match Between `tsconfig.json` and `vite.config.ts`

| `tsconfig.json` | `vite.config.ts` |
|---|---|
| `"rootDir": "src"` | `entry: resolve(..., "src/index.ts")` — both treat `src/` as the source root |
| `"outDir": "dist"` | Vite also outputs to `dist/` by default |
| `"declarationDir": "dist"` | `vite-plugin-dts` writes `.d.ts` files to `dist/` |

These don't need to be identical, but they must be consistent — if they diverge, declaration files can end up in the wrong place or not be picked up by consumers.
