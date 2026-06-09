"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Flame, MapPin, Sparkles, Utensils } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { RangeSelector } from "@/components/range-selector";
import { RestaurantCard } from "@/components/restaurant-card";
import { SearchBox } from "@/components/search-box";
import { PreferenceChip } from "@/components/preference-chip";
import { QUICK_SEARCHES } from "@/lib/constants";
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
import { getRecurringUserPreferences } from "@/lib/user-preferences";
import type { SearchRange, UserProfile } from "@/lib/types";

export default function HomePage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [range, setRange] = useState<SearchRange>("5km");
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
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

  const matches = useMemo(() => {
    if (!profile) return [];
    return restaurants
      .map((restaurant) => ({
        restaurant,
        match: calculateRestaurantMatch(restaurant, profile, null, range, history),
      }))
      .sort((a, b) => b.match.score - a.match.score);
  }, [profile, range, history]);

  const recurring = getRecurringUserPreferences(history);
  const frequent = recurring.frequentCategories.length
    ? recurring.frequentCategories
    : profile?.favoriteCategories.slice(0, 3) ?? [];

  function updateRange(next: SearchRange) {
    setRange(next);
    rangeStorage.set(next);
  }

  function toggleFavorite(id: string) {
    setFavoriteIds(favoritesStorage.toggle(id));
  }

  function search(query: string) {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  if (!ready || !profile) {
    return (
      <AppShell>
        <div className="grid min-h-screen place-items-center px-6 text-center">
          <p className="text-sm font-black text-[#7b5545]">Preparando tus antojos...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell showNav>
      <main className="space-y-7 px-5 py-6">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-[#7b5545]">Hola, {profile.name}</p>
            <h1 className="text-3xl font-black leading-tight text-[#251611]">
              Que se te antoja hoy?
            </h1>
          </div>
          <div className="grid size-12 place-items-center rounded-2xl bg-[#fa5a2a] text-white shadow-lg shadow-[#fa5a2a33]">
            <Utensils size={24} />
          </div>
        </header>

        <SearchBox onSearch={search} />

        <section className="space-y-3">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {QUICK_SEARCHES.map((query) => (
              <button
                className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-black text-[#5f463b] shadow-sm ring-1 ring-black/5"
                key={query}
                onClick={() => search(query)}
                type="button"
              >
                {query}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-[#251611]">Expandir rango</h2>
            <span className="inline-flex items-center gap-1 text-xs font-black text-[#7b5545]">
              <MapPin size={14} />
              Panama
            </span>
          </div>
          <RangeSelector value={range} onChange={updateRange} />
        </section>

        <section className="space-y-4">
          <SectionTitle icon={<Sparkles size={18} />} title="Para ti" />
          {matches.slice(0, 4).map(({ restaurant, match }) => (
            <RestaurantCard
              isFavorite={favoriteIds.includes(restaurant.id)}
              key={restaurant.id}
              match={match}
              onToggleFavorite={toggleFavorite}
              restaurant={restaurant}
            />
          ))}
        </section>

        <section className="space-y-4">
          <SectionTitle icon={<MapPin size={18} />} title="Cerca de ti" />
          {matches
            .filter(({ restaurant }) => restaurant.distanceKm <= 3)
            .slice(0, 3)
            .map(({ restaurant, match }) => (
              <RestaurantCard
                isFavorite={favoriteIds.includes(restaurant.id)}
                key={restaurant.id}
                match={match}
                onToggleFavorite={toggleFavorite}
                restaurant={restaurant}
              />
            ))}
        </section>

        <section className="space-y-4">
          <SectionTitle icon={<Flame size={18} />} title="Tus antojos frecuentes" />
          <div className="flex flex-wrap gap-2">
            {frequent.map((item) => (
              <PreferenceChip key={item} label={item} />
            ))}
          </div>
        </section>
      </main>
    </AppShell>
  );
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="grid size-8 place-items-center rounded-xl bg-[#fff0d8] text-[#fa5a2a]">
        {icon}
      </span>
      <h2 className="text-xl font-black text-[#251611]">{title}</h2>
    </div>
  );
}
