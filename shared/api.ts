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
