export type VehicleStatus = "Moving" | "Delayed" | "Offline" | "Critical";
export type VehicleRisk = "Low" | "Medium" | "High" | "Unknown";

export interface VehicleRecord {
  id: string;
  driver: string;
  vehicleType: string;
  latitude: number;
  longitude: number;
  currentLocation: string;
  destination: string;
  speed: number;
  averageSpeed: number;
  status: VehicleStatus;
  riskLevel: VehicleRisk;
  eta: string;
  fuelLevel: number;
  distanceTravelled: number;
  remainingDistance: number;
  routeProgress: number;
  lastUpdated: string;
  alert?: string;
}

export const vehicleRecords: VehicleRecord[] = [
  { id: "NER-TRK-1042", driver: "Rahul Sharma", vehicleType: "Heavy Cargo Truck", latitude: 26.18, longitude: 91.74, currentLocation: "Near Guwahati", destination: "Itanagar", speed: 48, averageSpeed: 58, status: "Moving", riskLevel: "Medium", eta: "4h 20m", fuelLevel: 72, distanceTravelled: 210, remainingDistance: 130, routeProgress: 62, lastUpdated: "20 sec ago", alert: "Expected delay increased by 25 minutes." },
  { id: "NER-TRK-1087", driver: "Amit Kumar", vehicleType: "Refrigerated Carrier", latitude: 25.57, longitude: 91.88, currentLocation: "Shillong", destination: "Silchar", speed: 22, averageSpeed: 45, status: "Delayed", riskLevel: "High", eta: "6h 10m", fuelLevel: 48, distanceTravelled: 86, remainingDistance: 214, routeProgress: 29, lastUpdated: "15 sec ago", alert: "High risk detected on Shillong → Silchar route." },
  { id: "NER-TRK-1124", driver: "Rakesh Singh", vehicleType: "Container Truck", latitude: 24.82, longitude: 93.94, currentLocation: "Imphal", destination: "Kohima", speed: 41, averageSpeed: 43, status: "Moving", riskLevel: "Low", eta: "3h 45m", fuelLevel: 81, distanceTravelled: 72, remainingDistance: 68, routeProgress: 51, lastUpdated: "10 sec ago" },
  { id: "NER-TRK-1198", driver: "Vikash Das", vehicleType: "Utility Truck", latitude: 23.73, longitude: 92.72, currentLocation: "Aizawl", destination: "Agartala", speed: 0, averageSpeed: 39, status: "Offline", riskLevel: "Unknown", eta: "--", fuelLevel: 34, distanceTravelled: 105, remainingDistance: 75, routeProgress: 58, lastUpdated: "8 min ago" },
  { id: "NER-TRK-1056", driver: "Mohan Thapa", vehicleType: "Heavy Cargo Truck", latitude: 27.48, longitude: 92.63, currentLocation: "Bomdila", destination: "Guwahati", speed: 18, averageSpeed: 52, status: "Critical", riskLevel: "High", eta: "9h 30m", fuelLevel: 41, distanceTravelled: 118, remainingDistance: 277, routeProgress: 30, lastUpdated: "35 sec ago", alert: "Road damage reported ahead." },
  { id: "NER-TRK-1210", driver: "Sanjay Mehta", vehicleType: "Emergency Carrier", latitude: 26.75, longitude: 94.20, currentLocation: "Jorhat", destination: "Itanagar", speed: 36, averageSpeed: 48, status: "Moving", riskLevel: "High", eta: "5h 12m", fuelLevel: 67, distanceTravelled: 142, remainingDistance: 188, routeProgress: 43, lastUpdated: "25 sec ago", alert: "Possible landslide risk detected ahead." },
  { id: "NER-TRK-1176", driver: "Naveen Roy", vehicleType: "Flatbed Truck", latitude: 24.83, longitude: 92.78, currentLocation: "Silchar", destination: "Aizawl", speed: 27, averageSpeed: 40, status: "Delayed", riskLevel: "Medium", eta: "4h 55m", fuelLevel: 53, distanceTravelled: 65, remainingDistance: 115, routeProgress: 36, lastUpdated: "45 sec ago", alert: "Severe congestion on current segment." },
  { id: "NER-TRK-1144", driver: "Arun Verma", vehicleType: "Supply Truck", latitude: 26.12, longitude: 91.76, currentLocation: "Guwahati", destination: "Agartala", speed: 52, averageSpeed: 50, status: "Moving", riskLevel: "Low", eta: "7h 05m", fuelLevel: 88, distanceTravelled: 34, remainingDistance: 298, routeProgress: 10, lastUpdated: "12 sec ago" },
];
