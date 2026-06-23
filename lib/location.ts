import type { Restaurant, UserLocation } from "@/lib/types";

const earthRadiusKm = 6371;

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function hasUsableCoordinates(restaurant: Restaurant) {
  if (typeof restaurant.latitude !== "number" || typeof restaurant.longitude !== "number") return false;
  return !(restaurant.latitude === 0 && restaurant.longitude === 0);
}

export function distanceKmBetween(origin: UserLocation, destination: { latitude: number; longitude: number }) {
  const dLat = toRadians(destination.latitude - origin.latitude);
  const dLng = toRadians(destination.longitude - origin.longitude);
  const lat1 = toRadians(origin.latitude);
  const lat2 = toRadians(destination.latitude);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function withLiveRestaurantDistance(restaurant: Restaurant, location?: UserLocation | null): Restaurant {
  if (!location || !hasUsableCoordinates(restaurant)) return restaurant;
  return {
    ...restaurant,
    distanceKm: distanceKmBetween(location, {
      latitude: restaurant.latitude as number,
      longitude: restaurant.longitude as number,
    }),
  };
}

export function withLiveRestaurantDistances(restaurants: Restaurant[], location?: UserLocation | null) {
  return restaurants.map((restaurant) => withLiveRestaurantDistance(restaurant, location));
}
