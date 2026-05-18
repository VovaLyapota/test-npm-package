# Private Component Library — Complete Guide Summary

This document summarises the full setup process end to end. Each step is covered in detail in its own doc — this is the map.

---

## Step 1 — Create a GitHub Repository

Create a **private** GitHub repository. This is the home for your source code, versioning, and publishing pipeline. Being on GitHub is a prerequisite for using GitHub Packages as a registry, which is the recommended path for small teams.

---

## Step 2 — Set Up `package.json`

Run `npm init` and configure the key fields: `name` (scoped to your GitHub org), `publishConfig` (points to GitHub Packages registry), `type: "module"`, and the entry point fields (`main`, `module`, `exports`).

The entry point fields must match the output filenames produced by your bundler — if they don't align, consumers will get module-not-found errors.

---

## Step 3 — Bundler Setup

Install **Vite** and configure it in library mode. Vite compiles your TypeScript source into distributable `.js` files (ESM + UMD) and generates `.d.ts` type declarations via `vite-plugin-dts`.

> **Why a bundler at all?** Your source files are TypeScript/TSX — consumers can't use those directly. The bundler compiles them into standard JavaScript, tree-shakes unused code, externalises peer dependencies like React, and produces the type declarations that give consumers autocomplete and type safety.

> **Why Vite?** Other options exist (Rollup, esbuild, tsup, webpack) but Vite gives you a clean library mode out of the box, fast builds, and first-class TypeScript + React support with minimal config. It's the modern standard for this use case.

Also covered here: `tsconfig.json` setup — TypeScript's own config for editor tooling, strict type checking, and coordinating with Vite on where source and output live.

---

## Step 3.1 — TypeScript vs JavaScript

A short decision doc comparing **Pure JS**, **JS + JSDoc**, and **TypeScript** for writing library source code.

> **Why TypeScript?** A shared library's main value is a well-defined API. TypeScript enforces that API at compile time for both you and your consumers, generates type declarations automatically, and makes large-scale refactoring safe. The setup cost is minimal.

---

## Step 4 — Creating Your First Component

Write your first component (`Button`) and establish the `src/` folder architecture:

```
src/
├── components/
│   └── Button/
│       ├── Button.tsx   ← implementation + exported types
│       └── index.ts     ← re-exports for this component
├── config/              ← shared tokens, constants
├── utils/               ← pure reusable functions
└── index.ts             ← barrel file — the library's public API
```

The export chain (`Button.tsx → Button/index.ts → src/index.ts → dist/`) keeps consumer imports clean and internal structure flexible. Only what is exported from `src/index.ts` becomes part of the public API.

---

## Step 5 — Storybook Setup

Install Storybook and write `.stories.tsx` files alongside each component. Storybook runs a local dev server where every component is rendered in isolation with interactive prop controls.

Each story file has:

- A `meta` default export describing the component (title, controls, default args)
- Named story exports — one per rendered state (`Red`, `Disabled`, etc.)
- `argTypes` that map props to UI controls (dropdowns, toggles, etc.)
- `tags: ["autodocs"]` for an auto-generated documentation page

> **Why Storybook?** It forces you to build components in isolation (which improves API design), gives consumers a live browsable catalogue, and doubles as documentation. For a shared library where consumers can't easily inspect source, this is essential.

---

## Step 6 — Publishing Storybook

Build the static Storybook site (`npm run build-storybook`) and host it so the whole team can browse components without cloning the repo.

| Option       | Cost                                                                   | Notes                                                        |
| ------------ | ---------------------------------------------------------------------- | ------------------------------------------------------------ |
| GitHub Pages | Free with paid GitHub plan; unavailable on free plan for private repos | Workflow already in repo                                     |
| Vercel       | Free                                                                   | Recommended — works with private repos, auto-deploys on push |
| Netlify      | Free                                                                   | Same as Vercel                                               |
| Chromatic    | Free up to 5k snapshots/month                                          | Adds visual regression testing on top of hosting             |

> For private repos on the GitHub free plan, **Vercel or Netlify** are the path of least resistance — connect the repo, set the build command and output directory, done.

---

## Step 7 — Choosing a Registry

Before publishing the package, decide where it lives. Three options:

|             | GitHub Packages            | npm            | Verdaccio   |
| ----------- | -------------------------- | -------------- | ----------- |
| ≤ 10 users  | **$0**                     | ~$70/month     | $0–15/month |
| 11–20 users | ~$44–80/month (all seats on Team plan) | ~$77–140/month | $0 |
| > 20 users  | $80+/month                 | $140+/month    | $0–15/month |

> **Start with GitHub Packages.** It's free for small teams, requires no extra infrastructure, and plugs straight into the permissions you already manage on GitHub. It's the right default and covers you comfortably up to ~10 people.

> **Keep Verdaccio in your back pocket.** If the team grows past ~20 people and per-seat GitHub Team costs become significant, Verdaccio is the natural next step — self-hosted on a free platform tier, zero per-user cost, and the consumer migration is just a one-line change in `.npmrc`. You don't need to set it up now, but it's good to know the exit ramp exists.

---

## Step 8 — Publishing to GitHub Packages

The full publish flow:

1. Create a PAT with `write:packages`, `read:packages`, and `repo` scopes
2. Add the token to `~/.npmrc` (never commit this)
3. Add a project-level `.npmrc` routing scoped installs to GitHub Packages (safe to commit)
4. `npm run build && npm publish`
5. Automate with a GitHub Actions workflow that fires on every new GitHub Release

Consumers must be **repo collaborators or org members** — a PAT alone is not enough. Bump the version with `npm version patch/minor/major` before each publish — the same version cannot be published twice.

---

## Overall Project Architecture

```
your-ui-kit/
├── .github/
│   └── workflows/
│       ├── deploy-storybook.yml   ← builds & deploys Storybook on push to main
│       └── publish.yml            ← builds & publishes package on GitHub Release
├── .storybook/
│   ├── main.ts                    ← story discovery, addons, framework config
│   └── preview.ts                 ← global story parameters
├── src/
│   ├── components/
│   │   └── Button/
│   │       ├── Button.tsx         ← component implementation + exported types
│   │       ├── Button.stories.tsx ← Storybook stories
│   │       └── index.ts           ← re-exports for this component
│   ├── config/                    ← shared tokens and constants
│   ├── utils/                     ← pure utility functions
│   └── index.ts                   ← barrel file — public API of the library
├── dist/                          ← compiled output (generated, not committed)
│   ├── mtl.js                     ← ESM bundle
│   ├── mtl.umd.cjs                ← UMD/CJS bundle
│   └── index.d.ts                 ← type declarations
├── .npmrc                         ← routes scoped installs to GitHub Packages
├── package.json                   ← package identity, entry points, publishConfig
├── tsconfig.json                  ← TypeScript compiler config
└── vite.config.ts                 ← bundler config (library mode)
```
