# FoodMood AI

FoodMood AI is a mobile-first restaurant recommendation MVP built with Next.js App Router, TypeScript, Tailwind CSS, and PNPM.

This first phase only includes the project setup and a minimal initial screen. Authentication, onboarding, restaurant data, natural-language search, favorites, and profile flows will be added in separate feature branches.

## Requirements

- Node.js 22+
- PNPM 10+

## Getting Started

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Useful Commands

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## Environment Variables

Copy `.env.example` to `.env.local` when a future phase needs integrations. Supabase and OpenAI keys are not required for this setup phase.
