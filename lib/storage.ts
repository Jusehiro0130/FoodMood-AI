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
function currentSession() { return readJson<DemoSession | null>(keys.session, null); }
function isGuest() { return currentSession()?.provider === "guest"; }

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
    const session = currentSession();
    return session?.provider === "email" || session?.provider === "guest" ? session : null;
  },
  saveGuestSession() {
    const session: DemoSession = {
      userId: "guest-user",
      name: "Invitado",
      createdAt: new Date().toISOString(),
      provider: "guest",
      role: "user",
    };
    writeJson(keys.session, session);
    return session;
  },
  isGuestSession() { return isGuest(); },
  clearSession() { if (canUseStorage()) window.localStorage.removeItem(keys.session); },
  getProfile() { return isGuest() ? { ...defaultProfile, id: "guest-user", name: "Invitado" } : readJson<UserProfile | null>(keys.profile, null); },
  saveProfile(profile: UserProfile) { if (!isGuest()) writeJson(keys.profile, profile); },
  isOnboardingCompleted() { return isGuest() || readJson<boolean>(keys.onboarding, false); },
  setOnboardingCompleted(value: boolean) { if (!isGuest()) writeJson(keys.onboarding, value); },
  getFavorites() { return isGuest() ? [] : readJson<string[]>(keys.favorites, []); },
  saveFavorites(ids: string[]) { if (!isGuest()) writeJson(keys.favorites, Array.from(new Set(ids))); },
  toggleFavorite(id: string) { if (isGuest()) return []; const favorites = this.getFavorites(); const next = favorites.includes(id) ? favorites.filter((item) => item !== id) : [...favorites, id]; this.saveFavorites(next); return next; },
  getSearchHistory() { return isGuest() ? [] : readJson<SearchHistoryItem[]>(keys.history, []); },
  addSearchHistory(item: SearchHistoryItem) { if (isGuest()) return []; const next = [item, ...this.getSearchHistory()].slice(0, 20); writeJson(keys.history, next); return next; },
  getRange() { return isGuest() ? "5km" : readJson<SearchRange>(keys.range, "5km"); },
  saveRange(range: SearchRange) { if (!isGuest()) writeJson(keys.range, range); },
  logout() { if (canUseStorage()) { window.localStorage.removeItem(keys.session); window.localStorage.removeItem(keys.supabaseAuth); } },
};
