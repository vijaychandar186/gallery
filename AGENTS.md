# AGENTS.md - AI Coding Agent Reference

This file provides essential information for AI coding agents working on this project.

---

## Project Overview

**nextjs-prettier-husky-bun-docker-starter** is a minimal, production-ready Next.js starter template built with:

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **Package Manager**: pnpm
- **Containerization**: Docker (standalone output), devcontainer for development

---

## Technology Stack

- Next.js 15 with App Router, `output: 'standalone'`
- React 19
- TypeScript with strict mode
- Tailwind CSS v4 (`@import 'tailwindcss'` syntax, `@tailwindcss/postcss`)
- Geist Sans + Geist Mono (next/font/google)
- ESLint 9 with Next.js config
- Prettier 3 with `prettier-plugin-tailwindcss`
- Husky + lint-staged for pre-commit formatting

---

## Project Structure

```
src/
└── app/
    ├── layout.tsx      # Root layout with Geist fonts
    ├── page.tsx        # Home page
    ├── globals.css     # Global styles + Tailwind imports
    └── favicon.ico
```

---

## Commands

```bash
pnpm install        # Install dependencies
pnpm dev            # Dev server at http://localhost:3000 (Turbopack)
pnpm build          # Production build
pnpm start          # Start production server
pnpm lint           # ESLint
pnpm lint:fix       # Fix ESLint + format
pnpm format         # Prettier
pnpm format:check   # Check formatting
```

---

## Code Style

- Single quotes, JSX single quotes, no trailing comma, 2-space indent
- `@/*` path alias maps to `src/*`
- Tailwind CSS v4 syntax: use `@import 'tailwindcss'` in CSS, not `@tailwind` directives
- Server components by default — add `'use client'` only when needed
- Use `cn()` utility for className merging when added

---

## Notes for AI Agents

1. This is a starter template — add features incrementally, don't assume libraries are installed
2. Check `package.json` before importing any package
3. Server components by default; `'use client'` only for hooks/browser APIs
4. Strict TypeScript — avoid `any`
5. Follow existing Prettier config exactly (enforced via pre-commit hook)
