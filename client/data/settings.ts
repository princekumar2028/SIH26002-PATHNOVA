export type UserRole = "System Administrator" | "Regional Operations Manager" | "Fleet Manager" | "Field Officer" | "Analyst" | "Viewer";
export type Region = "All Regions" | "Assam" | "Arunachal Pradesh" | "Meghalaya" | "Manipur" | "Mizoram" | "Nagaland" | "Tripura" | "Sikkim";

export const userProfile = { name: "Operations Administrator", email: "admin@nersmartlogix.demo", phone: "+91 98765 43210", organization: "NER Logistics Command Center", designation: "Regional Operations Manager", region: "Assam" };
export const users = [
  { name: "Aarav Sharma", initials: "AS", role: "System Administrator", region: "All Regions", status: "Active", lastActive: "Just now", permissions: "Full access" },
  { name: "Rahul Das", initials: "RD", role: "Regional Operations Manager", region: "Assam", status: "Active", lastActive: "8 min ago", permissions: "Operations" },
  { name: "Priya Singh", initials: "PS", role: "Field Officer", region: "Arunachal Pradesh", status: "Active", lastActive: "24 min ago", permissions: "Field reports" },
  { name: "Amit Kumar", initials: "AK", role: "Fleet Manager", region: "Meghalaya", status: "Inactive", lastActive: "2 days ago", permissions: "Fleet" },
];
export const roles: UserRole[] = ["System Administrator", "Regional Operations Manager", "Fleet Manager", "Field Officer", "Analyst", "Viewer"];
export const regions: Region[] = ["All Regions", "Assam", "Arunachal Pradesh", "Meghalaya", "Manipur", "Mizoram", "Nagaland", "Tripura", "Sikkim"];
export const notificationPreferences = ["Critical Alerts", "High Risk Alerts", "Vehicle Delays", "Weather Warnings", "Route Disruptions", "Incident Updates", "AI Recommendations", "System Notifications"];
export const aiPreferences = { recommendations: true, riskAnalysis: true, routeRecommendations: true, activityMonitoring: true, humanApproval: true, confidence: 80, actionLevel: "Medium" };
export const mapPreferences = ["Show Traffic", "Show Weather Overlay", "Show Risk Heatmap", "Show Incident Markers", "Show Vehicle Labels"];
export const regionalPreferences = ["Assam", "Arunachal Pradesh", "Meghalaya", "Manipur", "Mizoram", "Nagaland", "Tripura", "Sikkim"];
export const systemStatus = [["Backend API", "Connected"], ["Database", "Connected"], ["ML Service", "Online"], ["Routing Service", "Online"], ["Weather Service", "Online"], ["Notification Service", "Ready"]];
export const auditLogs = [["14:42", "Operations Administrator", "Changed AI confidence threshold", "80%", "Completed"], ["13:18", "Aarav Sharma", "New Field Officer added", "Arunachal Pradesh", "Completed"], ["12:05", "Operations Administrator", "Critical alert notifications enabled", "In-App", "Completed"]];
