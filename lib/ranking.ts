import { getRangeKm } from "@/lib/constants";
import { getRecurringUserPreferences } from "@/lib/user-preferences";
import type {
  FoodIntent,
  MatchResult,
  Restaurant,
  SearchHistoryItem,
  SearchRange,
  UserProfile,
} from "@/lib/types";

function intersects(a: string[], b: string[]) {
  return a.some((item) => b.includes(item));
}

export function calculateRestaurantMatch(
  restaurant: Restaurant,
  userProfile: UserProfile,
  foodIntent: FoodIntent | null,
  selectedRange: SearchRange,
  searchHistory: SearchHistoryItem[] = [],
): MatchResult {
  const reasons: string[] = [];
  let score = 0;
  const rangeKm = getRangeKm(selectedRange);
  const insideRange = restaurant.distanceKm <= rangeKm;

  if (!insideRange) {
    score -= 25;
    reasons.push(`Esta a ${restaurant.distanceKm.toFixed(1)} km, fuera del rango elegido.`);
  }

  if (foodIntent?.categories.length && intersects(restaurant.categories, foodIntent.categories)) {
    score += 30;
    reasons.push(`Encaja con ${foodIntent.categories.join(", ")}.`);
  }

  if (intersects(restaurant.categories, userProfile.favoriteCategories)) {
    score += 20;
    reasons.push("Coincide con tus gustos guardados.");
  }

  if (foodIntent?.budget) {
    if (restaurant.priceLevel === foodIntent.budget) {
      score += 15;
      reasons.push("Esta dentro del presupuesto que pediste.");
    }
  } else if (restaurant.priceLevel === userProfile.budgetLevel) {
    score += 15;
    reasons.push("Va con tu presupuesto normal.");
  }

  const requestedMood = foodIntent?.mood.length
    ? foodIntent.mood
    : userProfile.preferredAmbience;
  if (intersects(restaurant.ambience, requestedMood)) {
    score += 15;
    reasons.push(`Tiene ambiente ${restaurant.ambience.slice(0, 2).join(" y ")}.`);
  }

  if (insideRange) {
    score += 10;
    reasons.push(`Esta a ${restaurant.distanceKm.toFixed(1)} km.`);
  }

  if (restaurant.rating >= 4.5) {
    score += 5;
    reasons.push(`Tiene rating ${restaurant.rating.toFixed(1)}.`);
  }

  if (restaurant.instagram) {
    score += 5;
    reasons.push("Tiene Instagram para verlo antes de ir.");
  }

  const recurring = getRecurringUserPreferences(searchHistory);
  if (intersects(restaurant.categories, recurring.frequentCategories)) {
    score += 5;
    reasons.push("Tambien aparece en tus antojos frecuentes.");
  }

  if (!foodIntent?.categories.length && foodIntent?.query.toLowerCase().includes("no se")) {
    score += restaurant.rating >= 4.6 ? 10 : 0;
    reasons.push("Buena opcion cuando no sabes que comer.");
  }

  return {
    score: Math.max(0, Math.min(100, Math.round(score))),
    reasons: reasons.slice(0, 4),
  };
}
