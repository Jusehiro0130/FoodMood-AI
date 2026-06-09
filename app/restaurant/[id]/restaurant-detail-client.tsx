"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  Clock,
  Heart,
  MapPinned,
  MessageCircle,
  Star,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { MatchBadge } from "@/components/match-badge";
import { getRestaurantById } from "@/lib/data/restaurants";
import { calculateRestaurantMatch } from "@/lib/ranking";
import {
  demoSession,
  favoritesStorage,
  historyStorage,
  onboardingStorage,
  profileStorage,
  rangeStorage,
} from "@/lib/storage";

type RestaurantDetailClientProps = {
  id: string;
};

export function RestaurantDetailClient({ id }: RestaurantDetailClientProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const restaurant = getRestaurantById(id);

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
      setIsFavorite(favoritesStorage.isFavorite(id));
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [id, router]);

  const match = useMemo(() => {
    if (!restaurant) return { score: 0, reasons: [] };
    return calculateRestaurantMatch(
      restaurant,
      profileStorage.getOrDefault(),
      null,
      rangeStorage.get(),
      historyStorage.get(),
    );
  }, [restaurant]);

  if (!ready) {
    return (
      <AppShell>
        <div className="grid min-h-screen place-items-center text-sm font-black text-[#7b5545]">
          Cargando restaurante...
        </div>
      </AppShell>
    );
  }

  if (!restaurant) {
    return (
      <AppShell>
        <main className="grid min-h-screen place-items-center px-6 text-center">
          <div>
            <h1 className="text-2xl font-black">No encontre este restaurante</h1>
            <Link className="mt-4 inline-block font-black text-[#fa5a2a]" href="/">
              Volver al inicio
            </Link>
          </div>
        </main>
      </AppShell>
    );
  }

  function toggleFavorite() {
    favoritesStorage.toggle(id);
    setIsFavorite(favoritesStorage.isFavorite(id));
  }

  const instagramUrl = `https://instagram.com/${restaurant.instagram.replace("@", "")}`;

  return (
    <AppShell showNav>
      <main className="space-y-5 px-5 py-6">
        <header className="flex items-center justify-between">
          <button
            className="grid size-11 place-items-center rounded-2xl bg-white text-[#251611] shadow-sm ring-1 ring-black/5"
            onClick={() => router.back()}
            type="button"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            aria-label="Cambiar favorito"
            className={`grid size-11 place-items-center rounded-2xl shadow-sm ${
              isFavorite ? "bg-[#fa5a2a] text-white" : "bg-white text-[#251611]"
            }`}
            onClick={toggleFavorite}
            type="button"
          >
            <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </header>

        <section className="overflow-hidden rounded-[34px] bg-white shadow-lg shadow-[#ca5b2817] ring-1 ring-black/5">
          <div className="relative h-56 bg-gradient-to-br from-[#fa5a2a] via-[#ffca66] to-[#fff3dc]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(255,255,255,0.7),transparent_32%)]" />
            <div className="absolute bottom-4 left-4">
              <MatchBadge score={match.score} />
            </div>
          </div>
          <div className="space-y-5 p-5">
            <div>
              <h1 className="text-3xl font-black leading-tight">{restaurant.name}</h1>
              <p className="mt-2 text-sm leading-6 text-[#6d5043]">
                {restaurant.description}
              </p>
            </div>

            <InfoGrid
              items={[
                { icon: <Star size={16} />, label: "Rating", value: restaurant.rating.toFixed(1) },
                { icon: <MapPinned size={16} />, label: "Zona", value: restaurant.zone },
                { icon: <Clock size={16} />, label: "Horario", value: restaurant.openingHours },
                { icon: <MessageCircle size={16} />, label: "WhatsApp", value: restaurant.whatsapp ?? "Listo" },
              ]}
            />

            <DetailBlock title="Categorias" values={restaurant.categories} />
            <DetailBlock title="Ambiente" values={restaurant.ambience} />
            <DetailBlock title="Tags" values={restaurant.tags} />

            <div className="rounded-[24px] bg-[#fff8f0] p-4">
              <p className="text-sm font-black text-[#251611]">Por que coincide</p>
              <p className="mt-2 text-sm leading-6 text-[#6d5043]">
                {match.reasons.join(" ")}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a
                className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#251611] px-4 text-sm font-black text-white"
                href={instagramUrl}
                rel="noreferrer"
                target="_blank"
              >
                <Camera size={17} />
                Ver Instagram
              </a>
              <a
                className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#fff0d8] px-4 text-sm font-black text-[#7a3d1d]"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address)}`}
                rel="noreferrer"
                target="_blank"
              >
                <MapPinned size={17} />
                Como llegar
              </a>
            </div>

            <button
              className={`flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl px-4 text-sm font-black ${
                isFavorite ? "bg-[#fa5a2a] text-white" : "bg-[#fff0d8] text-[#7a3d1d]"
              }`}
              onClick={toggleFavorite}
              type="button"
            >
              <Heart size={17} fill={isFavorite ? "currentColor" : "none"} />
              {isFavorite ? "Guardado" : "Guardar"}
            </button>
          </div>
        </section>
      </main>
    </AppShell>
  );
}

function InfoGrid({
  items,
}: {
  items: Array<{ icon: React.ReactNode; label: string; value: string }>;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((item) => (
        <div className="rounded-2xl bg-[#fff8f0] p-3" key={item.label}>
          <div className="text-[#fa5a2a]">{item.icon}</div>
          <p className="mt-2 text-xs font-bold text-[#8a6b5e]">{item.label}</p>
          <p className="mt-1 text-sm font-black text-[#251611]">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

function DetailBlock({ title, values }: { title: string; values: string[] }) {
  return (
    <div>
      <p className="text-sm font-black text-[#251611]">{title}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {values.map((value) => (
          <span
            className="rounded-full bg-[#fff0d8] px-3 py-1 text-xs font-black text-[#7a3d1d]"
            key={value}
          >
            {value}
          </span>
        ))}
      </div>
    </div>
  );
}
