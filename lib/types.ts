export type BudgetLevel = "$" | "$$" | "$$$";

export type SearchRange = "2km" | "5km" | "10km" | "city";

export type UserProfile = {
  id: string;
  name: string;
  favoriteCategories: string[];
  budgetLevel: BudgetLevel;
  preferredAmbience: string[];
  preferredRange: SearchRange;
  restrictions: string[];
};

export type Restaurant = {
  id: string;
  name: string;
  description: string;
  categories: string[];
  tags: string[];
  priceLevel: BudgetLevel;
  ambience: string[];
  instagram: string;
  whatsapp?: string;
  address: string;
  zone: string;
  distanceKm: number;
  rating: number;
  openingHours: string;
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
};

export type FoodIntent = {
  query: string;
  categories: string[];
  mood: string[];
  budget?: BudgetLevel;
  distancePreference?: "near" | "anywhere";
  keywords: string[];
};

export type SearchHistoryItem = {
  id: string;
  query: string;
  parsedIntent: FoodIntent;
  createdAt: string;
};

export type MatchResult = {
  score: number;
  reasons: string[];
};
