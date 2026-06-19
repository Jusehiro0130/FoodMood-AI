import type { FoodIntent, MatchResult, Restaurant, SearchHistoryItem, SearchRange, UserProfile } from "@/lib/types";
import { getRecurringUserPreferences } from "@/lib/user-preferences";

export function rangeToKm(range: SearchRange) { return range === "city" ? Number.POSITIVE_INFINITY : Number(range.replace("km", "")); }
function hasOverlap(left: string[], right: string[]) { return left.some((value) => right.includes(value)); }

export function calculateRestaurantMatch(restaurant: Restaurant, userProfile: UserProfile, foodIntent: FoodIntent | null, selectedRange: SearchRange, searchHistory: SearchHistoryItem[] = []): MatchResult {
  let score = 0;
  const reasons: string[] = [];
  const recurring = getRecurringUserPreferences(searchHistory);
  if (foodIntent?.categories.length && hasOverlap(restaurant.categories, foodIntent.categories)) { score += 30; reasons.push(`Coincide con ${foodIntent.categories.join(", ")}`); }
  if (hasOverlap(restaurant.categories, userProfile.favoriteCategories)) { score += 20; reasons.push("Encaja con tus gustos guardados"); }
  if (restaurant.priceLevel === (foodIntent?.budget ?? userProfile.budgetLevel)) { score += 15; reasons.push(`Presupuesto compatible ${restaurant.priceLevel}`); }
  const desiredAmbience = foodIntent?.mood.length ? foodIntent.mood : userProfile.preferredAmbience;
  if (hasOverlap(restaurant.ambience, desiredAmbience)) { score += 15; reasons.push(`Ambiente ${restaurant.ambience.filter((item) => desiredAmbience.includes(item))[0]}`); }
  if (restaurant.distanceKm <= rangeToKm(selectedRange)) { score += 10; reasons.push("Esta dentro de tu rango"); }
  if (restaurant.rating >= 4.5) { score += 5; reasons.push(`Muy buen rating ${restaurant.rating.toFixed(1)}`); }
  if (restaurant.instagram) { score += 5; reasons.push("Tiene Instagram para revisar el lugar"); }
  if (hasOverlap(restaurant.categories, recurring.categories) || hasOverlap(restaurant.ambience, recurring.ambience) || (recurring.budget && recurring.budget === restaurant.priceLevel)) { score += 5; reasons.push("Se parece a tus busquedas frecuentes"); }
  if (!foodIntent?.categories.length && !foodIntent?.mood.length && !foodIntent?.budget) { score += Math.min(10, Math.round(restaurant.rating)); reasons.push("Buena opcion para explorar sin decidir mucho"); }
  return { score: Math.min(100, score), reasons: reasons.slice(0, 3) };
}

export function rankRestaurants(restaurants: Restaurant[], userProfile: UserProfile, foodIntent: FoodIntent | null, selectedRange: SearchRange, searchHistory: SearchHistoryItem[] = []) {
  return restaurants
    .map((restaurant) => ({ ...restaurant, match: calculateRestaurantMatch(restaurant, userProfile, foodIntent, selectedRange, searchHistory) }))
    .filter((restaurant) => selectedRange === "city" || restaurant.distanceKm <= rangeToKm(selectedRange))
    .sort((a, b) => b.match.score - a.match.score || a.distanceKm - b.distanceKm);
}
