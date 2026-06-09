"use client";

import { DEFAULT_USER_NAME } from "@/lib/constants";
import type {
  FoodIntent,
  Restaurant,
  SearchHistoryItem,
  SearchRange,
  UserProfile,
} from "@/lib/types";

const keys = {
  session: "foodmood:session",
  onboarding: "foodmood:onboarding",
  profile: "foodmood:profile",
  favorites: "foodmood:favorites",
  history: "foodmood:history",
  range: "foodmood:range",
};

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event("foodmood-storage"));
}

export const demoSession = {
  isLoggedIn() {
    return readJson<boolean>(keys.session, false);
  },
  login() {
    writeJson(keys.session, true);
  },
  logout() {
    if (!canUseStorage()) return;
    window.localStorage.removeItem(keys.session);
    window.dispatchEvent(new Event("foodmood-storage"));
  },
};

export const onboardingStorage = {
  isCompleted() {
    return readJson<boolean>(keys.onboarding, false);
  },
  setCompleted(value: boolean) {
    writeJson(keys.onboarding, value);
  },
};

export const profileStorage = {
  get(): UserProfile | null {
    return readJson<UserProfile | null>(keys.profile, null);
  },
  set(profile: UserProfile) {
    writeJson(keys.profile, profile);
  },
  getOrDefault(): UserProfile {
    return (
      profileStorage.get() ?? {
        id: "demo-user",
        name: DEFAULT_USER_NAME,
        favoriteCategories: ["Hamburguesas", "Salchipapa", "Italiana"],
        budgetLevel: "$$",
        preferredAmbience: ["Casual", "Amigos"],
        preferredRange: "5km",
        restrictions: ["Ninguna"],
      }
    );
  },
};

export const favoritesStorage = {
  getIds(): string[] {
    return readJson<string[]>(keys.favorites, []);
  },
  isFavorite(id: Restaurant["id"]) {
    return favoritesStorage.getIds().includes(id);
  },
  toggle(id: Restaurant["id"]) {
    const ids = favoritesStorage.getIds();
    const next = ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id];
    writeJson(keys.favorites, next);
    return next;
  },
};

export const historyStorage = {
  get(): SearchHistoryItem[] {
    return readJson<SearchHistoryItem[]>(keys.history, []);
  },
  add(query: string, parsedIntent: FoodIntent) {
    const next: SearchHistoryItem[] = [
      {
        id: crypto.randomUUID(),
        query,
        parsedIntent,
        createdAt: new Date().toISOString(),
      },
      ...historyStorage.get(),
    ].slice(0, 20);
    writeJson(keys.history, next);
    return next;
  },
};

export const rangeStorage = {
  get(): SearchRange {
    return readJson<SearchRange>(keys.range, profileStorage.getOrDefault().preferredRange);
  },
  set(range: SearchRange) {
    writeJson(keys.range, range);
  },
};
