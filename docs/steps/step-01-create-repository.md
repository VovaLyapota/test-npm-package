# Step 1 — Create a GitHub Repository

## Overview

The first step to building a private component library is creating a **private GitHub repository**. This will be the home for your library's source code, versioning, and publishing pipeline.

---

## Creating the Repository

1. Go to [github.com](https://github.com) and click **New repository**.
2. Set the visibility to **Private** — this ensures your library is not publicly accessible.
3. Choose any name you like for the repository (e.g., `my-component-library`, `ui-kit`, `test-npm-package`).

> **Does the repository name matter?**  
> Not really. The repository name is just a GitHub identifier. The actual **npm package name** (the one consumers install) is defined separately in `package.json` under the `"name"` field and can differ from the repository name entirely. You'll configure that in a later step.

---

## Setting Up `.gitignore`

When creating the repository, GitHub offers an option to **initialize it with a `.gitignore` file**. It is strongly recommended to do this upfront rather than adding it manually later.

- In the **Add .gitignore** dropdown, select the **Node** template.
- This template comes preconfigured to ignore `node_modules/`, build output folders, environment files, and other common Node.js artifacts — everything you don't want committed to version control.

---

## Summary

| Decision | Recommendation |
|---|---|
| Repository visibility | **Private** |
| Repository name | Any name — it doesn't affect the npm package name |
| `.gitignore` template | **Node** (select during repo creation) |
