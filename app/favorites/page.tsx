"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { BottomNav } from "@/components/bottom-nav";
import { EmptyState } from "@/components/empty-state";
import { RestaurantCard } from "@/components/restaurant-card";
import { rankRestaurants } from "@/lib/ranking";
import { defaultProfile, storage } from "@/lib/storage";
import { useRestaurants } from "@/lib/use-restaurants";
import type { UserProfile } from "@/lib/types";

export default function FavoritesPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const { restaurants } = useRestaurants();
  useEffect(() => { if (!storage.getSession()) { router.replace("/login"); return; } setProfile(storage.getProfile() ?? defaultProfile); setFavoriteIds(storage.getFavorites()); setReady(true); }, [router]);
  const favorites = useMemo(() => rankRestaurants(restaurants.filter((restaurant) => favoriteIds.includes(restaurant.id)), profile, null, "city", storage.getSearchHistory()), [favoriteIds, profile]);
  if (!ready) return <AppShell />;
  return <AppShell withBottomPadding><main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-5 sm:px-6 lg:py-8"><header><p className="text-sm font-black text-[#7b5545]">Guardados</p><h1 className="mt-1 text-3xl font-black leading-tight">Tus restaurantes favoritos</h1></header>{favorites.length ? <div className="grid gap-4 md:grid-cols-2">{favorites.map((restaurant) => <RestaurantCard key={restaurant.id} onFavoriteChange={() => setFavoriteIds(storage.getFavorites())} restaurant={restaurant} />)}</div> : <EmptyState action={<Link className="inline-grid min-h-12 place-items-center rounded-2xl bg-[#251611] px-5 text-sm font-black text-white" href="/">Explorar restaurantes</Link>} title="Todavia no guardaste restaurantes." />}</main><BottomNav /></AppShell>;
}
