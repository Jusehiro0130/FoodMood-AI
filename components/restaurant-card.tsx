"use client";

import Link from "next/link";
import { Camera, Heart, MapPin, Star } from "lucide-react";
import { MatchBadge } from "@/components/match-badge";
import type { MatchResult, Restaurant } from "@/lib/types";

type RestaurantCardProps = {
  restaurant: Restaurant;
  match: MatchResult;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
};

function visualFor(id: string) {
  const palettes = [
    "from-[#ff8a3d] via-[#fbd05d] to-[#fff3d6]",
    "from-[#28211e] via-[#8f3925] to-[#ffd7ab]",
    "from-[#ef476f] via-[#ffd166] to-[#fff8f0]",
    "from-[#188f75] via-[#7bd389] to-[#f2ffe8]",
    "from-[#3d405b] via-[#e07a5f] to-[#f4f1de]",
  ];
  return palettes[id.length % palettes.length];
}

export function RestaurantCard({
  restaurant,
  match,
  isFavorite,
  onToggleFavorite,
}: RestaurantCardProps) {
  const reason =
    match.reasons[0] ??
    `Coincide con ${restaurant.categories[0]} y ambiente ${restaurant.ambience[0]}.`;

  return (
    <article className="overflow-hidden rounded-[30px] bg-white shadow-lg shadow-[#ca5b2814] ring-1 ring-black/5">
      <div className={`relative h-36 bg-gradient-to-br ${visualFor(restaurant.id)} p-4`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(255,255,255,0.65),transparent_30%)]" />
        <button
          aria-label={isFavorite ? "Quitar favorito" : "Guardar favorito"}
          className={`absolute right-4 top-4 grid size-10 place-items-center rounded-full backdrop-blur ${
            isFavorite ? "bg-[#fa5a2a] text-white" : "bg-white/80 text-[#251611]"
          }`}
          onClick={() => onToggleFavorite(restaurant.id)}
          type="button"
        >
          <Heart size={19} fill={isFavorite ? "currentColor" : "none"} />
        </button>
        <div className="absolute bottom-4 left-4">
          <MatchBadge score={match.score} />
        </div>
      </div>
      <div className="space-y-4 p-4">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-black tracking-normal text-[#251611]">
                {restaurant.name}
              </h3>
              <p className="mt-1 text-sm font-semibold text-[#7b5545]">
                {restaurant.categories.join(" · ")}
              </p>
            </div>
            <div className="rounded-2xl bg-[#fff8f0] px-3 py-2 text-sm font-black text-[#251611]">
              {restaurant.priceLevel}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-[#6d5043]">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#fff0d8] px-3 py-1">
              <MapPin size={13} />
              {restaurant.distanceKm.toFixed(1)} km
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#fff0d8] px-3 py-1">
              <Star size={13} fill="currentColor" />
              {restaurant.rating.toFixed(1)}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#fff0d8] px-3 py-1">
              <Camera size={13} />
              {restaurant.instagram}
            </span>
          </div>
        </div>
        <p className="text-sm leading-6 text-[#6d5043]">{reason}</p>
        <Link
          className="flex min-h-12 items-center justify-center rounded-2xl bg-[#251611] px-4 text-sm font-black text-white"
          href={`/restaurant/${restaurant.id}`}
        >
          Ver detalle
        </Link>
      </div>
    </article>
  );
}
