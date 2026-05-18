# Step 2 — Initiating the Project (package.json Setup)

## Overview

After cloning the repository locally, the first real setup step is initializing the project and configuring `package.json`. This file is the identity card of your npm package — it controls how the package is named, built, and published.

Run the following to generate a base `package.json`:

```bash
npm init
```

Then manually fill in or adjust the fields described below.

---

## Key Fields Explained

### `name`

```json
"name": "@authorname/your-package-name"
```

The **npm package name** — this is what consumers use when installing your library (`npm install @authorname/your-package-name`).

- The `@authorname/` prefix is a **npm scope**. For GitHub Packages, the scope must match your GitHub username or organization name.
- This name is **completely independent** of the GitHub repository name — you can name the repo anything you like.
- Scoped packages are private by default on GitHub Packages, which is exactly what we want for a private library.

---

### `repository`

```json
"repository": {
  "type": "git",
  "url": "git+https://github.com/authorname/your-repo.git"
}
```

Links the npm package back to its source code on GitHub. Useful for anyone who installs the package and wants to explore the source or report issues.

---

### `publishConfig`

```json
"publishConfig": {
  "registry": "https://npm.pkg.github.com",
  "access": "restricted"
}
```

Tells npm **where to publish** this package and with what access level.

- `registry` — points to **GitHub Packages** instead of the default public npm registry. This is what keeps your library private and tied to GitHub.
- `access: "restricted"` — explicitly marks the package as private/restricted. Only people with the right GitHub permissions can install it.

> Without `publishConfig`, running `npm publish` would attempt to push to the public npm registry — not what you want for a private library.

---

### `author`

```json
"author": "authorname"
```

The name or GitHub username of the package author. Informational only, but helpful for ownership clarity.

---

### `type`

```json
"type": "module"
```

Tells Node.js to treat `.js` files in this package as **ES Modules** (using `import`/`export`) rather than CommonJS (`require`). This is the modern standard and aligns with how Vite builds the library output.

---

### `main` and `module`

```json
"main": "./dist/mtl.umd.cjs",
"module": "./dist/mtl.js"
```

These point consumers to the correct entry file depending on their environment:

| Field | Format | Used by |
|---|---|---|
| `main` | CommonJS (`.cjs`) | Older Node.js tooling, `require()` environments |
| `module` | ES Module (`.js`) | Modern bundlers (Webpack, Vite, Rollup) |

The filenames (`mtl.umd.cjs`, `mtl.js`) come from the `fileName` value set in `vite.config.ts`. They must match exactly.

---

### `exports`

```json
"exports": {
  ".": {
    "import": "./dist/mtl.js",
    "require": "./dist/mtl.umd.cjs"
  }
}
```

The modern, preferred way to define package entry points. Gives bundlers and Node.js precise control over which file to use:

- `"import"` — used when the consumer does `import ... from 'your-package'` (ESM)
- `"require"` — used when the consumer does `require('your-package')` (CJS)

> `exports` takes precedence over `main`/`module` in modern tooling. It is the recommended approach going forward.

---

### `files`

```json
"files": ["dist"]
```

Specifies which files and folders are **included when publishing** the package to the registry. Only the `dist/` folder (your compiled output) is shipped — source files, configs, stories, and tests are excluded.

This keeps the published package lean and avoids leaking internal implementation details.

---

## Complete `package.json` Sample

```json
{
  "name": "@authorname/your-package-name",
  "version": "1.0.0",
  "description": "A private React component library",
  "author": "authorname",
  "license": "ISC",
  "type": "module",
  "main": "./dist/mtl.umd.cjs",
  "module": "./dist/mtl.js",
  "exports": {
    ".": {
      "import": "./dist/mtl.js",
      "require": "./dist/mtl.umd.cjs"
    }
  },
  "files": ["dist"],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/authorname/your-repo.git"
  },
  "publishConfig": {
    "registry": "https://npm.pkg.github.com",
    "access": "restricted"
  },
  "scripts": {
    "build": "vite build"
  }
}
```

> The `main`, `module`, and `exports` paths (`mtl.js`, `mtl.umd.cjs`) come from the `fileName` set in `vite.config.ts`. These must be configured there first — covered in the next step.

---

## Summary

| Field | Purpose |
|---|---|
| `name` | Package identity + install name; scope must match GitHub username |
| `repository` | Links package back to GitHub source |
| `publishConfig` | Points to GitHub Packages registry; sets private access |
| `author` | Package ownership info |
| `type` | Marks package as ES Module |
| `main` | CJS entry point for legacy environments |
| `module` | ESM entry point for modern bundlers |
| `exports` | Modern entry point map (takes precedence over main/module) |
| `files` | Controls what gets published — only `dist/` |
