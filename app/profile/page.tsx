"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, LogOut, Pencil, Search } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PreferenceChip } from "@/components/preference-chip";
import { restaurants } from "@/lib/data/restaurants";
import {
  demoSession,
  favoritesStorage,
  historyStorage,
  onboardingStorage,
  profileStorage,
} from "@/lib/storage";
import type { SearchHistoryItem, UserProfile } from "@/lib/types";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
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
      setProfile(profileStorage.getOrDefault());
      setHistory(historyStorage.get());
      setFavoriteIds(favoritesStorage.getIds());
    }, 0);
    return () => window.clearTimeout(timer);
  }, [router]);

  function logout() {
    demoSession.logout();
    router.push("/login");
  }

  if (!profile) {
    return (
      <AppShell>
        <div className="grid min-h-screen place-items-center text-sm font-black text-[#7b5545]">
          Cargando perfil...
        </div>
      </AppShell>
    );
  }

  const favoriteNames = restaurants
    .filter((restaurant) => favoriteIds.includes(restaurant.id))
    .map((restaurant) => restaurant.name);

  return (
    <AppShell showNav>
      <main className="space-y-6 px-5 py-6">
        <header className="rounded-[32px] bg-[#251611] p-5 text-white shadow-lg shadow-black/10">
          <p className="text-sm font-bold text-[#ffcfaa]">Perfil demo</p>
          <h1 className="mt-2 text-3xl font-black">{profile.name}</h1>
          <p className="mt-2 text-sm leading-6 text-[#ffe5cf]">
            Tus gustos viven en localStorage durante este mockup.
          </p>
        </header>

        <ProfileSection title="Gustos seleccionados">
          {profile.favoriteCategories.map((item) => (
            <PreferenceChip key={item} label={item} />
          ))}
        </ProfileSection>

        <ProfileSection title="Presupuesto y distancia">
          <PreferenceChip active label={profile.budgetLevel} />
          <PreferenceChip active label={profile.preferredRange} />
        </ProfileSection>

        <ProfileSection title="Ambientes favoritos">
          {profile.preferredAmbience.map((item) => (
            <PreferenceChip key={item} label={item} />
          ))}
        </ProfileSection>

        <ProfileSection title="Restricciones">
          {profile.restrictions.map((item) => (
            <PreferenceChip key={item} label={item} />
          ))}
        </ProfileSection>

        <section className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-black/5">
          <div className="flex items-center gap-2">
            <Search size={18} className="text-[#fa5a2a]" />
            <h2 className="text-lg font-black">Historial de busquedas</h2>
          </div>
          <div className="mt-4 space-y-3">
            {history.length ? (
              history.slice(0, 6).map((item) => (
                <div className="rounded-2xl bg-[#fff8f0] p-3" key={item.id}>
                  <p className="text-sm font-black text-[#251611]">{item.query}</p>
                  <p className="mt-1 text-xs font-bold text-[#8a6b5e]">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm leading-6 text-[#7b5545]">
                Aun no hay busquedas. Prueba el buscador para crear historial.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-black/5">
          <div className="flex items-center gap-2">
            <Heart size={18} className="text-[#fa5a2a]" />
            <h2 className="text-lg font-black">Restaurantes guardados</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-[#7b5545]">
            {favoriteNames.length ? favoriteNames.join(", ") : "No tienes favoritos todavia."}
          </p>
        </section>

        <div className="grid grid-cols-2 gap-3">
          <button
            className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#fff0d8] px-4 text-sm font-black text-[#7a3d1d]"
            onClick={() => router.push("/onboarding")}
            type="button"
          >
            <Pencil size={17} />
            Editar gustos
          </button>
          <button
            className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#251611] px-4 text-sm font-black text-white"
            onClick={logout}
            type="button"
          >
            <LogOut size={17} />
            Cerrar sesion
          </button>
        </div>
      </main>
    </AppShell>
  );
}

function ProfileSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-black/5">
      <h2 className="text-lg font-black">{title}</h2>
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </section>
  );
}
