# Step 6 — Publishing Your Storybook

## Overview

Running Storybook locally is great during development, but a shared hosted version lets your whole team browse components without cloning the repo. This step covers running Storybook locally and the options for hosting it.

---

## Running Locally

```bash
npm run storybook
```

Starts a local dev server (default: `http://localhost:6006`). Hot-reloads as you edit component or story files. This is all you need during day-to-day development.

To build a static version (the output you deploy):

```bash
npm run build-storybook
```

Outputs a self-contained static site to `storybook-static/`. You can open `storybook-static/index.html` directly in a browser or serve it from any static hosting provider.

---

## Hosting Options

Once built, `storybook-static/` is a plain static site — any host that serves static files works.

### Option 1 — GitHub Pages

GitHub Pages can serve your `storybook-static/` folder automatically via a GitHub Actions workflow.

The workflow in `.github/workflows/deploy-storybook.yml` already handles this:

```yaml
name: Deploy Storybook
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: write
jobs:
  deploy-storybook:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"
      - name: Install dependencies
        run: npm install
      - name: Build Storybook
        run: npm run build-storybook
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./storybook-static
```

On every push to `main`, this workflow builds Storybook and pushes the output to a `gh-pages` branch. GitHub Pages serves that branch as a public URL:

```
https://<your-org>.github.io/<repo-name>/
```

To enable it: go to **Settings → Pages → Branch** and select `gh-pages`.

> ⚠️ **Private repository restriction:** GitHub Pages for private repositories requires a **GitHub Pro, Team, or Enterprise** plan (~$48/year for Pro). On a free plan, enabling Pages on a private repo is not available. If your repo is private and you're on the free tier, use one of the alternatives below.

---

### Option 2 — Vercel *(Recommended free alternative)*

Vercel is the simplest free option. It detects your repo automatically, runs the build, and gives you a URL.

**Setup:**

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New Project** → import your repository
3. Set the build settings:
   - **Build command:** `npm run build-storybook`
   - **Output directory:** `storybook-static`
4. Deploy

Vercel redeploys automatically on every push to `main`. You get a stable URL like `https://your-project.vercel.app`.

**Free tier includes:**
- Unlimited personal projects
- Works with private GitHub repositories
- Automatic deploys on push
- Preview URLs per branch/PR

---

### Option 3 — Netlify

Very similar to Vercel. Also free, also works with private repos.

**Setup:**

1. Go to [netlify.com](https://netlify.com) and sign in with GitHub
2. Click **Add new site → Import an existing project**
3. Set build settings:
   - **Build command:** `npm run build-storybook`
   - **Publish directory:** `storybook-static`
4. Deploy

You get a URL like `https://your-project.netlify.app`.

---

### Option 4 — Chromatic

[Chromatic](https://www.chromatic.com) is built specifically for Storybook by the Storybook maintainers. Beyond just hosting, it adds visual regression testing — it takes screenshots of your stories and flags visual differences between commits.

**Free tier includes:** 5,000 snapshots/month — enough for a small to medium library.

```bash
npm install --save-dev chromatic
npx chromatic --project-token=<your-token>
```

Add to CI for automatic deploys and visual diff reports on every PR.

---

## Comparison

| | GitHub Pages | Vercel | Netlify | Chromatic |
|---|:---:|:---:|:---:|:---:|
| Free for private repos | ❌ (paid plan) | ✅ | ✅ | ✅ |
| Auto-deploy on push | ✅ (via Actions) | ✅ | ✅ | ✅ |
| Preview URLs per PR | ❌ | ✅ | ✅ | ✅ |
| Visual regression testing | ❌ | ❌ | ❌ | ✅ |
| Storybook-specific features | ❌ | ❌ | ❌ | ✅ |
| Setup complexity | Medium | Low | Low | Low |

---

## Recommendation

- **Free + private repo** → use **Vercel** or **Netlify**. Both take under 5 minutes to set up and require zero configuration changes to the project.
- **Already paying for GitHub Pro/Team** → stick with **GitHub Pages** — the workflow is already in the repo and needs no extra accounts.
- **Want visual diff testing** → add **Chromatic** on top of whichever host you choose.
