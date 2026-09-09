import { useState, useEffect } from "react";
import { WeatherData, WeatherResponse } from "@shared/api";

export type WeatherFetchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: WeatherData }
  | { status: "error"; message: string };

/**
 * Fetches live weather data from the PATHNOVA backend.
 * Re-fetches automatically whenever `location` changes.
 * Uses the backend endpoint: GET /api/weather?location=<location>
 * The API key is NEVER exposed — it lives only in the server.
 */
export function useWeather(location: string): WeatherFetchState {
  const [state, setState] = useState<WeatherFetchState>({ status: "idle" });

  useEffect(() => {
    if (!location) {
      setState({ status: "idle" });
      return;
    }

    let cancelled = false;
    setState({ status: "loading" });

    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `/api/weather?location=${encodeURIComponent(location)}`
        );
        const json: WeatherResponse = await res.json();

        if (cancelled) return;

        if (json.success && json.weather) {
          setState({ status: "success", data: json.weather });
        } else {
          setState({
            status: "error",
            message: json.message ?? "Failed to fetch weather data.",
          });
        }
      } catch (err: any) {
        if (cancelled) return;
        setState({
          status: "error",
          message: "Network error — could not reach the weather service.",
        });
      }
    };

    fetchWeather();

    return () => {
      cancelled = true;
    };
  }, [location]);

  return state;
}
