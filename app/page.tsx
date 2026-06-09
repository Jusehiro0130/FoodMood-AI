import { MapPin, Sparkles, Utensils } from "lucide-react";
import { AppShell } from "@/components/app-shell";

const cravingExamples = [
  "No se que comer",
  "Salchipapa barata cerca",
  "Italiana para una cita",
  "Algo rapido y economico",
];

export default function Home() {
  return (
    <AppShell>
      <section className="flex min-h-screen flex-col justify-between gap-10 px-5 py-6 sm:px-8 lg:mx-auto lg:max-w-5xl lg:py-10">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-[#fa5a2a] text-white shadow-sm">
              <Utensils size={22} strokeWidth={2.4} />
            </div>
            <div>
              <p className="text-sm font-medium text-[#7b5545]">MVP setup</p>
              <h1 className="text-xl font-bold tracking-normal text-[#251611]">
                FoodMood AI
              </h1>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1 rounded-full bg-white px-3 py-2 text-sm font-medium text-[#5f463b] shadow-sm ring-1 ring-black/5">
            <MapPin size={16} />
            Panama
          </div>
        </header>

        <main className="flex flex-1 flex-col justify-center gap-8">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#fff0d8] px-4 py-2 text-sm font-semibold text-[#7a3d1d] ring-1 ring-[#f0c796]">
              <Sparkles size={16} />
              Recomendador inteligente de comida
            </div>
            <div className="max-w-3xl space-y-4">
              <h2 className="text-4xl font-black leading-tight tracking-normal text-[#251611] sm:text-5xl lg:text-6xl">
                Decide que comer segun tu antojo.
              </h2>
              <p className="max-w-xl text-base leading-7 text-[#6d5043] sm:text-lg">
                Una base lista para construir el MVP de FoodMood AI: Next.js,
                TypeScript, Tailwind CSS, PNPM y una experiencia mobile-first.
              </p>
            </div>
          </div>

          <div className="rounded-[28px] bg-white p-4 shadow-xl shadow-[#ca5b2817] ring-1 ring-black/5 sm:p-5">
            <div className="rounded-[22px] border border-dashed border-[#e8c5a7] bg-[#fffaf2] p-4">
              <p className="text-sm font-semibold text-[#7b5545]">
                Pronto podras escribir:
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {cravingExamples.map((example) => (
                  <span
                    className="rounded-full bg-white px-3 py-2 text-sm font-medium text-[#3d2a22] shadow-sm ring-1 ring-black/5"
                    key={example}
                  >
                    {example}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </main>

        <footer className="rounded-3xl bg-[#251611] p-4 text-sm text-[#ffe5cf] shadow-lg">
          Fase actual: proyecto base. Login, onboarding, restaurantes e IA se
          agregaran en ramas separadas.
        </footer>
      </section>
    </AppShell>
  );
}
