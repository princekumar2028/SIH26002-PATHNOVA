import { RequestHandler } from "express";
import { supabase } from "../config/supabase";
import {
  INCIDENT_TYPES,
  SEVERITY_LEVELS,
  CreateIncidentRequest,
  CreateIncidentResponse,
  GetIncidentsResponse,
} from "@shared/api";

/**
 * Validate the request body for creating an incident.
 * Returns an array of error messages (empty if valid).
 */
function validateCreateIncident(body: any): string[] {
  const errors: string[] = [];

  // Required fields
  if (!body.incident_type) {
    errors.push("incident_type is required");
  } else if (!INCIDENT_TYPES.includes(body.incident_type)) {
    errors.push(
      `incident_type must be one of: ${INCIDENT_TYPES.join(", ")}`
    );
  }

  if (body.latitude === undefined || body.latitude === null) {
    errors.push("latitude is required");
  } else if (typeof body.latitude !== "number" || body.latitude < -90 || body.latitude > 90) {
    errors.push("latitude must be a number between -90 and 90");
  }

  if (body.longitude === undefined || body.longitude === null) {
    errors.push("longitude is required");
  } else if (typeof body.longitude !== "number" || body.longitude < -180 || body.longitude > 180) {
    errors.push("longitude must be a number between -180 and 180");
  }

  if (!body.severity) {
    errors.push("severity is required");
  } else if (!SEVERITY_LEVELS.includes(body.severity)) {
    errors.push(
      `severity must be one of: ${SEVERITY_LEVELS.join(", ")}`
    );
  }

  return errors;
}

/**
 * POST /api/incidents — Create a new incident report
 */
export const handleCreateIncident: RequestHandler = async (req, res) => {
  try {
    // Validate request body
    const errors = validateCreateIncident(req.body);
    if (errors.length > 0) {
      const response: CreateIncidentResponse = {
        success: false,
        message: "Validation failed",
        errors,
      };
      res.status(400).json(response);
      return;
    }

    const body: CreateIncidentRequest = req.body;

    // Insert into Supabase
    const { data, error } = await supabase
      .from("incidents")
      .insert({
        incident_type: body.incident_type,
        description: body.description || null,
        latitude: body.latitude,
        longitude: body.longitude,
        location_name: body.location_name || null,
        severity: body.severity,
        photo_url: body.photo_url || null,
      })
      .select()
      .single();

    if (error) {
      const response: CreateIncidentResponse = {
        success: false,
        message: "Failed to create incident",
        errors: [error.message],
      };
      res.status(500).json(response);
      return;
    }

    const response: CreateIncidentResponse = {
      success: true,
      message: "Incident reported successfully",
      incident: data,
    };
    res.status(201).json(response);
  } catch (err: any) {
    const response: CreateIncidentResponse = {
      success: false,
      message: "Server error",
      errors: [err.message],
    };
    res.status(500).json(response);
  }
};

/**
 * GET /api/incidents — Fetch all incidents (newest first)
 */
export const handleGetIncidents: RequestHandler = async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from("incidents")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      const response: GetIncidentsResponse = {
        success: false,
        message: "Failed to fetch incidents",
        incidents: [],
        count: 0,
      };
      res.status(500).json(response);
      return;
    }

    const response: GetIncidentsResponse = {
      success: true,
      message: "Incidents fetched successfully",
      incidents: data ?? [],
      count: data?.length ?? 0,
    };
    res.json(response);
  } catch (err: any) {
    const response: GetIncidentsResponse = {
      success: false,
      message: "Server error",
      incidents: [],
      count: 0,
    };
    res.status(500).json(response);
  }
};
