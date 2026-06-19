"use client";

import { Heart, Instagram, MapPin, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MatchBadge } from "@/components/match-badge";
import { storage } from "@/lib/storage";
import type { RankedRestaurant } from "@/lib/types";

const swatches = ["from-[#fa5a2a] via-[#ffb454] to-[#2f7d62]", "from-[#251611] via-[#8d4d32] to-[#f0b85b]", "from-[#2f7d62] via-[#75b798] to-[#f5c84c]", "from-[#7a3d1d] via-[#fa7a45] to-[#ffe0a3]"];

type RestaurantCardProps = { restaurant: RankedRestaurant; onFavoriteChange?: () => void };
export function RestaurantCard({ restaurant, onFavoriteChange }: RestaurantCardProps) {
  const [saved, setSaved] = useState(false);
  useEffect(() => setSaved(storage.getFavorites().includes(restaurant.id)), [restaurant.id]);
  function handleFavorite() { const next = storage.toggleFavorite(restaurant.id); setSaved(next.includes(restaurant.id)); onFavoriteChange?.(); }
  const swatch = swatches[restaurant.id.length % swatches.length];
  return <article className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm"><div className={`h-32 bg-gradient-to-br ${swatch} p-4 text-white`}><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-white/80">{restaurant.zone}</p><h3 className="mt-2 text-2xl font-black leading-tight">{restaurant.name}</h3></div><MatchBadge score={restaurant.match.score} /></div></div><div className="space-y-4 p-4"><div className="flex flex-wrap gap-2">{restaurant.categories.slice(0, 3).map((category) => <span className="rounded-full bg-[#fff0df] px-3 py-1 text-xs font-black text-[#7a3d1d]" key={category}>{category}</span>)}</div><div className="grid grid-cols-2 gap-2 text-sm font-bold text-[#6d5043]"><span>{restaurant.priceLevel}</span><span className="flex items-center gap-1"><MapPin size={15} /> {restaurant.distanceKm.toFixed(1)} km</span><span className="flex items-center gap-1"><Star size={15} /> {restaurant.rating.toFixed(1)}</span><span className="flex items-center gap-1"><Instagram size={15} /> {restaurant.instagram}</span></div><p className="text-sm leading-6 text-[#5f463b]">{restaurant.match.reasons[0] ?? restaurant.description}</p><div className="grid grid-cols-[auto_1fr] gap-2"><button aria-label={saved ? "Quitar de guardados" : "Guardar restaurante"} className={`grid min-h-12 place-items-center rounded-2xl border px-4 ${saved ? "border-[#fa5a2a] bg-[#fa5a2a] text-white" : "border-[#ead6c4] bg-white text-[#7b5545]"}`} onClick={handleFavorite} type="button"><Heart fill={saved ? "currentColor" : "none"} size={20} /></button><Link className="grid min-h-12 place-items-center rounded-2xl bg-[#251611] px-4 text-sm font-black text-white" href={`/restaurant/${restaurant.id}`}>Ver detalle</Link></div></div></article>;
}
