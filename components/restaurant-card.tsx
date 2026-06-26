"use client";

import { Heart, MapPin, Star, Utensils } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { storage } from "@/lib/storage";
import type { RankedRestaurant } from "@/lib/types";

type RestaurantCardProps = { restaurant: RankedRestaurant; onFavoriteChange?: () => void };

export function RestaurantCard({ restaurant, onFavoriteChange }: RestaurantCardProps) {
  const [saved, setSaved] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => setSaved(storage.getFavorites().includes(restaurant.id)), [restaurant.id]);
  useEffect(() => setImageFailed(false), [restaurant.id, restaurant.imageUrl]);

  function handleFavorite() {
    const next = storage.toggleFavorite(restaurant.id);
    setSaved(next.includes(restaurant.id));
    onFavoriteChange?.();
  }

  return (
    <article>
      <div className="relative overflow-hidden rounded-t-[1.1rem] rounded-b-[0.55rem] bg-[#1c130f] p-3 text-[#fff7ed] shadow-[0_14px_30px_rgba(28,19,15,0.18)]">
        <Link aria-label={`Ver detalle de ${restaurant.name}`} className="absolute inset-0" href={`/restaurant/${restaurant.id}`} />
        <div className="relative grid grid-cols-[3.65rem_1fr_auto] items-center gap-3">
          <div className="relative grid size-14 overflow-hidden rounded-full border border-dashed border-[#ffd45f] bg-[#ff5a1f] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]">
            {restaurant.imageUrl && !imageFailed ? (
              <img
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                onError={() => setImageFailed(true)}
                src={restaurant.imageUrl}
              />
            ) : (
              <Utensils className="m-auto" size={23} strokeWidth={2.6} />
            )}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-base font-black leading-tight text-white">{restaurant.name.toLowerCase()}</h3>
            <p className="mt-1 truncate text-xs font-bold text-[#c9b7a9]">{restaurant.categories[0]?.toLowerCase() ?? restaurant.zone.toLowerCase()}</p>
          </div>

          <div className="text-right">
            <p className="text-xl font-black leading-none text-[#ff9d21]">{restaurant.match.score}%</p>
            <p className="mt-1 text-[0.65rem] font-bold text-[#b9a89b]">match</p>
          </div>
        </div>

        <div className="relative mt-3 flex items-center justify-between gap-3 border-t border-dashed border-[#5a4337] pt-2">
          <div className="flex min-w-0 items-center gap-3 text-[0.7rem] font-black">
            <span className="flex items-center gap-1 text-[#35d07f]">
              <MapPin size={12} /> {restaurant.distanceKm.toFixed(1)} km
            </span>
            <span className="text-[#ff9d21]">{restaurant.priceLevel}</span>
            <span className="flex items-center gap-1 text-[#ff9d21]">
              <Star fill="currentColor" size={12} /> {restaurant.rating.toFixed(1)}
            </span>
          </div>
          <button
            aria-label={saved ? "Quitar de guardados" : "Guardar restaurante"}
            className={`relative z-10 grid size-8 place-items-center rounded-full transition ${
              saved ? "bg-[#ff5a1f] text-white" : "bg-white/8 text-[#c9b7a9] hover:bg-white/14"
            }`}
            onClick={handleFavorite}
            type="button"
          >
            <Heart fill={saved ? "currentColor" : "none"} size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}
