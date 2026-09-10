/**
 * V2V Alert Store
 *
 * Simple module-level singleton that holds V2V hazard alerts in memory.
 * Shared between DriverPortal (writes) and Alerts page (reads).
 *
 * No global state library needed — module caching ensures a single instance.
 * In production, replace with a WebSocket subscription or real-time DB query.
 */

import { V2VHazardAlert } from "@shared/api";
import { AlertRecord } from "@/data/alerts";

// Module-level store — persists for the lifetime of the browser session
let _v2vAlerts: V2VHazardAlert[] = [];
type V2VListener = () => void;
const _listeners: Set<V2VListener> = new Set();

/** Subscribe to V2V alert additions / mutations */
export function subscribeV2VAlerts(listener: V2VListener): () => void {
  _listeners.add(listener);
  return () => {
    _listeners.delete(listener);
  };
}

function notifyListeners(): void {
  _listeners.forEach((l) => {
    try {
      l();
    } catch {
      // safe call
    }
  });
}

/** Add a new V2V alert to the store */
export function addV2VAlert(alert: V2VHazardAlert): void {
  _v2vAlerts = [alert, ..._v2vAlerts];
  notifyListeners();
}

/** Get all V2V alerts (newest first) */
export function getV2VAlerts(): V2VHazardAlert[] {
  return _v2vAlerts;
}

/** Get V2V alerts for a specific recipient vehicle */
export function getV2VAlertsForVehicle(vehicleId: string): V2VHazardAlert[] {
  return _v2vAlerts.filter((a) => a.recipientVehicleId === vehicleId);
}

/** Get the most critical active V2V alert for a specific vehicle (for the HAZARD AHEAD banner) */
export function getActiveHazardForVehicle(vehicleId: string): V2VHazardAlert | null {
  return (
    _v2vAlerts.find(
      (a) => a.recipientVehicleId === vehicleId && a.status === "active"
    ) ?? null
  );
}

/**
 * Convert a V2V alert to the AlertRecord shape used by the Operations Alerts page.
 * This lets V2V alerts appear seamlessly in the existing alert feed.
 */
export function v2vAlertToRecord(alert: V2VHazardAlert): AlertRecord {
  return {
    id: alert.id,
    type: "V2V Hazard",
    severity: alert.severity,
    title: alert.title,
    description:
      alert.message +
      " Reporting vehicle: " +
      alert.reportingVehicleId +
      ". Alert recipient: " +
      alert.recipientVehicleId +
      ".",
    location: alert.location,
    source: "Driver Report",
    createdAt: alert.timestamp,
    status:
      alert.status === "active"
        ? "New"
        : alert.status === "acknowledged"
        ? "Acknowledged"
        : "Resolved",
    isRead: false,
    confidence: alert.confidenceScore,
    riskProbability: alert.severity === "High" ? 74 : 45,
    affectedRoutes: alert.location,
    affectedVehicles: 1,
    expectedImpact:
      alert.severity === "High"
        ? "Possible route delay or closure"
        : "Minor disruption, proceed with caution",
    recommendedAction: alert.recommendedAction,
  };
}
