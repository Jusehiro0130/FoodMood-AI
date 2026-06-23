import { restaurants as localRestaurants } from "@/lib/data/restaurants";
import type { BudgetLevel, Restaurant, RestaurantDataSource } from "@/lib/types";

type RestaurantApiResult = {
  source: RestaurantDataSource;
  restaurants: Restaurant[];
};

type SupabaseRestaurantRow = {
  id: string;
  name: string;
  description: string | null;
  categories: string[] | string | null;
  tags: string[] | string | null;
  price_level: string | null;
  ambience: string[] | string | null;
  instagram: string | null;
  address: string | null;
  zone: string | null;
  rating: number | string | null;
  opening_hours: string | null;
  website: string | null;
  image_url: string | null;
  latitude: number | string | null;
  longitude: number | string | null;
};

const PANAMA_CITY = { latitude: 8.9824, longitude: -79.5199 };

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && anonKey ? { url: url.replace(/\/$/, ""), anonKey } : null;
}

function toStringArray(value: string[] | string | null | undefined) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return [];
  return value
    .replace(/[{}"]/g, "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toNumber(value: number | string | null | undefined, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toBudgetLevel(value: string | null | undefined): BudgetLevel {
  return value === "$" || value === "$$" || value === "$$$" || value === "$$$$" ? value : "$$";
}

function distanceFromPanamaCity(latitude?: number, longitude?: number) {
  if (!latitude || !longitude) return 4;
  const earthRadiusKm = 6371;
  const dLat = ((latitude - PANAMA_CITY.latitude) * Math.PI) / 180;
  const dLon = ((longitude - PANAMA_CITY.longitude) * Math.PI) / 180;
  const lat1 = (PANAMA_CITY.latitude * Math.PI) / 180;
  const lat2 = (latitude * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return Math.round(earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
}

function mapSupabaseRestaurant(row: SupabaseRestaurantRow): Restaurant {
  const latitude = toNumber(row.latitude, Number.NaN);
  const longitude = toNumber(row.longitude, Number.NaN);

  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "Restaurante seleccionado para FoodMood AI.",
    categories: toStringArray(row.categories),
    tags: toStringArray(row.tags),
    priceLevel: toBudgetLevel(row.price_level),
    ambience: toStringArray(row.ambience).length ? toStringArray(row.ambience) : ["Casual"],
    instagram: row.instagram ? `@${row.instagram.replace("@", "")}` : "",
    address: row.address ?? "Direccion por confirmar",
    zone: row.zone ?? "Panama",
    distanceKm: distanceFromPanamaCity(Number.isNaN(latitude) ? undefined : latitude, Number.isNaN(longitude) ? undefined : longitude),
    rating: toNumber(row.rating, 0),
    openingHours: row.opening_hours ?? "Horario por confirmar",
    website: row.website ?? undefined,
    imageUrl: row.image_url ?? undefined,
    latitude: Number.isNaN(latitude) ? undefined : latitude,
    longitude: Number.isNaN(longitude) ? undefined : longitude,
  };
}

export function getRestaurantDataSource(): RestaurantDataSource {
  return getSupabaseConfig() ? "supabase" : "local";
}

export async function getRestaurantsForApp(): Promise<RestaurantApiResult> {
  const config = getSupabaseConfig();
  if (!config) return { source: "local", restaurants: localRestaurants };

  try {
    const response = await fetch(`${config.url}/rest/v1/foodmood_restaurants_app?select=*&active=eq.true&order=rating.desc.nullslast,name.asc`, {
      headers: {
        apikey: config.anonKey,
        Authorization: `Bearer ${config.anonKey}`,
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) throw new Error(`Supabase restaurants fetch failed: ${response.status}`);

    const rows = (await response.json()) as SupabaseRestaurantRow[];
    return { source: "supabase", restaurants: rows.map(mapSupabaseRestaurant) };
  } catch (error) {
    console.warn(error);
    return { source: "local", restaurants: localRestaurants };
  }
}
