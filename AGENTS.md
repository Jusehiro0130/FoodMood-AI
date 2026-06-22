# FoodMood AI — Agent Instructions

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

- Active branch: `feature/ui-polish`.
- Open PR: `https://github.com/Jusehiro0130/FoodMood-AI/pull/4`.
- Latest pushed commit before this memory update: `a71b572 Add dark theme and mobile app polish`.
- Latest Vercel preview status: `READY`.
- Latest preview URL: `https://food-mood-qode7y1hq-jusehiro0130-7374s-projects.vercel.app`.
- Production URL `https://food-mood-ai.vercel.app` can show `DEPLOYMENT_NOT_FOUND` until the PR is merged to `main` and production deploys successfully.

### Recent work

- Fixed Vercel build failures caused by unsupported `lucide-react` icons (`Chrome`, `Instagram`).
- Fixed TypeScript readonly array issues in `lib/data/restaurants.ts`.
- Improved the mobile-first UI for home, restaurant cards, restaurant detail, and login.
- Added light/dark theme support with `components/theme-toggle.tsx`.
- Theme preference is stored in `localStorage` under `foodmood.theme`.
- Added CSS design tokens and safe-area handling to make the web app easier to port toward PWA/iOS later.

### Current data model

- There is no real SQL database connected yet.
- Restaurant data is mock/local in `lib/data/restaurants.ts`.
- User/session/preference/favorites/history data is stored in browser `localStorage` through `lib/storage.ts`.
- Shared data types live in `lib/types.ts`.

### Local environment notes

- Local `pnpm` is still not available in the current Windows terminal, so local `pnpm build` could not be run.
- Vercel remote builds are being used as the current validation path.
