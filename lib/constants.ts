import type { BudgetLevel, SearchRange } from "@/lib/types";

export const DEFAULT_USER_NAME = "Juan";

export const FOOD_CATEGORIES = [
  "Hamburguesas",
  "Pizza",
  "Sushi",
  "Italiana",
  "Mexicana",
  "Comida panamena",
  "Comida rapida",
  "Saludable",
  "Postres",
  "Mariscos",
  "Salchipapa",
];

export const AMBIENCE_OPTIONS = [
  "Casual",
  "Cita",
  "Amigos",
  "Familiar",
  "Rapido",
  "Bonito",
  "Tranquilo",
];

export const RESTRICTION_OPTIONS = [
  "Vegetariano",
  "Sin cerdo",
  "Sin mariscos",
  "Saludable",
  "Ninguna",
];

export const BUDGET_OPTIONS: BudgetLevel[] = ["$", "$$", "$$$"];

export const RANGE_OPTIONS: Array<{ label: string; value: SearchRange; km: number }> = [
  { label: "2 km", value: "2km", km: 2 },
  { label: "5 km", value: "5km", km: 5 },
  { label: "10 km", value: "10km", km: 10 },
  { label: "Toda", value: "city", km: 99 },
];

export const QUICK_SEARCHES = [
  "No se que comer",
  "Salchipapa barata cerca",
  "Italiana para una cita",
  "Algo rapido y economico",
  "Hamburguesa grande cerca",
];

export function getRangeKm(range: SearchRange) {
  return RANGE_OPTIONS.find((option) => option.value === range)?.km ?? 99;
}
