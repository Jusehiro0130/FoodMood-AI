# FoodMood AI - Agent Instructions

## General rules

- Use PNPM only. Do not use npm or yarn for project commands.
- Use TypeScript everywhere.
- Use Next.js App Router.
- Use Tailwind CSS.
- Prioritize mobile-first design.
- Keep components reusable and clean.
- Do not work directly on main.
- Work by feature branches.
- Do not add features outside the requested phase.
- Do not connect paid APIs unless explicitly requested.
- The app must work without OpenAI API keys.
- The app must work with mock/local data during MVP.
- Avoid unnecessary complexity.
- Prioritize a functional, clean MVP.

## Project vision

FoodMood AI is a restaurant recommendation web app that understands natural language food cravings, learns user preferences, and recommends restaurants based on taste, location, budget, ambience, and history.

## Current MVP restrictions

- No promotions in this version.
- No scraping.
- No Stripe or payments.
- No real sensitive data.
- No mandatory external backend in the first phases.
- Supabase and OpenAI should be prepared for future integration, not required at the start.

## Code quality

- Use clear file names.
- Keep business logic in `/lib`.
- Keep UI components in `/components`.
- Use typed models in `/lib/types.ts`.
- Avoid duplicating localStorage logic.
- Explain changes after each task.

## Working memory

- Treat this file as the portable project memory for future Codex sessions.
- Whenever meaningful changes are made, update this section before finishing the task.
- Keep the latest branch, PR, deployment status, important decisions, and known blockers here.
- Do not store secrets, API keys, private tokens, or sensitive user data here.

### Current status

- Active branch: `main`.
- Preview comparison branch: `preview/supabase-data-demo`.
- Latest Supabase data preview URL: `https://food-mood-ibjz1z1k9-jusehiro0130-7374s-projects.vercel.app`.
- Latest data foundation commit before this memory update: `1259d80 Update memory for data foundation preview`.
- Latest Vercel preview status for `feature/data-foundation`: `READY`.
- Latest Vercel preview URL: `https://food-mood-ow6hanoin-jusehiro0130-7374s-projects.vercel.app`.
- Feature branch `feature/ui-polish` was merged into `main`.
- Latest main merge commit before this memory update: `a100c1c Merge feature/ui-polish into main`.
- Latest Vercel production deploy status: `READY` for commit `1cabccf Update memory after main merge`.
- Production URL: `https://food-mood-ai.vercel.app`.
- Latest main merge commit before this memory update: `b2d710c Merge auth location admin into main`.
- Latest Vercel production deploy status: `READY` for commit `b2d710c4912857f360d75a1f2f0f8f9eeaaf584c`.
- Latest production deployment URL: `https://food-mood-6h34ztsem-jusehiro0130-7374s-projects.vercel.app`.
- Latest production deploy status: `READY` for commit `6593987 Replace Google auth with email signup`.

### Recent work

