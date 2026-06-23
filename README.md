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

Google login uses Supabase Auth. Configure `SUPABASE_URL` server-side for the login redirect and keep `SUPABASE_ANON_KEY` available server-side so `/api/auth/session` can validate the token. `NEXT_PUBLIC_SUPABASE_URL` is optional because `/api/auth/config` exposes only the safe public Supabase URL to the login screen. Users are remembered in the Supabase table `foodmood_users` after login.

Admin users can be created in either of two ways:

```sql
update public.foodmood_users
set role = 'admin'
where lower(email) = lower('admin@example.com');
```

Or add admin emails in `FOODMOOD_ADMIN_EMAILS`, separated by commas. If `SUPABASE_SERVICE_ROLE_KEY` is configured server-side, those admin roles are also persisted to `foodmood_users`.

The 2 km, 5 km, and 10 km filters use the browser Geolocation API when the user taps "Usar mi ubicacion". Restaurants without valid latitude/longitude keep their database fallback distance.

Database setup notes live in `database/README.md`.
