"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { RestaurantCard } from "@/components/restaurant-card";
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

export default function FavoritesPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

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
      setFavoriteIds(favoritesStorage.getIds());
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [router]);

  const favoriteRestaurants = useMemo(
    () => restaurants.filter((restaurant) => favoriteIds.includes(restaurant.id)),
    [favoriteIds],
  );

  function toggleFavorite(id: string) {
    setFavoriteIds(favoritesStorage.toggle(id));
  }

  return (
    <AppShell showNav>
      <main className="space-y-6 px-5 py-6">
        <header>
          <p className="text-sm font-bold text-[#7b5545]">Guardados</p>
          <h1 className="text-3xl font-black text-[#251611]">Tus restaurantes favoritos</h1>
        </header>

        {ready && favoriteRestaurants.length === 0 ? (
          <EmptyState
            description="Cuando guardes un restaurante, aparecera aqui para volver rapido."
            icon={<Heart size={24} />}
            title="Todavia no guardaste restaurantes."
          />
        ) : null}

        <section className="space-y-4">
          {favoriteRestaurants.map((restaurant) => (
            <RestaurantCard
              isFavorite
              key={restaurant.id}
              match={calculateRestaurantMatch(
                restaurant,
                profileStorage.getOrDefault(),
                null,
                rangeStorage.get(),
                historyStorage.get(),
              )}
              onToggleFavorite={toggleFavorite}
              restaurant={restaurant}
            />
          ))}
        </section>
      </main>
    </AppShell>
  );
}
