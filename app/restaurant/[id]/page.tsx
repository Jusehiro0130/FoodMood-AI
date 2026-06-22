"use client";

import { ArrowLeft, Clock, Heart, MapPin, MessageCircle, Navigation, Star } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { MatchBadge } from "@/components/match-badge";
import { restaurants } from "@/lib/data/restaurants";
import { calculateRestaurantMatch } from "@/lib/ranking";
import { defaultProfile, storage } from "@/lib/storage";
import type { UserProfile } from "@/lib/types";

export default function RestaurantDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [saved, setSaved] = useState(false);
  const [ready, setReady] = useState(false);
  const restaurant = restaurants.find((item) => item.id === params.id);
  useEffect(() => {
    if (!storage.getSession()) {
      router.replace("/login");
      return;
    }
    setProfile(storage.getProfile() ?? defaultProfile);
    setSaved(storage.getFavorites().includes(params.id));
    setReady(true);
  }, [params.id, router]);

  const match = useMemo(() => restaurant ? calculateRestaurantMatch(restaurant, profile, null, storage.getRange(), storage.getSearchHistory()) : { score: 0, reasons: [] }, [restaurant, profile]);

  function toggleFavorite() {
    const next = storage.toggleFavorite(params.id);
    setSaved(next.includes(params.id));
  }

  if (!ready) return <AppShell />;
  if (!restaurant) {
    return (
      <AppShell>
        <main className="mx-auto max-w-md px-5 py-8">
          <p className="text-xl font-black">Restaurante no encontrado.</p>
          <Link className="mt-4 inline-block font-black text-[#fa5a2a]" href="/">
            Volver al inicio
          </Link>
        </main>
      </AppShell>
    );
  }

  const instagramUrl = `https://instagram.com/${restaurant.instagram.replace("@", "")}`;

  return (
    <AppShell>
      <main className="mx-auto max-w-3xl pb-28">
        <section className="relative min-h-[23rem] overflow-hidden bg-gradient-to-br from-[#fa5a2a] via-[#ffb454] to-[#2f7d62] p-5 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(255,255,255,0.28),transparent_22%),linear-gradient(180deg,transparent,rgba(37,22,17,0.42))]" />
          <button className="relative grid size-11 place-items-center rounded-2xl bg-white/16 backdrop-blur" onClick={() => router.back()} type="button">
            <ArrowLeft size={22} />
          </button>
          <div className="relative mt-20 space-y-4">
            <MatchBadge score={match.score} />
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-white/72">{restaurant.zone}</p>
              <h1 className="mt-2 text-4xl font-black leading-tight">{restaurant.name}</h1>
            </div>
            <p className="max-w-xl text-sm font-semibold leading-6 text-white/86">{restaurant.description}</p>
          </div>
        </section>

        <section className="-mt-10 space-y-5 rounded-t-[2rem] bg-[#fff8f0] px-5 pt-6">
          <div className="grid grid-cols-3 gap-2 rounded-[1.5rem] bg-white p-2 shadow-[0_16px_40px_rgba(37,22,17,0.08)]">
            <Metric icon={<Star size={16} fill="currentColor" />} label="Rating" value={restaurant.rating.toFixed(1)} />
            <Metric icon={<MapPin size={16} />} label="Distancia" value={`${restaurant.distanceKm.toFixed(1)} km`} />
            <Metric icon={<Clock size={16} />} label="Precio" value={restaurant.priceLevel} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Info label="Categorias" value={restaurant.categories.join(", ")} />
            <Info label="Ambiente" value={restaurant.ambience.join(", ")} />
            <Info label="Horario" value={restaurant.openingHours} />
            <Info label="Direccion" value={restaurant.address} />
          </div>

          <div className="rounded-[1.5rem] bg-white p-4 shadow-sm">
            <div className="grid gap-3 text-sm font-bold text-[#5f463b]">
              <span className="flex items-center gap-2">
                <MessageCircle size={17} /> {restaurant.instagram}
              </span>
              <span className="flex items-center gap-2">
                <MessageCircle size={17} /> {restaurant.whatsapp ?? "+507 6000-0000"}
              </span>
              <span className="flex items-center gap-2">
                <MapPin size={17} /> {restaurant.address}
              </span>
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-[#251611] p-4 text-white">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-white/60">Razon de recomendacion</p>
            <p className="mt-2 text-base font-bold leading-7">{match.reasons.join(". ") || "Buena opcion segun tus gustos y rango actual."}</p>
          </div>
        </section>

        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-[#fff8f0]/95 p-4 backdrop-blur">
          <div className="mx-auto grid max-w-3xl grid-cols-[auto_1fr_1fr] gap-2">
            <button
              aria-label={saved ? "Quitar de guardados" : "Guardar restaurante"}
              className={`grid min-h-14 place-items-center rounded-2xl px-4 ${
                saved ? "bg-[#fa5a2a] text-white" : "bg-white text-[#251611] shadow-sm"
              }`}
              onClick={toggleFavorite}
              type="button"
            >
              <Heart fill={saved ? "currentColor" : "none"} size={20} />
            </button>
            <a className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#251611] px-4 text-sm font-black text-white" href={instagramUrl} rel="noreferrer" target="_blank">
              <MessageCircle size={18} />
              Instagram
            </a>
            <a className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-white px-4 text-sm font-black text-[#251611] shadow-sm" href={`https://maps.google.com/?q=${encodeURIComponent(restaurant.address)}`} rel="noreferrer" target="_blank">
              <Navigation size={18} />
              Llegar
            </a>
          </div>
        </div>
      </main>
    </AppShell>
  );
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#fff8f0] px-2 py-3 text-center">
      <div className="mx-auto flex items-center justify-center gap-1 text-[#fa5a2a]">{icon}</div>
      <p className="mt-1 text-[0.68rem] font-black uppercase tracking-[0.12em] text-[#9d7d6d]">{label}</p>
      <p className="text-sm font-black text-[#251611]">{value}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] bg-white p-4 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-[#9d7d6d]">{label}</p>
      <p className="mt-2 text-sm font-black leading-6 text-[#251611]">{value}</p>
    </div>
  );
}
