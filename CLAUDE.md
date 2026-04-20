# CLAUDE.md

This is a minimal Next.js 15 + TypeScript + Tailwind CSS v4 starter template.

## Key References

- **[AGENTS.md](./AGENTS.md)** — Full project overview, tech stack, structure, commands

## Critical Conventions

- **Formatting** — single quotes, JSX single quotes, no trailing comma, 2-space indent (enforced by Prettier + Husky)
- **Imports** — use `@/*` alias for `src/*` imports
- **Tailwind** — v4 syntax: `@import 'tailwindcss'` in CSS, `@tailwindcss/postcss` in PostCSS
- **Components** — server components by default, `'use client'` only when using hooks or browser APIs
- **TypeScript** — strict mode, avoid `any`
