export const regions = ["All North Eastern Region", "Assam", "Arunachal Pradesh", "Meghalaya", "Manipur", "Mizoram", "Nagaland", "Tripura", "Sikkim"];

export const kpis = [
  { label: "Active Vehicles", value: "128", trend: "+8.4%", note: "vs yesterday", status: "Operational", tone: "blue", icon: "truck" },
  { label: "Routes Monitored", value: "342", trend: "+12", note: "this week", status: "24 affected", tone: "teal", icon: "route" },
  { label: "High Risk Zones", value: "17", trend: "+5", note: "newly detected", status: "Requires attention", tone: "red", icon: "risk" },
  { label: "Active Incidents", value: "23", trend: "8", note: "require attention", status: "Monitoring", tone: "amber", icon: "incident" },
  { label: "Deliveries in Transit", value: "86", trend: "82.5%", note: "on schedule", status: "Stable", tone: "green", icon: "package" },
  { label: "Network Accessibility", value: "82.6%", trend: "-3.2%", note: "due to weather", status: "Moderate impact", tone: "purple", icon: "activity" },
];

export const routes = [
  { route: "Guwahati → Itanagar", distance: "340 km", risk: 87, condition: "Heavy Rain", eta: "8h 40m", status: "High Risk" },
  { route: "Guwahati → Shillong", distance: "100 km", risk: 32, condition: "Moderate", eta: "3h 10m", status: "Normal" },
  { route: "Imphal → Kohima", distance: "140 km", risk: 61, condition: "Rain", eta: "4h 20m", status: "Delayed" },
  { route: "Silchar → Aizawl", distance: "180 km", risk: 24, condition: "Clear", eta: "5h 00m", status: "Safe" },
];

export const vehicles = [
  { id: "NR-042", route: "Guwahati → Itanagar", speed: "68 km/h", risk: 42, status: "On Route" },
  { id: "NR-018", route: "Shillong → Guwahati", speed: "52 km/h", risk: 21, status: "On Route" },
  { id: "NR-073", route: "Imphal → Kohima", speed: "31 km/h", risk: 71, status: "Delayed" },
];

export const alerts = [
  { title: "Landslide Alert", description: "NH-13 corridor partially blocked.", time: "10 minutes ago", severity: "CRITICAL", icon: "landslide" },
  { title: "Heavy Rainfall", description: "Heavy rainfall detected in selected region.", time: "24 minutes ago", severity: "HIGH", icon: "rain" },
  { title: "Vehicle Delay", description: "Vehicle NR-042 delayed by 38 minutes.", time: "42 minutes ago", severity: "MEDIUM", icon: "truck" },
  { title: "Road Accessibility", description: "Road segment near Bomdila has restricted movement.", time: "1 hour ago", severity: "HIGH", icon: "road" },
];

export const incidents = [
  ["Landslide", "NH-13", "Critical", "10 min ago", "Investigating"],
  ["Flood", "Dhemaji", "High", "28 min ago", "Confirmed"],
  ["Road Damage", "Bomdila", "Medium", "1h ago", "Investigating"],
  ["Heavy Rain", "Shillong", "High", "2h ago", "Monitoring"],
];

export const activity = [
  ["10:42 AM", "Risk Agent detected increased landslide probability.", "risk"],
  ["10:38 AM", "Route Agent generated 2 alternate routes.", "route"],
  ["10:31 AM", "Weather data updated across 8 districts.", "cloud"],
  ["10:25 AM", "Alert Agent generated high-risk notification.", "bell"],
  ["10:18 AM", "Vehicle NR-042 location updated.", "truck"],
];
