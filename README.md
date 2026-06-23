# FoodMood AI

FoodMood AI is a mobile-first restaurant recommendation MVP built with Next.js App Router, TypeScript, Tailwind CSS, and PNPM.

The MVP includes demo login, onboarding, natural-language search, recommendations, favorites, profile, local fallback data, and a database-ready restaurant layer.

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

Copy `.env.example` to `.env.local` when you want integrations. Supabase and OpenAI keys are not required for the MVP to run.

When `SUPABASE_URL` and `SUPABASE_ANON_KEY` are configured, `/api/restaurants` reads from the Supabase Postgres view `foodmood_restaurants_app`. Without them, the app falls back to `lib/data/restaurants.ts`.

Google login uses Supabase Auth. Configure `NEXT_PUBLIC_SUPABASE_URL` for the browser redirect and keep `SUPABASE_ANON_KEY` available server-side so `/api/auth/session` can validate the token. Add admin emails in `FOODMOOD_ADMIN_EMAILS`, separated by commas.

The 2 km, 5 km, and 10 km filters use the browser Geolocation API when the user taps "Usar mi ubicacion". Restaurants without valid latitude/longitude keep their database fallback distance.

Database setup notes live in `database/README.md`.
