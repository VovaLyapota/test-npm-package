# Step 8 — Publishing to GitHub Packages

## Overview

With the library built and the registry chosen, this step covers the full process of publishing your package to GitHub Packages — both manually from your machine and automatically via GitHub Actions on every release.

---

## Prerequisites

Before publishing, make sure your `package.json` has the correct `name`, `publishConfig`, and entry points as set up in Step 2:

```json
{
  "name": "@your-github-org/your-package-name",
  "version": "1.0.0",
  "publishConfig": {
    "registry": "https://npm.pkg.github.com",
    "access": "restricted"
  }
}
```

- `name` must be scoped to your GitHub username or org (`@your-github-org/...`)
- `registry` must point to `https://npm.pkg.github.com`
- `access: "restricted"` marks the package as private

---

## Step 1 — Create a Personal Access Token (PAT)

GitHub Packages uses Personal Access Tokens for authentication.

1. Go to **GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)**
2. Click **Generate new token (classic)**
3. Give it a name (e.g. `npm-publish`)
4. Set an expiration
5. Select the following scopes:
   - `write:packages` — to publish packages
   - `read:packages` — to install packages
   - `repo` — required for private repositories
6. Click **Generate token** and copy it immediately — you won't see it again

---

## Step 2 — Authenticate Locally

Create or edit a `.npmrc` file in your **home directory** (`~/.npmrc`), not in the project:

```
//npm.pkg.github.com/:_authToken=YOUR_PAT_HERE
```

> Store the token in your home directory `.npmrc`, not in the project `.npmrc` — you don't want to accidentally commit credentials.

Alternatively, authenticate via the CLI:

```bash
npm login --registry=https://npm.pkg.github.com
```

When prompted:
- **Username:** your GitHub username
- **Password:** your PAT (not your GitHub password)
- **Email:** your GitHub email

---

## Step 3 — Add a Project-level `.npmrc`

Add a `.npmrc` file at the **root of the project** (this one is safe to commit — it contains no secrets):

```
@your-github-org:registry=https://npm.pkg.github.com
```

This tells npm: whenever you install or publish a package scoped to `@your-github-org`, use GitHub Packages instead of the default npm registry. Other packages continue to resolve from npm as normal.

---

## Step 4 — Build and Publish Manually

Build the library first:

```bash
npm run build
```

Then publish:

```bash
npm publish
```

npm reads `publishConfig` from `package.json` and pushes the contents of `dist/` (as defined in `files`) to GitHub Packages.

To verify: go to your GitHub repository → **Packages** tab — your package should appear there.

---

## Step 5 — Automate Publishing with GitHub Actions

Manual publishing works, but you want publishing to happen automatically when you create a new release. Create `.github/workflows/publish.yml`:

```yaml
name: Publish Package

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: "https://npm.pkg.github.com"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Publish
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### How it works

- **Trigger:** fires when you create a new GitHub Release (not on every push — this keeps publishing intentional)
- **`GITHUB_TOKEN`:** automatically provided by GitHub Actions — no manual secrets needed for publishing to the same repo's package registry
- **`permissions: packages: write`** — explicitly grants the workflow permission to push to GitHub Packages

---

## Versioning — Bump Before You Publish

GitHub Packages rejects publishing the same version twice. Before publishing a new release, bump the version in `package.json`:

```bash
npm version patch   # 1.0.0 → 1.0.1  (bug fixes)
npm version minor   # 1.0.0 → 1.1.0  (new features, backwards compatible)
npm version major   # 1.0.0 → 2.0.0  (breaking changes)
```

This updates `package.json` and creates a git commit + tag automatically. Push the tag, then create a GitHub Release from it — the Actions workflow fires and publishes the new version.

```bash
git push && git push --tags
```

---

## How Consumers Install the Package

### Repository access is required

GitHub Packages for private repositories is tied to GitHub repository access. **A consumer must be a member (collaborator) of the repository** — or a member of the GitHub organization that owns it — to authenticate and install the package. A valid PAT alone is not enough; the GitHub account it belongs to must have at least **read access** to the repository.

To grant access:
- **Individual repo:** go to **Settings → Collaborators** and invite the person
- **GitHub org:** add the person to the org and grant them access to the repository via a team

---

### Consumer setup

Every consumer needs a `.npmrc` in their project pointing scoped packages at GitHub Packages, plus a PAT with `read:packages` scope:

**Project `.npmrc` (commit this):**
```
@your-github-org:registry=https://npm.pkg.github.com
```

**Home `~/.npmrc` or CI secret (never commit this):**
```
//npm.pkg.github.com/:_authToken=CONSUMER_PAT_HERE
```

Then install as normal:

```bash
npm install @your-github-org/your-package-name
```

### In CI pipelines

For CI environments (GitHub Actions, Jenkins, etc.), store the PAT as a secret and pass it as an environment variable — same pattern as above. The GitHub account the PAT belongs to must still have repo access.

---

## Summary

| Step | What happens |
|---|---|
| Create PAT | Grants permission to push/pull from GitHub Packages |
| `~/.npmrc` | Stores the token locally — never committed |
| Project `.npmrc` | Routes scoped package installs to GitHub Packages — safe to commit |
| `npm publish` | Pushes `dist/` to the registry based on `publishConfig` |
| GitHub Actions workflow | Auto-publishes on every new GitHub Release |
| `npm version` | Bumps version before each release — same version cannot be published twice |
| Repo access | Consumers must be repo collaborators or org members — a PAT alone is not enough |
