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
