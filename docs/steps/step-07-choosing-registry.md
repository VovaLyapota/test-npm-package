# Step 7 — Choosing a Registry

## Overview

Before publishing your library, you need to decide **where it lives**. A registry is the server your package is pushed to and pulled from. There are three realistic options for a private component library: **GitHub Packages**, **npm**, and **Verdaccio**.

---

## The Three Registries

### GitHub Packages

GitHub's built-in package registry. Packages are scoped to a GitHub user or organization and live alongside the source repository.

- Access is controlled via GitHub permissions — whoever has read access to the repo can install the package
- Authentication uses a GitHub Personal Access Token (PAT)
- The registry URL is `https://npm.pkg.github.com`
- Scoped packages only — your package name must be `@your-github-org/package-name`
- **Included in all GitHub plans, including the free tier** — storage and data transfer limits apply but are generous enough for small teams

**When it costs money:**

- GitHub Free: **$0** — covers the registry itself; consumers just need a GitHub account with repo access and a PAT
- GitHub Team: **$4/month per user** — adds org management, branch protection, required reviews; private packages included
- GitHub Enterprise: **$21/month per user**

> The registry itself is free. You only start paying when you need GitHub Team/Enterprise features for other reasons (org management, SSO, audit logs, etc.).

---

### npm (npmjs.com)

The default public registry — also supports private packages via paid plans.

- No GitHub dependency — works with any Git host or CI provider
- Authentication via npm access tokens
- Wider ecosystem tooling support (most tutorials and tools assume npm registry by default)
- Private packages require an **npm paid plan** regardless of team size

**Pricing (private packages):**

- npm Pro: **$7/month per user**
- npm Teams: **$7/month per user** (minimum ~$14/month for 2 seats)
- npm Enterprise: custom pricing

> npm charges per user accessing private packages, on top of any GitHub costs. If your team is already on GitHub Team, using npm means paying twice.

---

### Verdaccio

An open-source, self-hosted npm registry proxy. You run it on your own infrastructure — but "infrastructure" doesn't have to mean a paid server. Free hosting platforms can run it at zero cost.

- **No per-user licensing cost** — you own the server
- Acts as a proxy — can cache public npm packages locally and host private ones
- Full control over access, storage, and uptime
- Can run for free on platforms like **Railway, Render, or Fly.io** for small teams

**Pricing:**

- Software: **free** (open source)
- Infrastructure on free tiers (Railway, Render, Fly.io): **$0/month** for low-traffic use
- Infrastructure on paid small instances (if you outgrow free tiers): **~$5–15/month**
- Operational overhead: someone needs to configure and occasionally maintain it

> Free platform tiers typically have cold-start delays and limited persistent storage. For a team of ≤ 20 people with infrequent publishes, this is usually fine. For larger teams or high-frequency CI installs, a small paid instance is more reliable.

---

## Comparison Table

|                       | GitHub Packages                   | npm           | Verdaccio                      |
| --------------------- | --------------------------------- | ------------- | ------------------------------ |
| Hosting               | GitHub-managed                    | npm-managed   | Self-hosted (or free platform) |
| Private packages      | Free (included in all plans)      | Paid add-on   | Free (infra cost only)         |
| Per-user cost         | $0 (or $4–21 for Team/Enterprise) | $7/month/user | $0/user                        |
| Fixed infra cost      | $0                                | $0            | $0–15/month                    |
| Auth method           | GitHub PAT                        | npm token     | Custom (htpasswd, token, LDAP) |
| Setup complexity      | Low                               | Low           | Medium                         |
| Maintenance burden    | None                              | None          | Low–Medium                     |
| Works without GitHub  | ❌                                | ✅            | ✅                             |
| Proxy public packages | ❌                                | ❌            | ✅                             |
| Access control        | GitHub repo permissions           | npm org teams | Fully custom                   |

---

## Which Registry for Which Team Size?

### ≤ 10 people — GitHub Packages

At this scale, GitHub Packages is effectively free. The registry is included in all GitHub plans — consumers just need a GitHub account with access to your repo and a Personal Access Token.

Setup is minimal: one `.npmrc` file, one PAT per developer, and the `publishConfig` in `package.json` already covered in Step 2. Authentication is the same GitHub account developers already use daily.

**→ The next step covers GitHub Packages setup in full. This is the recommended starting point.**

---

### 11–20 people — npm or GitHub Team

At this scale the team is likely big enough to want org-level features: branch protection rules, required reviews, team management. GitHub Team ($4/user/month) covers all of that and includes private packages at no extra cost.

> ⚠️ GitHub Team pricing applies to **all seats in the org**, not just the ones above 10. Upgrading from the free plan to Team means paying $4/month × every member — so going from 10 to 11 people costs $44/month, not $4/month. It's a cliff, not a gradual increase.

- **GitHub Team ($4/user/month for all seats):** best if you need org management features anyway — packages come free with the plan.
- **npm ($7/user/month):** only makes sense if your team doesn't use GitHub for source control and needs registry-only access.

The tipping point is whether the team already pays for GitHub Team seats — if yes, switching the registry to npm would be paying twice for the same thing.

---

### > 20 people — Verdaccio or Enterprise

Above ~20 users, per-seat registry costs add up fast:

- 25 users × $7/month (npm) = **$175/month / $2,100/year**
- 25 users × $4/month (GitHub Team) = **$100/month / $1,200/year**
- Verdaccio on a free platform tier = **$0–15/month** flat, regardless of team size

At this scale, Verdaccio's fixed infrastructure cost almost always wins — especially since it can run for free on platforms like Railway or Render for small-to-medium install volumes. It also gives you a package proxy, which speeds up CI installs by caching public npm packages locally.

GitHub Enterprise ($21/user/month) is the right choice only if you need the full Enterprise feature set (SAML SSO, audit logs, advanced security) for reasons unrelated to the package registry.

---

## Cost at a Glance

| Team size   | GitHub Packages            | npm            | Verdaccio (free tier) |
| ----------- | -------------------------- | -------------- | --------------------- |
| ≤ 10 users  | **$0**                     | ~$70/month     | $0–15/month           |
| 11–20 users | ~$44–80/month (all seats on Team plan) | ~$77–140/month | $0–15/month |
| > 20 users  | $80+/month                 | $140+/month    | $0–15/month           |

> GitHub Packages column reflects: free plan for ≤10 users; GitHub Team pricing ($4/user/month) for larger teams where org management features become necessary. Verdaccio assumes a free-tier hosting platform (Railway, Render, Fly.io).

---

## Summary

For a small private team getting started: **use GitHub Packages**. It's free, zero-infrastructure, and requires no extra accounts beyond what the team already has. The next step covers the full setup.

When the team grows past ~20 people or the per-seat cost of GitHub Team becomes significant, revisit Verdaccio. The migration is straightforward — consumers just point their `.npmrc` at a different registry URL.
