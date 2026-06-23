"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { UserLocation } from "@/lib/types";

type LocationStatus = "idle" | "requesting" | "watching" | "denied" | "unsupported" | "error";

export function useLiveLocation() {
  const watchId = useRef<number | null>(null);
  const [status, setStatus] = useState<LocationStatus>("idle");
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [error, setError] = useState("");

  const stop = useCallback(() => {
    if (watchId.current !== null && typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId.current);
    }
    watchId.current = null;
    setStatus((current) => (current === "watching" ? "idle" : current));
  }, []);

  const request = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("unsupported");
      return;
    }

    setStatus("requesting");
    setError("");
    if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);

    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          updatedAt: new Date().toISOString(),
        });
        setStatus("watching");
      },
      (nextError) => {
        setError(nextError.message);
        setStatus(nextError.code === nextError.PERMISSION_DENIED ? "denied" : "error");
      },
      { enableHighAccuracy: true, maximumAge: 30000, timeout: 12000 },
    );
  }, []);

  useEffect(() => stop, [stop]);

  return { error, location, request, status, stop };
}
