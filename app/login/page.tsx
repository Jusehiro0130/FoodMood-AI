"use client";

import { LogIn, UserRound, Utensils } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { saveAuthTokens } from "@/lib/auth/supabase-auth";
import { defaultProfile, storage } from "@/lib/storage";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/auth/password", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(data.error ?? "No se pudo iniciar sesion.");
      return;
    }

    saveAuthTokens({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresAt: data.expiresIn ? Date.now() + data.expiresIn * 1000 : undefined,
    });
    storage.saveSession({
      userId: data.user.id,
      name: data.user.name,
      email: data.user.email,
      accessToken: data.accessToken,
      createdAt: new Date().toISOString(),
      provider: "email",
      role: data.user.role,
    });
    if (!storage.getProfile()) {
      storage.saveProfile({ ...defaultProfile, id: data.user.id, name: data.user.name });
    }
    router.replace(storage.isOnboardingCompleted() ? "/" : "/onboarding");
  }

  function enterAsGuest() {
    storage.saveGuestSession();
    router.replace("/");
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
              <p className="mt-3 text-base font-semibold leading-7 text-[var(--muted)]">Entra con tu correo para guardar gustos, historial y recomendaciones.</p>
            </div>
          </div>

          <form className="space-y-3" onSubmit={login}>
            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-[var(--muted)]">Correo</span>
              <input className="min-h-13 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 text-sm font-bold outline-none" onChange={(event) => setEmail(event.target.value)} required type="email" value={email} />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-[var(--muted)]">Contrasena</span>
              <input className="min-h-13 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 text-sm font-bold outline-none" minLength={8} onChange={(event) => setPassword(event.target.value)} required type="password" value={password} />
            </label>
            <button className="flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[var(--foreground)] px-5 text-base font-black text-[var(--background)] shadow-sm disabled:opacity-50" disabled={loading} type="submit">
              <LogIn size={20} />
              {loading ? "Entrando..." : "Iniciar sesion"}
            </button>
          </form>

          {message ? <p className="text-center text-xs font-black leading-5 text-[var(--brand)]">{message}</p> : null}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-[var(--border)]" />
            <span className="text-xs font-black uppercase tracking-[0.14em] text-[var(--muted)]">o</span>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>
          <button className="flex min-h-13 w-full items-center justify-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-5 text-sm font-black text-[var(--foreground)]" onClick={enterAsGuest} type="button">
            <UserRound size={18} />
            Entrar como invitado
          </button>
          <p className="text-center text-xs font-semibold leading-5 text-[var(--muted)]">Como invitado puedes explorar sin guardar preferencias, historial ni favoritos.</p>
          <p className="text-center text-xs font-semibold leading-5 text-[var(--muted)]">
            No tienes cuenta? <Link className="font-black text-[var(--brand)]" href="/register">Crea una aqui</Link>.
          </p>
        </section>
      </main>
    </AppShell>
  );
}
