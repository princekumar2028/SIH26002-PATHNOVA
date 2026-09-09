/**
 * WeatherAPI.com service
 * Wraps the /current.json endpoint and returns a normalised WeatherData object.
 *
 * Docs: https://www.weatherapi.com/docs/
 */

import { WeatherData } from "../../shared/api";

const BASE_URL = "https://api.weatherapi.com/v1";

// ---------------------------------------------------------------------------
// Raw WeatherAPI response shapes (only the fields we use)
// ---------------------------------------------------------------------------

interface WeatherApiLocation {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
}

interface WeatherApiCondition {
  text: string;
  icon: string;
}

interface WeatherApiCurrent {
  temp_c: number;
  feelslike_c: number;
  humidity: number;
  wind_kph: number;
  wind_dir: string;
  precip_mm: number;
  vis_km: number;
  condition: WeatherApiCondition;
  last_updated: string;
}

interface WeatherApiResponse {
  location: WeatherApiLocation;
  current: WeatherApiCurrent;
}

// ---------------------------------------------------------------------------
// Custom error class
// ---------------------------------------------------------------------------

export class WeatherServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500,
  ) {
    super(message);
    this.name = "WeatherServiceError";
  }
}

// ---------------------------------------------------------------------------
// Service function
// ---------------------------------------------------------------------------

/**
 * Fetches current weather for the given location query string.
 * @param location - city name, lat/lon pair, or postal code accepted by WeatherAPI
 * @throws WeatherServiceError on validation, API, or network errors
 */
export async function fetchCurrentWeather(
  location: string,
): Promise<WeatherData> {
  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    throw new WeatherServiceError(
      "Weather API key is not configured. Set WEATHER_API_KEY in .env",
      500,
    );
  }

  const url = new URL(`${BASE_URL}/current.json`);
  url.searchParams.set("key", apiKey);
  url.searchParams.set("q", location);
  url.searchParams.set("aqi", "no"); // air quality not needed at this stage

  let response: Response;
  try {
    response = await fetch(url.toString());
  } catch (err: any) {
    throw new WeatherServiceError(
      `Network error while contacting WeatherAPI: ${err.message}`,
      503,
    );
  }

  if (!response.ok) {
    // WeatherAPI returns structured error JSON even on 4xx
    let apiError = "Unknown WeatherAPI error";
    try {
      const body = await response.json();
      apiError = body?.error?.message ?? apiError;
    } catch {
      // ignore parse errors — keep the generic message
    }

    // 400 from WeatherAPI typically means bad / unrecognised location
    const statusCode = response.status === 400 ? 422 : response.status;
    throw new WeatherServiceError(apiError, statusCode);
  }

  let data: WeatherApiResponse;
  try {
    data = await response.json();
  } catch {
    throw new WeatherServiceError(
      "Failed to parse WeatherAPI response as JSON",
      502,
    );
  }

  // Normalise into our own shape so the route layer is decoupled from WeatherAPI
  const weather: WeatherData = {
    location_name: data.location.name,
    region: data.location.region,
    country: data.location.country,
    latitude: data.location.lat,
    longitude: data.location.lon,
    timezone: data.location.tz_id,
    temperature_c: data.current.temp_c,
    feels_like_c: data.current.feelslike_c,
    humidity_percent: data.current.humidity,
    wind_speed_kph: data.current.wind_kph,
    wind_direction: data.current.wind_dir,
    precipitation_mm: data.current.precip_mm,
    visibility_km: data.current.vis_km,
    condition: data.current.condition.text,
    condition_icon: `https:${data.current.condition.icon}`, // prefix protocol
    last_updated: data.current.last_updated,
  };

  return weather;
}
