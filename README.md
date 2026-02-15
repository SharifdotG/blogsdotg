# BlogsdotG

A minimal, beautiful personal blog platform with a hidden single-admin CMS.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![Convex](https://img.shields.io/badge/Convex-Backend-FF6F61?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38BDF8?style=flat-square&logo=tailwindcss)

## What this project includes

- Public blog pages: home, blogs, blog detail, tags, about
- Hidden admin area (`/admin/*`) with 404 behavior for unauthenticated access
- One-time admin bootstrap flow (`/admin/bootstrap?token=...`)
- Post CRUD (draft/publish), featured posts, tags, views, site settings
- Tiptap editor with rich formatting + code blocks
- Catppuccin themes (Mocha dark / Latte light)
- Convex backend (schema, queries, mutations, auth)

## Tech Stack

| Technology | Purpose |
| --- | --- |
| [Next.js 16.1.6](https://nextjs.org) | App Router frontend |
| [React 19](https://react.dev) | UI runtime |
| [Convex](https://convex.dev) | Database + backend functions |
| [Convex Auth](https://labs.convex.dev/auth) | Password auth (single admin) |
| [Tailwind CSS v4](https://tailwindcss.com) | Styling |
| [shadcn/ui](https://ui.shadcn.com) | UI primitives |
| [Framer Motion](https://motion.dev) | Animations |
| [Tiptap](https://tiptap.dev) | Rich text editor |

## Prerequisites

- Node.js **20.9+**
- npm
- Convex account

## Quick Start (Local)

1) **Clone and install**

```bash
git clone https://github.com/SharifdotG/blogsdotg.git
cd blogsdotg
npm install
```

1) **Create local env file**

```bash
cp .env.example .env.local
```

Update `.env.local` values.

1) **Generate auth keys for Convex Auth**

```bash
node generateKeys.mjs
```

Copy the printed `JWT_PRIVATE_KEY` and `JWKS` values.

1) **Set Convex environment variables**

Set these in your Convex deployment (Dashboard > Settings > Environment Variables):

- `ADMIN_EMAIL`
- `ADMIN_BOOTSTRAP_SECRET`
- `ADMIN_BOOTSTRAP_ENABLED` (set `true` for first bootstrap)
- `CONVEX_SITE_URL` (use `http://localhost:3000` for local dev)
- `JWT_PRIVATE_KEY` (from `generateKeys.mjs`)
- `JWKS` (from `generateKeys.mjs`)

1) **Run Convex and Next.js** (two terminals)

```bash
# terminal 1
npx convex dev

# terminal 2
npm run dev
```

1) **Bootstrap the admin account (first time only)**

Open:

```text
http://localhost:3000/admin/bootstrap?token=YOUR_ADMIN_BOOTSTRAP_SECRET
```

Create the admin with the same email as `ADMIN_EMAIL`.

1) **Disable bootstrap after admin is created**

Set `ADMIN_BOOTSTRAP_ENABLED=false` in both:

- `.env.local`
- Convex environment variables

Then restart dev servers.

## Environment Variables

### Next.js (`.env.local`)

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_CONVEX_URL` | Yes | Convex deployment URL used by the React client |
| `ADMIN_EMAIL` | Yes | Allowed admin email |
| `ADMIN_BOOTSTRAP_SECRET` | Yes | One-time bootstrap token |
| `ADMIN_BOOTSTRAP_ENABLED` | Yes | Enable/disable bootstrap route (`true`/`false`) |

### Convex (Dashboard / CLI)

| Variable | Required | Purpose |
| --- | --- | --- |
| `ADMIN_EMAIL` | Yes | Server-side admin authorization |
| `ADMIN_BOOTSTRAP_SECRET` | Yes (during bootstrap) | Protect sign-up bootstrap flow |
| `ADMIN_BOOTSTRAP_ENABLED` | Yes | Allow/disallow sign-up flow |
| `CONVEX_SITE_URL` | Yes | Auth domain for Convex Auth config |
| `JWT_PRIVATE_KEY` | Yes | Convex Auth JWT signing key |
| `JWKS` | Yes | Public JWK set for auth verification |

## Scripts

- `npm run dev` — start Next.js dev server
- `npm run build` — production build
- `npm run start` — run production server locally
- `npm run lint` — run ESLint

## Project Structure

```text
blogsdotg/
├── convex/                    # Convex schema, auth, queries, mutations
├── src/
│   ├── app/
│   │   ├── admin/             # Hidden admin area
│   │   ├── blogs/             # Blog list + detail pages
│   │   ├── tags/              # Tag discovery page
│   │   └── about/             # About page
│   ├── components/
│   │   ├── editor/            # Tiptap editor
│   │   ├── providers/         # Theme + Convex providers
│   │   ├── animations/        # Framer Motion wrappers
│   │   └── ui/                # shadcn/ui components
│   └── lib/                   # Constants, helpers, utilities
├── generateKeys.mjs           # JWT/JWKS key generator
└── README.md
```

## Contributing (Fork & PR workflow)

1. Fork this repository
2. Clone your fork
3. Add upstream remote

```bash
git remote add upstream https://github.com/SharifdotG/blogsdotg.git
```

1. Create a feature branch

```bash
git checkout -b feat/your-change
```

1. Make changes and validate

```bash
npm run lint
npm run build
```

1. Push and open a PR from your fork

Before opening PRs, sync with upstream:

```bash
git fetch upstream
git rebase upstream/main
```

## Community & Governance

This repository now includes dedicated GitHub community files:

- `CONTRIBUTING.md` — contribution workflow and expectations
- `CODE_OF_CONDUCT.md` — collaboration standards
- `SECURITY.md` — vulnerability reporting policy
- `LICENSE` — MIT license
- `CODEOWNERS` — default code ownership
- `.github/PULL_REQUEST_TEMPLATE.md` — standardized PR format
- `.github/ISSUE_TEMPLATE/*` — bug/feature issue templates

## Deploy to Vercel (Production)

This project uses Convex + Next.js. Recommended deployment flow follows Convex official Vercel guidance.

### 1) Import repo in Vercel

- Create a new Vercel project from this GitHub repository

### 2) Override build command

Set Build Command to:

```bash
npx convex deploy --cmd 'npm run build'
```

### 3) Add Vercel environment variables

At minimum:

- `CONVEX_DEPLOY_KEY` (Production deploy key from Convex Dashboard)
- `ADMIN_EMAIL`
- `ADMIN_BOOTSTRAP_SECRET`
- `ADMIN_BOOTSTRAP_ENABLED`

Notes:

- Keep `ADMIN_BOOTSTRAP_ENABLED=true` only until first admin is created in production.
- After bootstrap, set it to `false` and redeploy.
- If using preview deployments with Convex preview backends, configure a Preview `CONVEX_DEPLOY_KEY` as documented by Convex.

### 4) Set Convex production env vars

In your Convex **production** deployment, set:

- `ADMIN_EMAIL`
- `ADMIN_BOOTSTRAP_SECRET`
- `ADMIN_BOOTSTRAP_ENABLED`
- `CONVEX_SITE_URL` (your production URL, e.g. `https://your-domain.com`)
- `JWT_PRIVATE_KEY`
- `JWKS`

### 5) Deploy and bootstrap admin once

After first successful deploy:

1. Visit `https://your-domain.com/admin/bootstrap?token=...`
2. Create admin account
3. Disable bootstrap (`ADMIN_BOOTSTRAP_ENABLED=false`) in Vercel + Convex
4. Redeploy

## Pre-Deploy Checklist

- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] Convex production env vars are configured
- [ ] Vercel build command overridden to Convex deploy wrapper
- [ ] `CONVEX_DEPLOY_KEY` added in Vercel
- [ ] Bootstrap disabled after admin creation

## License

MIT

---

© 2026 [Sharif Md. Yousuf](https://github.com/SharifdotG). dotG for Life (≧∇≦)ﾉ
