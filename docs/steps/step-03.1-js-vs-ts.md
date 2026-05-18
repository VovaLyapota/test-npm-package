# Step 3.1 — Choosing Your Language: TypeScript vs JavaScript

## Overview

Before writing a single component, you need to decide how your source code will be written. There are three common approaches for building an npm library. Each has trade-offs — this doc compares them so you understand the choice, not just follow it blindly.

---

## The Three Approaches

### 1. Pure JavaScript

Write `.js` files with no type annotations. No compilation step needed — what you write is (mostly) what gets shipped.

```js
// button.js
export function Button({ label }) {
  return <button>{label}</button>;
}
```

**Pros:**
- Zero tooling overhead — no compiler, no config
- Fastest to get started

**Cons:**
- No type safety — bugs surface at runtime, not during development
- Consumers get no autocomplete or type hints when using your library
- Requires manually maintaining JSDoc if you want any IDE support
- Doesn't scale well — large codebases become hard to refactor confidently

---

### 2. JavaScript + JSDoc

Write `.js` files but annotate types using JSDoc comments. TypeScript can still read these and provide type checking via `// @ts-check`.

```js
// button.js
/**
 * @param {{ label: string, onClick: () => void }} props
 */
export function Button({ label, onClick }) {
  return <button onClick={onClick}>{label}</button>;
}
```

**Pros:**
- No build step for types — stays as JavaScript
- Gets you some editor autocomplete and basic type checking
- Useful for small projects or when migrating an existing JS codebase incrementally

**Cons:**
- JSDoc syntax is verbose and clunky compared to inline TypeScript types
- Type coverage is limited — complex generics and conditional types are painful or impossible
- Still no `.d.ts` output by default — consumers won't get full type support unless you add extra tooling
- The "best of both worlds" often ends up as the worst of both

---

### 3. TypeScript

Write `.ts`/`.tsx` files. The TypeScript compiler (or Vite + `vite-plugin-dts`) handles transpilation and generates `.d.ts` declaration files automatically.

```ts
// Button.tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
}

export function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
```

**Pros:**
- Full type safety at development time — catch errors before they reach consumers
- Automatic `.d.ts` generation — consumers get first-class autocomplete and type hints
- Refactoring is safe and reliable at any scale
- Industry standard for component libraries — expected by consumers
- Integrates cleanly with Vite, ESLint, and the rest of the modern toolchain

**Cons:**
- Requires a `tsconfig.json` and slightly more initial setup
- Minor learning curve if you're new to TypeScript

---

## Comparison Table

| | Pure JS | JS + JSDoc | TypeScript |
|---|:---:|:---:|:---:|
| Type safety during development | ❌ | ⚠️ Partial | ✅ |
| `.d.ts` output for consumers | ❌ | ⚠️ Manual | ✅ Automatic |
| Autocomplete for consumers | ❌ | ⚠️ Limited | ✅ Full |
| Refactoring confidence | ❌ | ⚠️ Low | ✅ High |
| Build tooling required | ❌ | ❌ | ✅ Minimal |
| Scales to large codebases | ❌ | ⚠️ Poorly | ✅ |
| Industry adoption for libraries | Low | Rare | **Standard** |
| Setup complexity | Low | Low | Low–Medium |

> ⚠️ = possible but limited or requires significant extra effort

---

## What We Recommend

**TypeScript.** For a shared component library — even a small one — TypeScript is the right tool. The main value of a library over copy-pasting code is that consumers get a well-defined, stable API. TypeScript enforces that API at compile time for both you and your consumers. The setup cost is low and pays off immediately.

---

## TypeScript Is a Superset of JavaScript

If you already know JavaScript, TypeScript is not a new language — it's JavaScript with types. Every valid `.js` file is already valid TypeScript. You don't have to learn new syntax from scratch; you just start adding type annotations where you want them, and the compiler tells you when something doesn't add up.

Think of it this way: the logic, the functions, the loops, the async/await — all identical. The only thing TypeScript adds is the ability to say "this argument must be a string" or "this function returns a number", and then have your editor and compiler enforce that for you.

If you know JS, you already know 90% of TypeScript.

---

## What Comes Next

All remaining steps in this guide use **TypeScript**. The next steps will cover:

- Setting up `tsconfig.json`
- How `vite-plugin-dts` generates `.d.ts` files from your source
- Structuring your `src/` folder and barrel file (`index.ts`)
