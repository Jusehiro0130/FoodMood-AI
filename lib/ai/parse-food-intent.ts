import type { BudgetLevel, FoodIntent } from "@/lib/types";

const categoryRules: Array<{ category: string; words: string[] }> = [
  { category: "Salchipapa", words: ["salchipapa", "salchi", "papas"] },
  { category: "Hamburguesas", words: ["hamburguesa", "burger", "hamburguesas"] },
  { category: "Italiana", words: ["italiana", "pasta", "risotto", "trattoria"] },
  { category: "Pizza", words: ["pizza", "pizzeria"] },
  { category: "Sushi", words: ["sushi", "roll", "rolls", "japonesa"] },
  { category: "Mexicana", words: ["mexicana", "taco", "tacos", "burrito", "nachos"] },
  { category: "Comida panamena", words: ["panamena", "criollo", "sancocho", "hojaldre"] },
  { category: "Comida rapida", words: ["rapido", "fast", "combo", "hot dog"] },
  { category: "Saludable", words: ["saludable", "fit", "bowl", "vegetariano"] },
  { category: "Postres", words: ["postre", "dulce", "cafe", "waffle"] },
  { category: "Mariscos", words: ["marisco", "mariscos", "ceviche", "pescado"] },
  { category: "Ramen", words: ["ramen"] },
  { category: "Wings", words: ["wings", "alitas"] },
];

const moodRules: Array<{ mood: string; words: string[] }> = [
  { mood: "Cita", words: ["cita", "novia", "novio", "romantico"] },
  { mood: "Bonito", words: ["bonito", "lindo", "fancy", "instagrameable"] },
  { mood: "Rapido", words: ["rapido", "rapida", "ya", "express"] },
  { mood: "Amigos", words: ["amigos", "grupo", "compartir"] },
  { mood: "Familiar", words: ["familia", "familiar", "ninos"] },
  { mood: "Tranquilo", words: ["tranquilo", "calmado", "relajado"] },
  { mood: "Casual", words: ["casual", "normal", "relax"] },
];

const budgetRules: Array<{ budget: BudgetLevel; words: string[] }> = [
  { budget: "$", words: ["barato", "barata", "economico", "economica", "budget"] },
  { budget: "$$", words: ["medio", "normal"] },
  { budget: "$$$", words: ["caro", "premium", "fino", "elegante"] },
];

function normalize(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function hasAnyWord(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

export function parseFoodIntent(input: string): FoodIntent {
  const normalized = normalize(input);
  const categories = categoryRules
    .filter((rule) => hasAnyWord(normalized, rule.words))
    .map((rule) => rule.category);
  const mood = moodRules
    .filter((rule) => hasAnyWord(normalized, rule.words))
    .map((rule) => rule.mood);
  const budget = budgetRules.find((rule) => hasAnyWord(normalized, rule.words))?.budget;
  const distancePreference = /(cerca|cercano|cercana|near|al lado)/.test(normalized)
    ? "near"
    : "anywhere";
  const keywords = Array.from(
    new Set(
      normalized
        .split(/[^a-z0-9$]+/)
        .map((word) => word.trim())
        .filter((word) => word.length > 2),
    ),
  );

  return {
    query: input,
    categories: Array.from(new Set(categories)),
    mood: Array.from(new Set(mood)),
    budget,
    distancePreference,
    keywords,
  };
}
