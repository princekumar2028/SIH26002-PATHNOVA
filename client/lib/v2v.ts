import { vehicleRecords, VehicleRecord } from "@/data/vehicles";
import { V2VHazardAlert } from "@shared/api";

/**
 * V2V Hazard Sharing — Core Logic
 *
 * Pure, side-effect-free functions for corridor-based vehicle matching
 * and V2V alert generation. Replace findRelevantVehicle() with real
 * PostGIS geofencing in production without touching any other files.
 */

const CORRIDOR_KEYWORDS: { keywords: string[]; route: string }[] = [
  { keywords: ["bhalukpong", "itanagar", "guwahati", "nh-13", "nh13"], route: "Guwahati to Itanagar" },
  { keywords: ["shillong", "silchar", "meghalaya", "nh-44"], route: "Shillong to Silchar" },
  { keywords: ["imphal", "kohima", "manipur", "nagaland"], route: "Imphal to Kohima" },
  { keywords: ["aizawl", "agartala", "mizoram", "tripura"], route: "Aizawl to Agartala" },
  { keywords: ["bomdila", "arunachal", "tawang"], route: "Guwahati to Itanagar" },
  { keywords: ["jorhat", "dibrugarh", "assam"], route: "Jorhat to Itanagar" },
];

function detectCorridor(loc: string): string | null {
  const l = loc.toLowerCase();
  for (const e of CORRIDOR_KEYWORDS) {
    if (e.keywords.some((kw) => l.includes(kw))) return e.route;
  }
  return null;
}

/**
 * Find the most relevant vehicle to receive a V2V hazard alert.
 * Uses corridor keyword matching. Replace with PostGIS in production.
 */
export function findRelevantVehicle(
  locationName: string,
  reportingVehicleId = "TRK-104"
): VehicleRecord | null {
  const corridor = detectCorridor(locationName);
  const candidates = vehicleRecords.filter(
    (v) => v.id !== reportingVehicleId && v.status !== "Offline"
  );

  if (corridor) {
    const matches = candidates.filter(
      (v) => corridor.includes(v.destination) || corridor.includes(v.currentLocation)
    );
    if (matches.length > 0) {
      return (
        matches.find((v) => v.riskLevel === "High" || v.riskLevel === "Medium") ?? matches[0]
      );
    }
  }

  // Fallback: any high-risk moving vehicle
  return (
    candidates.find(
      (v) => (v.riskLevel === "High" || v.riskLevel === "Medium") && v.status === "Moving"
    ) ??
    candidates[0] ??
    null
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const HAZARD_CONFIDENCE: Record<string, number> = {
  landslide: 87,
  flooding: 85,
  road_blocked: 82,
  accident: 78,
  road_damage_severe: 80,
  road_damage: 75,
  obstruction: 72,
  other_hazard: 70,
  other: 70,
  pothole: 65,
};

function confidenceFor(t: string): number {
  return HAZARD_CONFIDENCE[t] ?? 70;
}

function severityFor(t: string): "Critical" | "High" | "Medium" {
  if (
    ["landslide", "flooding", "road_blocked", "accident", "road_damage_severe"].includes(t)
  ) {
    return "High";
  }
  return "Medium";
}

function actionFor(t: string, loc: string): string {
  if (t === "landslide")
    return "Landslide reported near " + loc + ". Slow down and check with dispatch for alternate route.";
  if (t === "flooding")
    return "Flooding reported near " + loc + ". Avoid low-lying sections and proceed with caution.";
  if (t === "road_blocked")
    return "Road blocked near " + loc + ". Stop at a safe distance and use alternate route.";
  if (t === "accident")
    return "Accident reported near " + loc + ". Reduce speed and maintain safe following distance.";
  if (t === "road_damage" || t === "road_damage_severe")
    return "Road damage near " + loc + ". Reduce speed and watch for uneven surfaces.";
  if (t === "obstruction")
    return "Obstruction on road near " + loc + ". Slow down and prepare to stop if required.";
  return "Hazard reported near " + loc + ". Drive carefully and stay alert.";
}

let alertCounter = 1;

/**
 * Generate a V2VHazardAlert from a driver incident submission.
 */
export function generateV2VAlert(
  incidentType: string,
  locationName: string,
  incidentId: string,
  recipient: VehicleRecord,
  reportingVehicleId = "TRK-104"
): V2VHazardAlert {
  const now = new Date();
  const timeLabel = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  const hazardLabel = incidentType
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  const severity = severityFor(incidentType);

  return {
    id: "V2V-" + now.getFullYear() + "-" + String(alertCounter++).padStart(4, "0"),
    type: "v2v_hazard",
    source: "driver_report",
    incidentId,
    severity,
    title: "V2V Hazard: " + hazardLabel,
    message: hazardLabel + " reported near " + locationName + " by a nearby driver.",
    location: locationName,
    timestamp: timeLabel + " today",
    recipientVehicleId: recipient.id,
    reportingVehicleId,
    recommendedAction: actionFor(incidentType, locationName),
    status: "active",
    confidenceScore: confidenceFor(incidentType),
  };
}
