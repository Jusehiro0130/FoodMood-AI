"use client";

import { User, Utensils } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { getGoogleLoginUrl } from "@/lib/auth/supabase-auth";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function enterWithGoogle() {
    setLoading(true);
    setError("");
    const response = await fetch("/api/auth/config", { cache: "no-store" });
    if (!response.ok) {
      setLoading(false);
      setError("Falta configurar SUPABASE_URL en Vercel.");
      return;
    }
    const data = await response.json() as { supabaseUrl: string };
    const loginUrl = getGoogleLoginUrl(window.location.origin, data.supabaseUrl);
    if (loginUrl) window.location.href = loginUrl;
  }

  return (
    <AppShell>
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-8">
        <section className="space-y-8 rounded-[2rem] border border-[var(--border)] bg-[var(--surface-raised)] p-6 shadow-[var(--app-shadow)]">
          <div className="space-y-5 text-center">
            <div className="mx-auto grid size-20 place-items-center rounded-3xl bg-[var(--brand)] text-white shadow-lg shadow-[#fa5a2a33]">
              <Utensils size={36} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-[var(--foreground)]">FoodMood AI</h1>
              <p className="mt-3 text-base font-semibold leading-7 text-[var(--muted)]">Decide rapido, guarda gustos y prueba recomendaciones locales.</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              className="flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[var(--foreground)] px-5 text-base font-black text-[var(--background)] shadow-sm disabled:opacity-50"
              disabled={loading}
              onClick={enterWithGoogle}
              type="button"
            >
              <User size={20} />
              {loading ? "Conectando..." : "Continuar con Google"}
            </button>
          </div>

          <p className="text-center text-xs font-semibold leading-5 text-[var(--muted)]">
            Inicia sesion con Google para guardar tus gustos y tu historial en FoodMood.
          </p>
          {error ? <p className="text-center text-xs font-black text-[var(--brand)]">{error}</p> : null}
        </section>
      </main>
    </AppShell>
  );
}
