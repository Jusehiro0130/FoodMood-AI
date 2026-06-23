import type { DemoSession, SearchHistoryItem, SearchRange, UserProfile } from "@/lib/types";

const keys = {
  session: "foodmood.demoSession",
  profile: "foodmood.userProfile",
  favorites: "foodmood.favorites",
  history: "foodmood.searchHistory",
  onboarding: "foodmood.onboardingCompleted",
  range: "foodmood.selectedRange",
  supabaseAuth: "foodmood.supabaseAuth",
} as const;

function canUseStorage() { return typeof window !== "undefined" && typeof window.localStorage !== "undefined"; }
function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;
  try { const value = window.localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback; } catch { return fallback; }
}
function writeJson<T>(key: string, value: T) { if (canUseStorage()) window.localStorage.setItem(key, JSON.stringify(value)); }

export const defaultProfile: UserProfile = {
  id: "demo-user",
  name: "Juan",
  favoriteCategories: ["Hamburguesas", "Italiana", "Salchipapa"],
  budgetLevel: "$$",
  preferredAmbience: ["Casual", "Amigos"],
  preferredRange: "5km",
  restrictions: ["Ninguna"],
};

export const storage = {
  saveSession(session: DemoSession) { writeJson(keys.session, session); return session; },
  getSession() {
    const session = readJson<DemoSession | null>(keys.session, null);
    return session?.provider === "google" ? session : null;
  },
  clearSession() { if (canUseStorage()) window.localStorage.removeItem(keys.session); },
  getProfile() { return readJson<UserProfile | null>(keys.profile, null); },
  saveProfile(profile: UserProfile) { writeJson(keys.profile, profile); },
  isOnboardingCompleted() { return readJson<boolean>(keys.onboarding, false); },
  setOnboardingCompleted(value: boolean) { writeJson(keys.onboarding, value); },
  getFavorites() { return readJson<string[]>(keys.favorites, []); },
  saveFavorites(ids: string[]) { writeJson(keys.favorites, Array.from(new Set(ids))); },
  toggleFavorite(id: string) { const favorites = this.getFavorites(); const next = favorites.includes(id) ? favorites.filter((item) => item !== id) : [...favorites, id]; this.saveFavorites(next); return next; },
  getSearchHistory() { return readJson<SearchHistoryItem[]>(keys.history, []); },
  addSearchHistory(item: SearchHistoryItem) { const next = [item, ...this.getSearchHistory()].slice(0, 20); writeJson(keys.history, next); return next; },
  getRange() { return readJson<SearchRange>(keys.range, "5km"); },
  saveRange(range: SearchRange) { writeJson(keys.range, range); },
  logout() { if (canUseStorage()) { window.localStorage.removeItem(keys.session); window.localStorage.removeItem(keys.supabaseAuth); } },
};
