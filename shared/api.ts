/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Valid values for incident fields (must match DB constraints)
 */
export const INCIDENT_TYPES = [
  "pothole",
  "accident",
  "road_damage",
  "obstruction",
  "flooding",
  "other",
  // V2V driver-reported road hazards
  "road_blocked",
  "landslide",
  "road_damage_severe",
  "other_hazard",
] as const;

export const SEVERITY_LEVELS = ["low", "medium", "high", "critical"] as const;

export const STATUS_VALUES = [
  "reported",
  "verified",
  "in_progress",
  "resolved",
] as const;

export type IncidentType = (typeof INCIDENT_TYPES)[number];
export type SeverityLevel = (typeof SEVERITY_LEVELS)[number];
export type StatusValue = (typeof STATUS_VALUES)[number];

/**
 * Shape of an incident row from the database
 */
export interface Incident {
  id: string;
  incident_type: IncidentType;
  description: string | null;
  latitude: number;
  longitude: number;
  location_name: string | null;
  severity: SeverityLevel;
  photo_url: string | null;
  status: StatusValue;
  reported_at: string;
  created_at: string;
}

/**
 * Request body for POST /api/incidents
 */
export interface CreateIncidentRequest {
  incident_type: IncidentType;
  description?: string;
  latitude: number;
  longitude: number;
  location_name?: string;
  severity: SeverityLevel;
  photo_url?: string;
}

/**
 * Response for POST /api/incidents
 */
export interface CreateIncidentResponse {
  success: boolean;
  message: string;
  incident?: Incident;
  errors?: string[];
}

/**
 * Response for GET /api/incidents
 */
export interface GetIncidentsResponse {
  success: boolean;
  message: string;
  incidents: Incident[];
  count: number;
}

// ---------------------------------------------------------------------------
// Weather API types
// ---------------------------------------------------------------------------

/**
 * Normalised weather data returned by GET /api/weather
 */
export interface WeatherData {
  location_name: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
  temperature_c: number;
  feels_like_c: number;
  humidity_percent: number;
  wind_speed_kph: number;
  wind_direction: string;
  precipitation_mm: number;
  visibility_km: number;
  condition: string;
  condition_icon: string;
  last_updated: string;
}

/**
 * Envelope returned by GET /api/weather
 */
export interface WeatherResponse {
  success: boolean;
  message: string;
  weather?: WeatherData;
  errors?: string[];
}

// ---------------------------------------------------------------------------
// V2V Hazard Alert types (client-side simulation)
// ---------------------------------------------------------------------------

export type V2VAlertStatus = "active" | "acknowledged" | "resolved";

/**
 * A Vehicle-to-Vehicle hazard alert generated when a driver reports a road hazard.
 * Shared between DriverPortal and Alerts page via the v2vStore module.
 */
export interface V2VHazardAlert {
  id: string;
  type: "v2v_hazard";
  source: "driver_report";
  /** ID of the incident that triggered this alert */
  incidentId: string;
  severity: "Critical" | "High" | "Medium";
  title: string;
  message: string;
  location: string;
  timestamp: string;
  /** Vehicle ID that should receive this alert */
  recipientVehicleId: string;
  /** Vehicle ID of the reporting vehicle */
  reportingVehicleId: string;
  recommendedAction: string;
  status: V2VAlertStatus;
  /** 0–100 prototype confidence score */
  confidenceScore: number;
}
