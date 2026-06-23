# FoodMood AI Database

## Recommended Database

Use Supabase Postgres for the next business-ready phase.

Why this choice:

- It is real Postgres, so the SQL seed remains portable to Neon or another Postgres provider later.
- It includes a SQL editor for direct queries, which is useful while validating restaurant data.
- It can support auth, storage, row-level security, and admin tooling later without adding a separate backend too early.
- The app still works without database credentials because it falls back to local mock data.

## Files

- `restaurants_seed.sql`: base schema and initial hand-curated restaurants.
- `restaurants_serpapi_merged.csv`: deduplicated review CSV from the raw SerpApi files.
- `restaurants_selected_for_mvp.csv`: 156 restaurants selected for MVP review.
- `restaurants_selected_seed.sql`: incremental SQL seed for the selected CSV plus the `foodmood_restaurants_app` view used by the app.

## Setup Order

1. Create a Supabase project.
2. Open Supabase SQL Editor.
3. Run `restaurants_seed.sql`.
4. Run `restaurants_selected_seed.sql`.
5. Copy the project URL and anon key into Vercel environment variables:

```bash
SUPABASE_URL=
SUPABASE_ANON_KEY=
```

After those env vars exist, `/api/restaurants` reads from `foodmood_restaurants_app`. Without them, it returns local mock restaurants.

## Useful Queries

```sql
select count(*) from restaurantes where activo = true;
select * from foodmood_restaurants_app order by rating desc nulls last limit 25;
select c.nombre, count(*)
from categorias c
join restaurante_categorias rc on rc.categoria_id = c.id
group by c.nombre
order by count(*) desc;
```
