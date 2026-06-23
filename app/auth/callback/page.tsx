"use client";

import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { readTokensFromHash, saveAuthTokens } from "@/lib/auth/supabase-auth";
import { defaultProfile, storage } from "@/lib/storage";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Validando activacion de cuenta...");

  useEffect(() => {
    async function finishLogin() {
      const query = new URLSearchParams(window.location.search);
      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const authError = query.get("error_description") ?? hash.get("error_description");
      const authErrorCode = query.get("error_code") ?? hash.get("error_code");
      if (authError) {
        setMessage(authErrorCode === "otp_expired" ? "El enlace de activacion expiro o ya fue usado. Crea la cuenta otra vez para recibir un enlace nuevo." : authError);
        return;
      }

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
        provider: "email",
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
          <Link className="grid min-h-11 place-items-center rounded-2xl bg-[var(--foreground)] px-4 text-sm font-black text-[var(--background)]" href="/register">
            Volver a registro
          </Link>
        </section>
      </main>
    </AppShell>
  );
}
