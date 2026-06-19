"use client";

import { LogOut, Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { BottomNav } from "@/components/bottom-nav";
import { EmptyState } from "@/components/empty-state";
import { PreferenceChip } from "@/components/preference-chip";
import { restaurants } from "@/lib/data/restaurants";
import { defaultProfile, storage } from "@/lib/storage";
import type { SearchHistoryItem, UserProfile } from "@/lib/types";

function rangeLabel(value: string) { return value === "city" ? "Toda la ciudad" : value.replace("km", " km"); }

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => { if (!storage.getSession()) { router.replace("/login"); return; } setProfile(storage.getProfile() ?? defaultProfile); setHistory(storage.getSearchHistory()); setFavoriteIds(storage.getFavorites()); setReady(true); }, [router]);
  const savedRestaurants = useMemo(() => restaurants.filter((restaurant) => favoriteIds.includes(restaurant.id)), [favoriteIds]);
  function logout() { storage.logout(); router.replace("/login"); }
  if (!ready) return <AppShell />;
  return <AppShell withBottomPadding><main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-5 sm:px-6 lg:py-8"><header className="rounded-[2rem] bg-[#251611] p-5 text-white"><p className="text-sm font-black text-white/60">Perfil demo</p><h1 className="mt-2 text-4xl font-black">Juan</h1><p className="mt-2 text-sm font-semibold text-white/72">Preferencias locales para recomendaciones mock.</p></header><section className="space-y-4 rounded-3xl bg-white p-4 shadow-sm"><div className="flex items-center justify-between gap-3"><h2 className="text-xl font-black">Tus gustos</h2><Link className="flex min-h-11 items-center gap-2 rounded-2xl bg-[#fff0df] px-4 text-sm font-black text-[#7a3d1d]" href="/onboarding"><Pencil size={16} />Editar gustos</Link></div><ChipGroup title="Comida favorita" values={profile.favoriteCategories} /><ChipGroup title="Ambientes" values={profile.preferredAmbience} /><ChipGroup title="Restricciones" values={profile.restrictions} /><div className="grid grid-cols-2 gap-3"><Metric label="Presupuesto" value={profile.budgetLevel} /><Metric label="Distancia" value={rangeLabel(profile.preferredRange)} /></div></section><section className="space-y-3 rounded-3xl bg-white p-4 shadow-sm"><h2 className="text-xl font-black">Historial de busquedas</h2>{history.length ? <div className="space-y-2">{history.slice(0, 8).map((item) => <Link className="block rounded-2xl bg-[#fff8f0] p-3 text-sm font-black text-[#251611]" href={`/search?q=${encodeURIComponent(item.query)}`} key={item.id}>{item.query}</Link>)}</div> : <EmptyState title="Aun no hay busquedas." />}</section><section className="space-y-3 rounded-3xl bg-white p-4 shadow-sm"><h2 className="text-xl font-black">Restaurantes guardados</h2>{savedRestaurants.length ? <div className="space-y-2">{savedRestaurants.map((restaurant) => <Link className="flex items-center justify-between rounded-2xl bg-[#fff8f0] p-3 text-sm font-black text-[#251611]" href={`/restaurant/${restaurant.id}`} key={restaurant.id}><span>{restaurant.name}</span><span className="text-[#7b5545]">{restaurant.priceLevel}</span></Link>)}</div> : <EmptyState title="Todavia no guardaste restaurantes." />}</section><button className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#fa5a2a] px-5 text-base font-black text-white" onClick={logout} type="button"><LogOut size={20} />Cerrar sesion</button></main><BottomNav /></AppShell>;
}

function ChipGroup({ title, values }: { title: string; values: string[] }) { return <div className="space-y-2"><p className="text-xs font-black uppercase tracking-[0.14em] text-[#9d7d6d]">{title}</p><div className="flex flex-wrap gap-2">{values.map((value) => <PreferenceChip key={value} label={value} type="static" />)}</div></div>; }
function Metric({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl bg-[#fff8f0] p-3"><p className="text-xs font-black uppercase tracking-[0.14em] text-[#9d7d6d]">{label}</p><p className="mt-2 text-lg font-black text-[#251611]">{value}</p></div>; }
