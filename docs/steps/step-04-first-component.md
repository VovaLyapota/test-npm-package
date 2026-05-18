# Step 4 — Creating Your First Component

## Overview

With Vite configured, it's time to write actual library code. This step covers the **folder structure** of your `src/` directory and walks through creating your first component — a `Button` — as a concrete example.

---

## `src/` Folder Structure

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx   ← component implementation
│   │   └── index.ts     ← re-exports for this component
│   ├── Modal/
│   │   ├── Modal.tsx
│   │   └── index.ts
│   └── ...
├── config/              ← shared constants, theme tokens, etc.
├── utils/               ← pure utility functions (formatters, validators, etc.)
└── index.ts             ← barrel file — the public API of your library
```

### Why this structure?

- **One folder per component** — keeps the implementation self-contained. Everything related to `Button` lives in `Button/`, nothing else.
- **`index.ts` per component** — controls what the component exposes. Consumers (and your barrel file) import from the folder, not from the file directly. This lets you rename or restructure internal files without breaking anything outside.
- **`config/`** — a place for values shared across components: design tokens, breakpoints, color palettes, z-index scales. Keeps magic values out of component code.
- **`utils/`** — pure functions that are reusable across components but not tied to any single one. No React, no side effects.
- **Root `index.ts`** — the single entry point Vite uses to build the library. Only what is exported here becomes part of the public API.

---

## Creating the Button Component

### `src/components/Button/Button.tsx`

```tsx
export enum COLORS {
  RED = "red",
  GREEN = "green",
  BLUE = "blue",
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color: COLORS;
}

const Button = ({ color, ...props }: ButtonProps) => {
  return (
    <button style={{ color }} {...props}>
      New Super-duper component button
    </button>
  );
};

export default Button;
```

A few things worth noting:

- **`ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>`** — instead of manually listing every prop (`onClick`, `disabled`, `type`, etc.), you extend the native HTML button attributes. Your component inherits all of them automatically, and TypeScript enforces correctness. You only declare the props that are *new or override* the defaults — in this case, `color`.
- **`...props` spread** — passes all remaining HTML attributes straight through to the `<button>` element. This is standard practice for wrapper components so consumers aren't blocked by missing prop forwarding.
- **`COLORS` enum** — centralises the allowed color values. Instead of accepting a raw `string`, the prop is constrained to a known set. Consumers get autocomplete and a compile-time error if they pass an invalid value.
- **Named exports for types, default export for the component** — `ButtonProps` and `COLORS` are named exports so consumers can import them separately if needed (e.g., to type their own wrappers).

---

### `src/components/Button/index.ts`

```ts
export * from "./Button";
```

This re-exports everything from `Button.tsx` — the component (as default), `ButtonProps`, and `COLORS`. The component folder's `index.ts` is the only file the rest of the codebase imports from.

---

### `src/index.ts` — The Barrel File

```ts
export * from "./components/Button";
```

This is the **root barrel file** — the single entry point declared in `vite.config.ts`. Every component you want to expose publicly must be re-exported here.

As your library grows:

```ts
export * from "./components/Button";
export * from "./components/Modal";
export * from "./components/Input";
// ...
```

If something is not exported from `src/index.ts`, it does not exist as far as consumers are concerned — even if it's in the `dist/` folder.

---

## The Export Chain

```
Button.tsx  →  Button/index.ts  →  src/index.ts  →  dist/  →  consumer
```

Each layer re-exports from the one before it. This keeps imports clean for consumers:

```ts
// consumer code
import { Button, ButtonProps, COLORS } from "@yourscope/your-library";
```

They never need to know your internal folder structure.

---

## Summary

| File | Purpose |
|---|---|
| `Button.tsx` | Component implementation + exported types |
| `Button/index.ts` | Re-exports everything from the component file |
| `src/index.ts` | Root barrel — defines the library's public API |
| `config/` | Shared constants and design tokens |
| `utils/` | Reusable pure functions, not tied to any component |
