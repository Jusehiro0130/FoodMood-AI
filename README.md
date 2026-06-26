# FoodMood AI

FoodMood AI is a mobile-first restaurant recommendation MVP built with Next.js App Router, TypeScript, Tailwind CSS, and PNPM.

The MVP includes email registration/login, onboarding, natural-language search, recommendations, favorites, profile, local fallback data, and a database-ready restaurant layer.

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

Email/password login uses Supabase Auth. Configure `SUPABASE_URL` and `SUPABASE_ANON_KEY` server-side so `/api/auth/signup`, `/api/auth/password`, and `/api/auth/session` can create accounts, validate tokens, and remember users in `foodmood_users`.

For the current MVP, configure server-only `SUPABASE_SERVICE_ROLE_KEY` in Vercel. When this key exists, `/api/auth/signup` creates users through the Supabase Admin API with `email_confirm: true` and immediately starts a session, avoiding blocked signups when Supabase's default confirmation email is delayed or not delivered. Never expose this key as a `NEXT_PUBLIC_` variable.

If `SUPABASE_SERVICE_ROLE_KEY` is not configured, the signup form falls back to Supabase's normal email confirmation flow. In that mode, Supabase email confirmation should be enabled for account activation. The app signup form collects first name, last name, username, email, and password, then tells the user to activate the account from their email before logging in.

For production email activation, set `APP_URL=https://food-mood-ai.vercel.app` in Vercel and configure Supabase Auth URL settings:

- Site URL: `https://food-mood-ai.vercel.app`
- Redirect URL: `https://food-mood-ai.vercel.app/auth/callback`

Admin users can be created in either of two ways:

```sql
update public.foodmood_users
set role = 'admin'
where lower(email) = lower('admin@example.com');
```

Or add admin emails in `FOODMOOD_ADMIN_EMAILS`, separated by commas. If `SUPABASE_SERVICE_ROLE_KEY` is configured server-side, those admin roles are also persisted to `foodmood_users`.

The 2 km, 5 km, and 10 km filters use the browser Geolocation API when the user taps "Usar mi ubicacion". Restaurants without valid latitude/longitude keep their database fallback distance.

Database setup notes live in `database/README.md`.
