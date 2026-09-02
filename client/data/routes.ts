export type RouteRisk = "Low" | "Medium" | "High" | "Very High";
export interface RouteOption { id: string; name: string; path: string; distance: string; normalEta: string; predictedEta: string; delay: string; riskScore: number; riskLevel: RouteRisk; trafficLevel: string; weatherCondition: string; roadCondition: string; landslideRisk: string; floodRisk: string; aiScore: number; isRecommended?: boolean; }
export const routeOptions: RouteOption[] = [
  { id: "route-a", name: "Route A — AI Recommended", path: "Guwahati → Tezpur → Bhalukpong → Itanagar", distance: "438 km", normalEta: "10h 20m", predictedEta: "10h 40m", delay: "+20 min", riskScore: 18, riskLevel: "Low", trafficLevel: "Moderate", weatherCondition: "Light Rain", roadCondition: "Good", landslideRisk: "Low", floodRisk: "Medium", aiScore: 94, isRecommended: true },
  { id: "route-b", name: "Route B — Fastest", path: "Guwahati → Nagaon → Itanagar", distance: "421 km", normalEta: "9h 15m", predictedEta: "10h 10m", delay: "+55 min", riskScore: 64, riskLevel: "High", trafficLevel: "Heavy", weatherCondition: "Heavy Rain", roadCondition: "Moderate", landslideRisk: "High", floodRisk: "Medium", aiScore: 62 },
  { id: "route-c", name: "Route C — Alternate", path: "Guwahati → North Lakhimpur → Itanagar", distance: "465 km", normalEta: "11h 15m", predictedEta: "11h 30m", delay: "+15 min", riskScore: 31, riskLevel: "Medium", trafficLevel: "Low", weatherCondition: "Moderate Rain", roadCondition: "Good", landslideRisk: "Low", floodRisk: "Medium", aiScore: 82 },
];
export const routeIncidents = [
  { type: "Road Damage", location: "Near Tezpur", severity: "Medium", impact: "+15 min" },
  { type: "Heavy Rainfall", location: "Near Bhalukpong", severity: "High", impact: "High" },
  { type: "Traffic Congestion", location: "Near Itanagar", severity: "Medium", impact: "+10 min" },
];
export const riskFactors = [["Weather Risk", 24], ["Road Condition Risk", 18], ["Traffic Risk", 31], ["Landslide Risk", 12], ["Flood Risk", 8], ["Historical Disruption Risk", 17]] as const;
