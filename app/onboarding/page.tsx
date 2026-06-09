"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PreferenceChip } from "@/components/preference-chip";
import {
  AMBIENCE_OPTIONS,
  BUDGET_OPTIONS,
  DEFAULT_USER_NAME,
  FOOD_CATEGORIES,
  RANGE_OPTIONS,
  RESTRICTION_OPTIONS,
} from "@/lib/constants";
import { onboardingStorage, profileStorage, rangeStorage } from "@/lib/storage";
import type { BudgetLevel, SearchRange } from "@/lib/types";

const totalSteps = 5;

export default function OnboardingPage() {
  const router = useRouter();
  const current = useMemo(() => profileStorage.getOrDefault(), []);
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState(current.favoriteCategories);
  const [budget, setBudget] = useState<BudgetLevel>(current.budgetLevel);
  const [ambience, setAmbience] = useState(current.preferredAmbience);
  const [range, setRange] = useState<SearchRange>(current.preferredRange);
  const [restrictions, setRestrictions] = useState(current.restrictions);

  function toggle(value: string, values: string[], setter: (next: string[]) => void) {
    if (value === "Ninguna") {
      setter(["Ninguna"]);
      return;
    }
    const withoutNone = values.filter((item) => item !== "Ninguna");
    setter(
      withoutNone.includes(value)
        ? withoutNone.filter((item) => item !== value)
        : [...withoutNone, value],
    );
  }

  function finish() {
    const profile = {
      id: "demo-user",
      name: DEFAULT_USER_NAME,
      favoriteCategories: categories.length ? categories : ["Hamburguesas"],
      budgetLevel: budget,
      preferredAmbience: ambience.length ? ambience : ["Casual"],
      preferredRange: range,
      restrictions: restrictions.length ? restrictions : ["Ninguna"],
    };
    profileStorage.set(profile);
    rangeStorage.set(range);
    onboardingStorage.setCompleted(true);
    router.push("/");
  }

  return (
    <AppShell>
      <main className="min-h-screen px-5 py-6">
        <header className="flex items-center justify-between">
          <button
            className="grid size-11 place-items-center rounded-2xl bg-white text-[#251611] shadow-sm ring-1 ring-black/5"
            onClick={() => (step === 1 ? router.push("/login") : setStep(step - 1))}
            type="button"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="text-right">
            <p className="text-xs font-black uppercase text-[#a17057]">Paso {step}/{totalSteps}</p>
            <div className="mt-2 h-2 w-32 rounded-full bg-white">
              <div
                className="h-2 rounded-full bg-[#fa5a2a] transition-all"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </header>

        <section className="mt-10 space-y-6">
          {step === 1 ? (
            <Step title="Que se te antoja normalmente?">
              <ChipGrid
                items={FOOD_CATEGORIES}
                selected={categories}
                onToggle={(item) => toggle(item, categories, setCategories)}
              />
            </Step>
          ) : null}
          {step === 2 ? (
            <Step title="Cual es tu presupuesto normal?">
              <div className="grid grid-cols-3 gap-3">
                {BUDGET_OPTIONS.map((option) => (
                  <button
                    className={`min-h-24 rounded-[26px] text-3xl font-black ${
                      budget === option ? "bg-[#251611] text-white" : "bg-white text-[#251611]"
                    }`}
                    key={option}
                    onClick={() => setBudget(option)}
                    type="button"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </Step>
          ) : null}
          {step === 3 ? (
            <Step title="Que ambiente prefieres?">
              <ChipGrid
                items={AMBIENCE_OPTIONS}
                selected={ambience}
                onToggle={(item) => toggle(item, ambience, setAmbience)}
              />
            </Step>
          ) : null}
          {step === 4 ? (
            <Step title="Que distancia prefieres?">
              <div className="grid grid-cols-2 gap-3">
                {RANGE_OPTIONS.map((option) => (
                  <button
                    className={`min-h-20 rounded-[26px] text-base font-black ${
                      range === option.value ? "bg-[#251611] text-white" : "bg-white text-[#251611]"
                    }`}
                    key={option.value}
                    onClick={() => setRange(option.value)}
                    type="button"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </Step>
          ) : null}
          {step === 5 ? (
            <Step title="Restricciones opcionales">
              <ChipGrid
                items={RESTRICTION_OPTIONS}
                selected={restrictions}
                onToggle={(item) => toggle(item, restrictions, setRestrictions)}
              />
            </Step>
          ) : null}
        </section>

        <div className="fixed inset-x-0 bottom-0 mx-auto max-w-md bg-gradient-to-t from-[#f8f0e7] via-[#f8f0e7] to-transparent p-5">
          <button
            className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#fa5a2a] text-base font-black text-white shadow-lg shadow-[#fa5a2a33]"
            onClick={() => (step === totalSteps ? finish() : setStep(step + 1))}
            type="button"
          >
            {step === totalSteps ? "Guardar gustos" : "Continuar"}
            {step === totalSteps ? <Check size={20} /> : <ArrowRight size={20} />}
          </button>
        </div>
      </main>
    </AppShell>
  );
}

function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <h1 className="max-w-xs text-4xl font-black leading-tight text-[#251611]">{title}</h1>
      {children}
    </div>
  );
}

function ChipGrid({
  items,
  selected,
  onToggle,
}: {
  items: string[];
  selected: string[];
  onToggle: (item: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => (
        <PreferenceChip
          active={selected.includes(item)}
          key={item}
          label={item}
          onClick={() => onToggle(item)}
        />
      ))}
    </div>
  );
}
