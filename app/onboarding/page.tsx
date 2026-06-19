"use client";

import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { PreferenceChip } from "@/components/preference-chip";
import { defaultProfile, storage } from "@/lib/storage";
import type { BudgetLevel, SearchRange, UserProfile } from "@/lib/types";

const steps = [
  { title: "Tipos de comida favoritos", helper: "Elige todos los que te emocionen.", key: "favoriteCategories", multiple: true, options: ["Hamburguesas","Pizza","Sushi","Italiana","Mexicana","Comida panamena","Comida rapida","Saludable","Postres","Mariscos","Salchipapa"] },
  { title: "Presupuesto", helper: "Tu nivel usual para comer afuera.", key: "budgetLevel", multiple: false, options: ["$","$$","$$$"] },
  { title: "Ambiente", helper: "Como te gusta que se sienta el plan.", key: "preferredAmbience", multiple: true, options: ["Casual","Cita","Amigos","Familiar","Rapido","Bonito","Tranquilo"] },
  { title: "Distancia preferida", helper: "Hasta donde te moverias normalmente.", key: "preferredRange", multiple: false, options: ["2km","5km","10km","city"] },
  { title: "Restricciones", helper: "Para evitar recomendaciones incomodas.", key: "restrictions", multiple: true, options: ["Vegetariano","Sin cerdo","Sin mariscos","Saludable","Ninguna"] },
] as const;
function rangeLabel(value: string) { return value === "city" ? "Toda la ciudad" : value.replace("km", " km"); }

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  useEffect(() => { if (!storage.getSession()) storage.createDemoSession(); setProfile(storage.getProfile() ?? defaultProfile); }, []);
  const currentStep = steps[step];
  const progress = Math.round(((step + 1) / steps.length) * 100);
  function toggleArrayValue(field: "favoriteCategories" | "preferredAmbience" | "restrictions", value: string) { setProfile((current) => { const selected = current[field]; const next = selected.includes(value) && selected.length > 1 ? selected.filter((item) => item !== value) : Array.from(new Set([...selected.filter((item) => !(value === "Ninguna" && item !== value)), value])); return { ...current, [field]: value !== "Ninguna" ? next.filter((item) => item !== "Ninguna") : ["Ninguna"] }; }); }
  function selectSingle(value: string) { if (currentStep.key === "budgetLevel") setProfile((current) => ({ ...current, budgetLevel: value as BudgetLevel })); if (currentStep.key === "preferredRange") setProfile((current) => ({ ...current, preferredRange: value as SearchRange })); }
  function isActive(value: string) { if (currentStep.key === "favoriteCategories") return profile.favoriteCategories.includes(value); if (currentStep.key === "preferredAmbience") return profile.preferredAmbience.includes(value); if (currentStep.key === "restrictions") return profile.restrictions.includes(value); if (currentStep.key === "budgetLevel") return profile.budgetLevel === value; return profile.preferredRange === value; }
  function handleOption(value: string) { if (currentStep.key === "favoriteCategories" || currentStep.key === "preferredAmbience" || currentStep.key === "restrictions") toggleArrayValue(currentStep.key, value); else selectSingle(value); }
  function finish() { storage.saveProfile(profile); storage.saveRange(profile.preferredRange); storage.setOnboardingCompleted(true); router.replace("/"); }
  return <AppShell><main className="mx-auto flex min-h-screen max-w-xl flex-col px-5 py-6"><header className="space-y-4"><div className="flex items-center justify-between text-sm font-black text-[#7b5545]"><span>Paso {step + 1} de {steps.length}</span><span>{progress}%</span></div><div className="h-2 rounded-full bg-[#f1e4d7]"><div className="h-full rounded-full bg-[#fa5a2a]" style={{ width: `${progress}%` }} /></div></header><section className="mt-10 flex flex-1 flex-col justify-between gap-8 rounded-[2rem] bg-white p-5 shadow-sm"><div className="space-y-6"><div><h1 className="text-3xl font-black leading-tight">{currentStep.title}</h1><p className="mt-2 text-sm font-semibold leading-6 text-[#7b5545]">{currentStep.helper}</p></div><div className="flex flex-wrap gap-2">{currentStep.options.map((option) => <PreferenceChip active={isActive(option)} key={option} label={rangeLabel(option)} onClick={() => handleOption(option)} />)}</div></div><div className="grid grid-cols-[auto_1fr] gap-3"><button className="grid min-h-14 place-items-center rounded-2xl border border-[#ead6c4] px-4 text-[#7b5545] disabled:opacity-40" disabled={step === 0} onClick={() => setStep((current) => Math.max(0, current - 1))} type="button"><ArrowLeft size={22} /></button><button className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#251611] px-5 text-base font-black text-white" onClick={step === steps.length - 1 ? finish : () => setStep((current) => current + 1)} type="button">{step === steps.length - 1 ? "Finalizar" : "Siguiente"}{step === steps.length - 1 ? <Check size={20} /> : <ArrowRight size={20} />}</button></div></section></main></AppShell>;
}