- Fixed Vercel build failures caused by unsupported `lucide-react` icons (`Chrome`, `Instagram`).
- Fixed TypeScript readonly array issues in `lib/data/restaurants.ts`.
- Improved the mobile-first UI for home, restaurant cards, restaurant detail, and login.
- Added light/dark theme support with `components/theme-toggle.tsx`.
- Theme preference is stored in `localStorage` under `foodmood.theme`.
- Added CSS design tokens and safe-area handling to make the web app easier to port toward PWA/iOS later.
- Created canonical SQL seed at `database/restaurants_seed.sql` by combining the original Panama restaurant seed with the salchipapas seed.
- Replaced mock restaurant data in `lib/data/restaurants.ts` with 24 restaurants based on the combined seed, including `Iconos Urban Food`, `Fogata Familiar`, and `Asu Mare`.
- Added `website` to the `Restaurant` type and normalized recommendation matching so accents in categories do not break search matches.
- Created review CSV `database/restaurants_serpapi_merged.csv` from `restaurantes_serpapi.csv` and `restaurantes_serpapi_v2.csv`; it deduplicates 239 source rows into 175 restaurants and removes phone, image, and Google ID columns for safer review.
- Tracked the raw SerpApi source CSV files in Git so the review dataset can be audited and regenerated later.
- Started data foundation phase on `feature/data-foundation`.
- Chose Supabase Postgres for the first real database path because it keeps data in portable Postgres, provides a SQL editor, and leaves room for auth/storage/admin workflows later.
- Added selected MVP data files: `database/restaurants_selected_for_mvp.csv` and `database/restaurants_selected_seed.sql`.
- Added `/api/restaurants`, which reads Supabase REST view `foodmood_restaurants_app` when `SUPABASE_URL` and `SUPABASE_ANON_KEY` exist, otherwise returns local mock restaurants.
- Added `/admin/restaurants` as a read-only internal review screen for restaurant data.
- Connected Supabase project `foodai` (`wszrwmhjfllsazxmfjpl`) and created the FoodMood restaurant schema there.
- Loaded Supabase with 10 categories, 156 restaurants, and 156 restaurant-category relations.
- Hardened Supabase read access: RLS is enabled, read-only policies exist for `anon`/`authenticated`, and `foodmood_restaurants_app` uses `security_invoker = true`.
- Supabase security advisors currently return no lints after the database setup.
- Created `preview/supabase-data-demo` from the data foundation branch so Vercel can build a separate preview focused on the move from dummy/local restaurant data to Supabase-backed restaurant data.
- Redeployed `preview/supabase-data-demo` after Vercel env vars were configured; `/api/restaurants` now returns `source: "supabase"` on the preview deployment.
- Started auth/location/admin phase on `feature/auth-location-admin`.
- Added live browser geolocation so 2 km, 5 km, and 10 km restaurant filters can use real user distance when permission is granted.
- Replaced Google Auth plan with Supabase email/password auth because Google Cloud OAuth credentials were not available.
- Added `/api/auth/session` to validate Supabase access tokens server-side and assign `admin` from private comma-separated `FOODMOOD_ADMIN_EMAILS`.
- Added admin visibility in profile and a client-side admin gate for `/admin/restaurants`.
- Restyled restaurant cards to the compact dark "Concepto B - etiqueta colgante" pattern requested by the user: orange circular food icon, lowercase restaurant title, match percentage, and compact distance/price/rating row.
- Removed the demo login button so email/password auth is the primary entry path.
- Added Supabase table `foodmood_users` through migration `create_foodmood_users_auth`; authenticated users are remembered there after login.
- `foodmood_users` has RLS enabled and protects `role` from user self-escalation; admin can be assigned by SQL role update or by `FOODMOOD_ADMIN_EMAILS`.
- Added `/register`, `/api/auth/signup`, and `/api/auth/password` for first name, last name, username, email, password signup and email activation.
- Applied Supabase migration `foodmood_users_email_auth_update` to add first name, last name, username, and email provider defaults to `foodmood_users`.
- Email activation links must use production URL settings in Supabase: Site URL `https://food-mood-ai.vercel.app` and redirect `https://food-mood-ai.vercel.app/auth/callback`. Added `APP_URL` support in signup to avoid localhost links in production.
- Added guest access from `/login`. Guest sessions use `provider: "guest"`, can browse recommendations without email activation, and must not persist preferences, onboarding, search history, favorites, range, or Supabase user records.
- Added `/api/auth/resend-confirmation` and a resend button on `/register` so users can request a new Supabase signup confirmation email when the original email is missing or expired.
- Because Supabase's default confirmation email may not arrive reliably, `/api/auth/signup` now prefers the server-only `SUPABASE_SERVICE_ROLE_KEY` path when configured: it creates confirmed users through Supabase Admin API, then immediately creates an email/password session and sends the user to onboarding. If the service role key is missing, it falls back to email confirmation.

### Current data model

- Supabase project `foodai` is provisioned and loaded. API URL: `https://wszrwmhjfllsazxmfjpl.supabase.co`.
- Restaurant data falls back to mock/local in `lib/data/restaurants.ts`; when Supabase env vars exist in Vercel/local, `/api/restaurants` reads `foodmood_restaurants_app`.
- Vercel still needs Supabase environment variables configured for deployed builds: `SUPABASE_URL` and `SUPABASE_ANON_KEY` (or the `NEXT_PUBLIC_` aliases already supported by the app).
- SerpApi source CSV files are tracked at the repo root; the safer deduplicated review file is `database/restaurants_serpapi_merged.csv`.
- The selected MVP restaurant import contains 156 restaurants in `database/restaurants_selected_for_mvp.csv`.
- User/session/preference/favorites/history data is stored in browser `localStorage` through `lib/storage.ts`.
- Email-authenticated app sessions are also stored in `localStorage`; admin role is assigned by `/api/auth/session`, not by editable user metadata.
- Guest sessions are local-only and intentionally non-persistent for user preferences/history/favorites; they are not written to Supabase.
- Persistent user records live in Supabase `public.foodmood_users` with columns for email, name, first name, last name, username, avatar, provider, role, and last login.
- `SUPABASE_SERVICE_ROLE_KEY` must remain server-only. It is used by signup/session endpoints to create confirmed users and upsert `foodmood_users`, never by client components.
- Shared data types live in `lib/types.ts`.

### Local environment notes

- Local `pnpm` is not on PATH, but `corepack pnpm` is available.
- `corepack pnpm typecheck` and dependency installs can hang in this Windows environment; `npx` is blocked by PowerShell policy or network failures.
- Vercel remote builds are being used as the current validation path.
