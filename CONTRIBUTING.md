# Contributing to BlogsdotG

Thanks for your interest in contributing.

## Development setup

1. Fork and clone the repository.
2. Install dependencies:

```bash
npm install
```

1. Copy environment template:

```bash
cp .env.example .env.local
```

1. Start Convex and Next.js (two terminals):

```bash
npx convex dev
npm run dev
```

For full setup details (including auth keys and bootstrap), see `README.md`.

## Branch naming

Use short, clear branch names:

- `feat/<name>`
- `fix/<name>`
- `docs/<name>`
- `chore/<name>`

Examples:

- `feat/admin-post-filters`
- `fix/tags-page-loading`
- `docs/readme-deploy-guide`

## Coding expectations

- Keep changes focused and minimal.
- Follow existing TypeScript/Next.js/Tailwind patterns.
- Use Convex functions for all data access.
- Do not expose admin routes in public UI.
- Never commit secrets or `.env` files.

## Before opening a pull request

Run:

```bash
npm run lint
npm run build
```

Make sure both pass.

## Pull request checklist

- [ ] PR has a clear title and description
- [ ] Related issue is linked (if any)
- [ ] Lint/build pass locally
- [ ] No secrets added
- [ ] Documentation updated if behavior/setup changed

## Commit style (recommended)

Conventional-style messages are encouraged:

- `feat: add tag filter to blogs page`
- `fix: handle admin bootstrap token mismatch`
- `docs: improve local setup guide`

## Need help?

Open a discussion/issue with context and reproduction steps, and we can iterate quickly.
