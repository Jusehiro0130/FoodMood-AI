"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { readTokensFromHash, saveAuthTokens } from "@/lib/auth/supabase-auth";
import { defaultProfile, storage } from "@/lib/storage";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Validando sesion con Google...");

  useEffect(() => {
    async function finishLogin() {
      const tokens = readTokensFromHash(window.location.hash);
      if (!tokens) {
        setMessage("No se recibio una sesion valida. Vuelve a iniciar sesion.");
        return;
      }

      saveAuthTokens(tokens);
      const response = await fetch("/api/auth/session", {
        headers: { authorization: `Bearer ${tokens.accessToken}` },
      });

      if (!response.ok) {
        setMessage("No se pudo validar la sesion con Supabase.");
        return;
      }

      const data = await response.json() as {
        user: { id: string; email?: string; name: string; avatarUrl?: string; role: "user" | "admin" };
      };
      storage.saveSession({
        userId: data.user.id,
        name: data.user.name,
        email: data.user.email,
        avatarUrl: data.user.avatarUrl,
        accessToken: tokens.accessToken,
        createdAt: new Date().toISOString(),
        provider: "google",
        role: data.user.role,
      });
      if (!storage.getProfile()) {
        storage.saveProfile({ ...defaultProfile, id: data.user.id, name: data.user.name });
      }
      router.replace(storage.isOnboardingCompleted() ? "/" : "/onboarding");
    }

    finishLogin();
  }, [router]);

  return (
    <AppShell>
      <main className="grid min-h-screen place-items-center px-5">
        <section className="flex max-w-sm flex-col items-center gap-4 rounded-[2rem] border border-[var(--border)] bg-[var(--surface-raised)] p-6 text-center shadow-[var(--app-shadow)]">
          <LoaderCircle className="animate-spin text-[var(--brand)]" size={32} />
          <p className="text-sm font-black text-[var(--muted-strong)]">{message}</p>
        </section>
      </main>
    </AppShell>
  );
}
