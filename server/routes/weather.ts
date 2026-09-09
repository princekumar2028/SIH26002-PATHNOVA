/**
 * GET /api/weather?location=<query>
 *
 * Returns current weather data for the given location.
 * Powered by WeatherAPI.com
 */

import { RequestHandler } from "express";
import { fetchCurrentWeather, WeatherServiceError } from "../services/weather";
import { WeatherResponse } from "../../shared/api";

export const handleGetWeather: RequestHandler = async (req, res) => {
  const location = (req.query.location as string | undefined)?.trim();

  // --- Validate query param ------------------------------------------------
  if (!location) {
    const response: WeatherResponse = {
      success: false,
      message: "Validation failed",
      errors: ["location query parameter is required (e.g. ?location=Guwahati)"],
    };
    res.status(400).json(response);
    return;
  }

  // --- Fetch weather --------------------------------------------------------
  try {
    const weather = await fetchCurrentWeather(location);

    const response: WeatherResponse = {
      success: true,
      message: "Weather data fetched successfully",
      weather,
    };
    res.json(response);
  } catch (err: any) {
    if (err instanceof WeatherServiceError) {
      const response: WeatherResponse = {
        success: false,
        message: err.message,
        errors: [err.message],
      };
      res.status(err.statusCode).json(response);
      return;
    }

    // Unexpected errors
    const response: WeatherResponse = {
      success: false,
      message: "An unexpected server error occurred",
      errors: [err.message ?? "Unknown error"],
    };
    res.status(500).json(response);
  }
};
