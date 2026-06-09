"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { RangeSelector } from "@/components/range-selector";
import { RestaurantCard } from "@/components/restaurant-card";
import { SearchBox } from "@/components/search-box";
import { QUICK_SEARCHES } from "@/lib/constants";
import { parseFoodIntent } from "@/lib/ai/parse-food-intent";
import { restaurants } from "@/lib/data/restaurants";
import { calculateRestaurantMatch } from "@/lib/ranking";
import {
  demoSession,
  favoritesStorage,
  historyStorage,
  onboardingStorage,
  profileStorage,
  rangeStorage,
} from "@/lib/storage";
import type { FoodIntent, SearchRange, UserProfile } from "@/lib/types";

type SearchClientProps = {
  initialQuery: string;
};

export function SearchClient({ initialQuery }: SearchClientProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [range, setRange] = useState<SearchRange>("5km");
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [query, setQuery] = useState(initialQuery);
  const [intent, setIntent] = useState<FoodIntent | null>(null);
  const [history, setHistory] = useState(historyStorage.get());

  useEffect(() => {
    if (!demoSession.isLoggedIn()) {
      router.replace("/login");
      return;
    }
    if (!onboardingStorage.isCompleted()) {
      router.replace("/onboarding");
      return;
    }
    const timer = window.setTimeout(() => {
      setProfile(profileStorage.getOrDefault());
      setRange(rangeStorage.get());
      setFavoriteIds(favoritesStorage.getIds());
      setHistory(historyStorage.get());
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [router]);

  useEffect(() => {
    if (!ready || !initialQuery) return;
    const parsed = parseFoodIntent(initialQuery);
    const timer = window.setTimeout(() => {
      setQuery(initialQuery);
      setIntent(parsed);
      setHistory(historyStorage.add(initialQuery, parsed));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [initialQuery, ready]);

  const results = useMemo(() => {
    if (!profile || !intent) return [];
    return restaurants
      .map((restaurant) => ({
        restaurant,
        match: calculateRestaurantMatch(restaurant, profile, intent, range, history),
      }))
      .filter(({ match }) => match.score > 20)
      .sort((a, b) => b.match.score - a.match.score);
  }, [profile, intent, range, history]);

  function runSearch(nextQuery: string) {
    router.push(`/search?q=${encodeURIComponent(nextQuery)}`);
  }

  function updateRange(next: SearchRange) {
    setRange(next);
    rangeStorage.set(next);
  }

  function toggleFavorite(id: string) {
    setFavoriteIds(favoritesStorage.toggle(id));
  }

  return (
    <AppShell showNav>
      <main className="space-y-6 px-5 py-6">
        <header>
          <p className="text-sm font-bold text-[#7b5545]">Buscar</p>
          <h1 className="text-3xl font-black leading-tight text-[#251611]">
            Dime tu antojo en tus palabras
          </h1>
        </header>

        <SearchBox initialValue={query} onSearch={runSearch} />

        <div className="flex gap-2 overflow-x-auto pb-1">
          {QUICK_SEARCHES.map((quick) => (
            <button
              className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-black text-[#5f463b] shadow-sm ring-1 ring-black/5"
              key={quick}
              onClick={() => runSearch(quick)}
              type="button"
            >
              {quick}
            </button>
          ))}
        </div>

        <RangeSelector value={range} onChange={updateRange} />

        {!intent ? (
          <EmptyState
            description="Prueba con salchipapa barata cerca, comida italiana para una cita o sushi con amigos."
            icon={<Search size={24} />}
            title="Busca algo rico"
          />
        ) : (
          <section className="space-y-4">
            <div>
              <p className="text-sm font-bold text-[#7b5545]">Encontre opciones para:</p>
              <h2 className="text-2xl font-black text-[#251611]">
                &ldquo;{intent.query}&rdquo;
              </h2>
            </div>
            {results.map(({ restaurant, match }) => (
              <RestaurantCard
                isFavorite={favoriteIds.includes(restaurant.id)}
                key={restaurant.id}
                match={match}
                onToggleFavorite={toggleFavorite}
                restaurant={restaurant}
              />
            ))}
          </section>
        )}
      </main>
    </AppShell>
  );
}
