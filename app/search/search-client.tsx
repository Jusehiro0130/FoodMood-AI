"use client";

import { Clock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { BottomNav } from "@/components/bottom-nav";
import { PreferenceChip } from "@/components/preference-chip";
import { RangeSelector } from "@/components/range-selector";
import { RestaurantCard } from "@/components/restaurant-card";
import { SearchBox } from "@/components/search-box";
import { parseFoodIntent } from "@/lib/ai/parse-food-intent";
import { rankRestaurants } from "@/lib/ranking";
import { defaultProfile, storage } from "@/lib/storage";
import { useRestaurants } from "@/lib/use-restaurants";
import type { FoodIntent, SearchHistoryItem, SearchRange, UserProfile } from "@/lib/types";

const examples = ["quiero comida italiana para una cita", "salchipapa barata cerca", "algo rapido y economico", "quiero sushi con amigos", "no se que comer"];
function compactIntentLabels(intent: FoodIntent) { return [...intent.categories, ...intent.mood, intent.budget].filter((item): item is string => Boolean(item)); }

export function SearchClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [range, setRange] = useState<SearchRange>("5km");
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [intent, setIntent] = useState<FoodIntent | null>(null);
  const [ready, setReady] = useState(false);
  const { restaurants } = useRestaurants();
  useEffect(() => { if (!storage.getSession()) { router.replace("/login"); return; } setProfile(storage.getProfile() ?? defaultProfile); setRange(storage.getRange()); const nextHistory = storage.getSearchHistory(); setHistory(nextHistory); setIntent(null); if (query) { const parsedIntent = parseFoodIntent(query); const historyItem: SearchHistoryItem = { id: `${Date.now()}`, query, parsedIntent, createdAt: new Date().toISOString() }; setIntent(parsedIntent); setHistory(storage.addSearchHistory(historyItem)); } setReady(true); }, [query, router]);
  const ranked = useMemo(() => rankRestaurants(restaurants, profile, intent, range, history), [profile, intent, range, history]);
  function handleRangeChange(nextRange: SearchRange) { setRange(nextRange); storage.saveRange(nextRange); }
  if (!ready) return <AppShell />;
  return <AppShell withBottomPadding><main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-5 sm:px-6 lg:py-8"><header><p className="text-sm font-black text-[#7b5545]">Buscar</p><h1 className="mt-1 text-3xl font-black leading-tight">Cuentame tu antojo</h1></header><SearchBox compact initialValue={query} key={query} /><section className="space-y-3"><div className="flex gap-2 overflow-x-auto pb-1">{examples.map((example) => <button className="shrink-0 rounded-full bg-white px-4 py-3 text-sm font-black text-[#5f463b] shadow-sm ring-1 ring-black/5" key={example} onClick={() => router.push(`/search?q=${encodeURIComponent(example)}`)} type="button">{example}</button>)}</div></section><section className="rounded-3xl bg-white p-4 shadow-sm"><RangeSelector onChange={handleRangeChange} value={range} /></section>{intent ? <section className="space-y-3 rounded-3xl bg-[#251611] p-4 text-white"><p className="text-xs font-black uppercase tracking-[0.16em] text-white/60">Consulta original</p><h2 className="text-xl font-black">&quot;{intent.query}&quot;</h2><div className="flex flex-wrap gap-2">{compactIntentLabels(intent).map((item) => <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-black" key={item}>{item}</span>)}</div></section> : null}<section className="space-y-3"><h2 className="text-xl font-black">{intent ? "Resultados filtrados" : "Prueba una busqueda"}</h2><div className="grid gap-4 md:grid-cols-2">{ranked.slice(0, intent ? 12 : 6).map((restaurant) => <RestaurantCard key={restaurant.id} restaurant={restaurant} />)}</div></section>{history.length ? <section className="space-y-3"><div className="flex items-center gap-2 text-sm font-black text-[#7b5545]"><Clock size={17} />Historial reciente</div><div className="flex flex-wrap gap-2">{history.slice(0, 6).map((item) => <PreferenceChip key={item.id} label={item.query} onClick={() => router.push(`/search?q=${encodeURIComponent(item.query)}`)} />)}</div></section> : null}</main><BottomNav /></AppShell>;
}
