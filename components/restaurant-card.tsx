"use client";

import { Clock, Heart, MapPin, MessageCircle, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MatchBadge } from "@/components/match-badge";
import { storage } from "@/lib/storage";
import type { RankedRestaurant } from "@/lib/types";

const swatches = [
  "from-[#fa5a2a] via-[#ffb454] to-[#2f7d62]",
  "from-[#251611] via-[#8d4d32] to-[#f0b85b]",
  "from-[#2f7d62] via-[#75b798] to-[#f5c84c]",
  "from-[#7a3d1d] via-[#fa7a45] to-[#ffe0a3]",
];

type RestaurantCardProps = { restaurant: RankedRestaurant; onFavoriteChange?: () => void };

export function RestaurantCard({ restaurant, onFavoriteChange }: RestaurantCardProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => setSaved(storage.getFavorites().includes(restaurant.id)), [restaurant.id]);

  function handleFavorite() {
    const next = storage.toggleFavorite(restaurant.id);
    setSaved(next.includes(restaurant.id));
    onFavoriteChange?.();
  }

  const swatch = swatches[restaurant.id.length % swatches.length];

  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface-raised)] shadow-[var(--app-shadow)]">
      <div className={`relative min-h-40 bg-gradient-to-br ${swatch} p-4 text-white`}>
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.18),transparent_32%),radial-gradient(circle_at_85%_20%,rgba(255,255,255,0.24),transparent_22%)]" />
        <div className="relative flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/80">{restaurant.zone}</p>
            <h3 className="mt-2 text-2xl font-black leading-tight">{restaurant.name}</h3>
          </div>
          <MatchBadge score={restaurant.match.score} />
        </div>
        <div className="relative mt-6 flex flex-wrap gap-2">
          {restaurant.categories.slice(0, 3).map((category) => (
            <span className="rounded-full bg-white/18 px-3 py-1 text-xs font-black text-white backdrop-blur" key={category}>
              {category}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-black text-[var(--muted-strong)]">
          <span className="rounded-2xl bg-[var(--warning-soft)] px-2 py-3">{restaurant.priceLevel}</span>
          <span className="flex items-center justify-center gap-1 rounded-2xl bg-[var(--surface-muted)] px-2 py-3">
            <Star size={14} fill="currentColor" /> {restaurant.rating.toFixed(1)}
          </span>
          <span className="flex items-center justify-center gap-1 rounded-2xl bg-[var(--accent-soft)] px-2 py-3 text-[var(--accent)]">
            <MapPin size={14} /> {restaurant.distanceKm.toFixed(1)} km
          </span>
        </div>

        <p className="text-sm leading-6 text-[var(--muted-strong)]">{restaurant.match.reasons[0] ?? restaurant.description}</p>

        <div className="flex items-center justify-between gap-3 border-t border-[var(--border)] pt-4 text-xs font-bold text-[var(--muted)]">
          <span className="flex min-w-0 items-center gap-1 truncate">
            <MessageCircle size={15} /> {restaurant.instagram}
          </span>
          <span className="flex shrink-0 items-center gap-1">
            <Clock size={15} /> Hoy abierto
          </span>
        </div>

        <div className="grid grid-cols-[auto_1fr] gap-2">
          <button
            aria-label={saved ? "Quitar de guardados" : "Guardar restaurante"}
            className={`grid min-h-12 place-items-center rounded-2xl border px-4 transition ${
              saved ? "border-[var(--brand)] bg-[var(--brand)] text-white" : "border-[var(--border)] bg-[var(--surface-raised)] text-[var(--muted)]"
            }`}
            onClick={handleFavorite}
            type="button"
          >
            <Heart fill={saved ? "currentColor" : "none"} size={20} />
          </button>
          <Link className="grid min-h-12 place-items-center rounded-2xl bg-[var(--foreground)] px-4 text-sm font-black text-[var(--background)]" href={`/restaurant/${restaurant.id}`}>
            Ver detalle
          </Link>
        </div>
      </div>
    </article>
  );
}
