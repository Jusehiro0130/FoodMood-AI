"use client";

import { Database, Filter, Search, Star } from "lucide-react";
import { useMemo, useState } from "react";
import type { Restaurant, RestaurantDataSource } from "@/lib/types";

type AdminRestaurantsClientProps = {
  restaurants: Restaurant[];
  source: RestaurantDataSource;
};

export function AdminRestaurantsClient({ restaurants, source }: AdminRestaurantsClientProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");

  const categories = useMemo(() => {
    const values = new Set<string>();
    restaurants.forEach((restaurant) => restaurant.categories.forEach((item) => values.add(item)));
    return ["Todas", ...Array.from(values).sort((a, b) => a.localeCompare(b))];
  }, [restaurants]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return restaurants.filter((restaurant) => {
      const matchesCategory = category === "Todas" || restaurant.categories.includes(category);
      const matchesQuery =
        !normalizedQuery ||
        restaurant.name.toLowerCase().includes(normalizedQuery) ||
        restaurant.zone.toLowerCase().includes(normalizedQuery) ||
        restaurant.address.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [category, query, restaurants]);

  const averageRating = restaurants.length ? restaurants.reduce((total, item) => total + item.rating, 0) / restaurants.length : 0;

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-5 sm:px-6 lg:py-8">
      <header className="flex flex-col gap-4 border-b border-[var(--border)] pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-black text-[var(--muted)]">
            <Database size={17} />
            Admin interno
          </p>
          <h1 className="mt-1 text-3xl font-black leading-tight">Restaurantes</h1>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-black text-[var(--muted-strong)]">
          <Metric label="Fuente" value={source === "supabase" ? "BD" : "Mock"} />
          <Metric label="Total" value={`${restaurants.length}`} />
          <Metric label="Rating" value={averageRating.toFixed(1)} />
        </div>
      </header>

      <section className="grid gap-3 rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-raised)] p-3 shadow-sm md:grid-cols-[1fr_auto]">
        <label className="flex min-h-12 items-center gap-2 rounded-2xl bg-[var(--surface-muted)] px-3">
          <Search className="text-[var(--muted)]" size={18} />
          <input
            className="min-w-0 flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-[var(--muted)]"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nombre, zona o direccion"
            value={query}
          />
        </label>
        <label className="flex min-h-12 items-center gap-2 rounded-2xl bg-[var(--surface-muted)] px-3">
          <Filter className="text-[var(--muted)]" size={18} />
          <select className="min-w-44 bg-transparent text-sm font-black outline-none" onChange={(event) => setCategory(event.target.value)} value={category}>
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </section>

      <section className="overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-raised)] shadow-sm">
        <div className="grid grid-cols-[1fr_auto] gap-3 border-b border-[var(--border)] px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-[var(--muted)]">
          <span>{filtered.length} visibles</span>
          <span>{category}</span>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {filtered.slice(0, 80).map((restaurant) => (
            <article className="grid gap-3 px-4 py-4 md:grid-cols-[1.2fr_1fr_auto]" key={restaurant.id}>
              <div>
                <h2 className="text-base font-black">{restaurant.name}</h2>
                <p className="mt-1 text-sm font-semibold text-[var(--muted)]">{restaurant.address}</p>
              </div>
              <div className="flex flex-wrap items-start gap-2">
                {restaurant.categories.slice(0, 3).map((item) => (
                  <span className="rounded-full bg-[var(--surface-muted)] px-3 py-1 text-xs font-black text-[var(--muted-strong)]" key={item}>
                    {item}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm font-black text-[var(--brand)]">
                <Star fill="currentColor" size={16} />
                {restaurant.rating.toFixed(1)}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[var(--surface-raised)] px-3 py-2 shadow-sm">
      <p className="text-[0.65rem] uppercase tracking-[0.12em] text-[var(--muted)]">{label}</p>
      <p className="text-sm text-[var(--foreground)]">{value}</p>
    </div>
  );
}

