"use client";

import { User, Utensils } from "lucide-react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { storage } from "@/lib/storage";

export default function LoginPage() {
  const router = useRouter();
  function enterDemo() { storage.createDemoSession(); router.replace(storage.isOnboardingCompleted() ? "/" : "/onboarding"); }
  return <AppShell><main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-8"><section className="space-y-8 rounded-[2rem] bg-white p-6 shadow-xl shadow-[#ca5b281f]"><div className="space-y-5 text-center"><div className="mx-auto grid size-20 place-items-center rounded-3xl bg-[#fa5a2a] text-white shadow-lg shadow-[#fa5a2a33]"><Utensils size={36} strokeWidth={2.5} /></div><div><h1 className="text-4xl font-black text-[#251611]">FoodMood AI</h1><p className="mt-3 text-base font-semibold leading-7 text-[#6d5043]">Descubre que comer segun tu antojo</p></div></div><div className="space-y-3"><button className="min-h-14 w-full rounded-2xl bg-[#251611] px-5 text-base font-black text-white shadow-sm" onClick={enterDemo} type="button">Entrar como demo</button><button className="flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl border border-[#ead6c4] bg-white px-5 text-base font-black text-[#251611]" type="button"><User size={20} />Continuar con Google</button></div><p className="text-center text-xs font-semibold leading-5 text-[#9d7d6d]">Demo local sin Supabase, OpenAI ni datos sensibles.</p></section></main></AppShell>;
}
