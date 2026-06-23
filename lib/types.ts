export type BudgetLevel = "$" | "$$" | "$$$" | "$$$$";
export type SearchRange = "2km" | "5km" | "10km" | "city";
export type AppRole = "user" | "admin";

export type DemoSession = {
  userId: string;
  name: string;
  createdAt: string;
  provider?: "email";
  email?: string;
  avatarUrl?: string;
  accessToken?: string;
  role?: AppRole;
};

export type UserLocation = {
  latitude: number;
  longitude: number;
  accuracy?: number;
  updatedAt: string;
};

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
  website?: string;
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

export type SearchHistoryItem = { id: string; query: string; parsedIntent: FoodIntent; createdAt: string };
export type MatchResult = { score: number; reasons: string[] };
export type RankedRestaurant = Restaurant & { match: MatchResult };
export type RecurringPreferences = { categories: string[]; ambience: string[]; budget?: BudgetLevel };
export type RestaurantDataSource = "local" | "supabase";
