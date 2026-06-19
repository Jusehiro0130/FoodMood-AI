import type { BudgetLevel, FoodIntent } from "@/lib/types";

function normalizeText(value: string) { return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
function includesAny(text: string, terms: string[]) { return terms.some((term) => text.includes(term)); }

export function parseFoodIntent(query: string): FoodIntent {
  const normalized = normalizeText(query);
  const categories = new Set<string>();
  const mood = new Set<string>();
  const keywords = new Set<string>();
  let budget: BudgetLevel | undefined;
  let distancePreference: FoodIntent["distancePreference"] = "anywhere";

  if (includesAny(normalized, ["barato", "barata", "economico", "economica"])) { budget = "$"; keywords.add("barato"); }
  if (includesAny(normalized, ["premium", "elegante", "fino"])) { budget = "$$$"; keywords.add("premium"); }
  if (includesAny(normalized, ["cita", "novia", "novio"])) { mood.add("Cita"); keywords.add("cita"); }
  if (includesAny(normalized, ["bonito", "lindo", "instagrameable"])) { mood.add("Bonito"); keywords.add("bonito"); }
  if (includesAny(normalized, ["rapido", "rapida", "apuro"])) { mood.add("Rapido"); keywords.add("rapido"); }
  if (includesAny(normalized, ["amigos", "grupo"])) { mood.add("Amigos"); keywords.add("amigos"); }
  if (includesAny(normalized, ["familia", "familiar", "ninos"])) { mood.add("Familiar"); keywords.add("familiar"); }
  if (includesAny(normalized, ["cerca", "cerquita", "cercano"])) { distancePreference = "near"; keywords.add("cerca"); }

  const rules: Array<[string, string[]]> = [
    ["Salchipapa", ["salchipapa", "papas locas", "papas"]], ["Italiana", ["italiana", "pasta", "lasagna", "risotto"]],
    ["Pizza", ["pizza", "pizzeria"]], ["Sushi", ["sushi", "roll", "rolls", "poke"]],
    ["Hamburguesas", ["hamburguesa", "burger", "hamburguesas"]], ["Mexicana", ["taco", "tacos", "burrito", "mexicana"]],
    ["Comida panamena", ["panamena", "criollo", "fonda", "hojaldre"]], ["Saludable", ["saludable", "fit", "ensalada", "vegetariano"]],
    ["Postres", ["postre", "dulce", "helado", "waffle"]], ["Mariscos", ["mariscos", "ceviche", "pescado"]],
    ["Ramen", ["ramen", "noodles"]], ["Wings", ["wings", "alitas", "boneless"]],
  ];
  rules.forEach(([category, terms]) => { if (includesAny(normalized, terms)) { categories.add(category); keywords.add(terms[0]); } });
  if (normalized.includes("no se que comer") || normalized.includes("sorprendeme")) keywords.add("antojo abierto");
  return { query, categories: Array.from(categories), mood: Array.from(mood), budget, distancePreference, keywords: Array.from(keywords) };
}
