"use client";

import { useRouter } from "next/navigation";
import { CircleUserRound, Sparkles, Utensils } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { demoSession, onboardingStorage } from "@/lib/storage";

export default function LoginPage() {
  const router = useRouter();

  function enterDemo() {
    demoSession.login();
    router.push(onboardingStorage.isCompleted() ? "/" : "/onboarding");
  }

  return (
    <AppShell>
      <main className="flex min-h-screen flex-col justify-between px-6 py-8">
        <div className="flex justify-end">
          <span className="rounded-full bg-white px-4 py-2 text-xs font-black text-[#7b5545] shadow-sm ring-1 ring-black/5">
            Mockup MVP
          </span>
        </div>

        <section className="space-y-8">
          <div className="grid size-20 place-items-center rounded-[28px] bg-[#fa5a2a] text-white shadow-xl shadow-[#fa5a2a45]">
            <Utensils size={38} strokeWidth={2.4} />
          </div>
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#fff0d8] px-4 py-2 text-sm font-black text-[#7a3d1d]">
              <Sparkles size={16} />
              Decide sin pensarlo tanto
            </div>
            <div>
              <h1 className="text-5xl font-black leading-tight text-[#251611]">
                FoodMood AI
              </h1>
              <p className="mt-3 text-lg leading-7 text-[#6d5043]">
                Descubre que comer segun tu antojo
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <button
            className="flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#251611] px-5 text-base font-black text-white shadow-lg shadow-black/10"
            onClick={enterDemo}
            type="button"
          >
            Entrar como demo
          </button>
          <button
            className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 text-base font-black text-[#251611] shadow-sm ring-1 ring-black/5"
            type="button"
          >
            <CircleUserRound size={20} />
            Continuar con Google
          </button>
          <p className="px-2 text-center text-xs leading-5 text-[#8a6b5e]">
            Es un mockup navegable. No conecta Supabase, Google ni OpenAI.
          </p>
        </section>
      </main>
    </AppShell>
  );
}
