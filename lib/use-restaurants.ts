"use client";

import { useEffect, useState } from "react";
import { restaurants as localRestaurants } from "@/lib/data/restaurants";
import type { Restaurant, RestaurantDataSource } from "@/lib/types";

type RestaurantsState = {
  restaurants: Restaurant[];
  source: RestaurantDataSource;
  loading: boolean;
};

export function useRestaurants(): RestaurantsState {
  const [state, setState] = useState<RestaurantsState>({ restaurants: localRestaurants, source: "local", loading: true });

  useEffect(() => {
    let active = true;

    fetch("/api/restaurants")
      .then((response) => response.json())
      .then((data: { restaurants?: Restaurant[]; source?: RestaurantDataSource }) => {
        if (!active) return;
        setState({
          restaurants: data.restaurants?.length ? data.restaurants : localRestaurants,
          source: data.source ?? "local",
          loading: false,
        });
      })
      .catch(() => {
        if (!active) return;
        setState({ restaurants: localRestaurants, source: "local", loading: false });
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}

