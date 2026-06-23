"use client";

import { MapPin, Sparkles, Utensils } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { BottomNav } from "@/components/bottom-nav";
import { PreferenceChip } from "@/components/preference-chip";
import { RangeSelector } from "@/components/range-selector";
import { RestaurantCard } from "@/components/restaurant-card";
import { SearchBox } from "@/components/search-box";
import { parseFoodIntent } from "@/lib/ai/parse-food-intent";
import { withLiveRestaurantDistances } from "@/lib/location";
import { rankRestaurants } from "@/lib/ranking";
import { defaultProfile, storage } from "@/lib/storage";
import { useLiveLocation } from "@/lib/use-live-location";
import { getRecurringUserPreferences } from "@/lib/user-preferences";
import { useRestaurants } from "@/lib/use-restaurants";
import type { SearchHistoryItem, SearchRange, UserProfile } from "@/lib/types";

const quickChips = ["No se que comer", "Salchipapa barata cerca", "Italiana para una cita", "Algo rapido y economico", "Hamburguesa grande cerca"];

export default function Home() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [range, setRange] = useState<SearchRange>("5km");
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [ready, setReady] = useState(false);
  const { restaurants } = useRestaurants();
  const liveLocation = useLiveLocation();

  useEffect(() => {
    if (!storage.getSession()) { router.replace("/login"); return; }
    if (!storage.isOnboardingCompleted()) { router.replace("/onboarding"); return; }
    setProfile(storage.getProfile() ?? defaultProfile);
    setRange(storage.getRange());
    setHistory(storage.getSearchHistory());
    setReady(true);
  }, [router]);

  const restaurantsWithDistance = useMemo(() => withLiveRestaurantDistances(restaurants, liveLocation.location), [restaurants, liveLocation.location]);
  const ranked = useMemo(() => rankRestaurants(restaurantsWithDistance, profile, null, range, history), [restaurantsWithDistance, profile, range, history]);
  const recurring = useMemo(() => getRecurringUserPreferences(history), [history]);
  const recurringIntent = useMemo(() => recurring.categories.length || recurring.ambience.length || recurring.budget ? { query: "Tus antojos frecuentes", categories: recurring.categories, mood: recurring.ambience, budget: recurring.budget, distancePreference: "anywhere" as const, keywords: [...recurring.categories, ...recurring.ambience] } : parseFoodIntent("salchipapa barata cerca"), [recurring]);
  const recurringRestaurants = useMemo(() => rankRestaurants(restaurantsWithDistance, profile, recurringIntent, range, history).slice(0, 5), [restaurantsWithDistance, profile, recurringIntent, range, history]);

  function handleRangeChange(nextRange: SearchRange) { setRange(nextRange); storage.saveRange(nextRange); }
  function goQuickSearch(query: string) { router.push(`/search?q=${encodeURIComponent(query)}`); }
  if (!ready) return <AppShell />;

  return (
    <AppShell withBottomPadding>
      <main className="mx-auto flex max-w-5xl flex-col gap-7 px-4 py-5 sm:px-6 lg:py-8">
        <header className="overflow-hidden rounded-[2rem] bg-[var(--foreground)] p-5 pr-20 text-[var(--background)] shadow-[var(--app-shadow)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold opacity-70">Hola, {profile.name || "Juan"}</p>
              <h1 className="mt-1 text-3xl font-black leading-tight">Que comemos hoy?</h1>
            </div>
            <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[var(--brand)] text-white shadow-sm">
              <Utensils size={22} />
            </div>
          </div>
          <div className="mt-5 rounded-[1.35rem] bg-[var(--surface-raised)] p-1 text-[var(--foreground)] shadow-lg">
            <SearchBox />
          </div>
          <div className="mt-4 flex items-center justify-between gap-3 text-xs font-bold opacity-75">
            <span className="flex items-center gap-1">
              <MapPin size={15} /> Panama
            </span>
            <span>{ranked.length} opciones listas</span>
          </div>
        </header>

        <section className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-black text-[var(--muted)]">
            <Sparkles size={17} />
            Atajos de antojo
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {quickChips.map((chip) => (
              <button
                className="shrink-0 rounded-full border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm font-black text-[var(--muted-strong)] shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--brand)]"
                key={chip}
                onClick={() => goQuickSearch(chip)}
                type="button"
              >
                {chip}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3 rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-raised)] p-4 shadow-sm backdrop-blur">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--muted)]">Rango</p>
              <h2 className="text-lg font-black">Cerca de ti</h2>
            </div>
            <p className="text-xs font-bold text-[var(--muted)]">Ranking local</p>
          </div>
          <RangeSelector onChange={handleRangeChange} value={range} />
          <div className="flex flex-col gap-3 rounded-2xl bg-[var(--surface-muted)] p-3 text-sm font-bold text-[var(--muted-strong)] sm:flex-row sm:items-center sm:justify-between">
            <span>
              {liveLocation.status === "watching"
                ? `Ubicacion activa +/- ${Math.round(liveLocation.location?.accuracy ?? 0)} m`
                : liveLocation.status === "denied"
                  ? "Permiso de ubicacion denegado"
                  : "Activa tu ubicacion para que 2, 5 y 10 km sean reales"}
            </span>
            <button
              className="min-h-11 rounded-2xl bg-[var(--foreground)] px-4 text-sm font-black text-[var(--background)]"
              onClick={liveLocation.status === "watching" ? liveLocation.stop : liveLocation.request}
              type="button"
            >
              {liveLocation.status === "watching" ? "Pausar ubicacion" : liveLocation.status === "requesting" ? "Solicitando..." : "Usar mi ubicacion"}
            </button>
          </div>
        </section>

        <RestaurantSection eyebrow="Mejor match" title="Para ti" restaurants={ranked.slice(0, 6)} />
        <RestaurantSection eyebrow="Rapido de decidir" title="Cerca de ti" restaurants={ranked.slice(0, 4)} />

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--muted)]">Personalizado</p>
              <h2 className="text-xl font-black">Tus antojos frecuentes</h2>
            </div>
            <div className="hidden flex-wrap gap-2 sm:flex">
              {[...recurring.categories, ...recurring.ambience].slice(0, 3).map((item) => (
                <PreferenceChip key={item} label={item} type="static" />
              ))}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {recurringRestaurants.map((restaurant) => (
              <RestaurantCard key={`recurring-${restaurant.id}`} restaurant={restaurant} />
            ))}
          </div>
        </section>
      </main>
      <BottomNav />
    </AppShell>
  );
}

function RestaurantSection({ eyebrow, title, restaurants }: { eyebrow: string; title: string; restaurants: ReturnType<typeof rankRestaurants> }) {
  return (
    <section className="space-y-3">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--muted)]">{eyebrow}</p>
        <h2 className="text-xl font-black">{title}</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {restaurants.map((restaurant) => (
          <RestaurantCard key={`${title}-${restaurant.id}`} restaurant={restaurant} />
        ))}
      </div>
    </section>
  );
}
