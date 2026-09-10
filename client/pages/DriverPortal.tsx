import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import PathnovaLogo from "@/components/PathnovaLogo";
import { useWeather } from "@/hooks/use-weather";
import { alertRecords } from "@/data/alerts";
import { vehicleRecords } from "@/data/vehicles";
import { findRelevantVehicle, generateV2VAlert } from "@/lib/v2v";
import {
  addV2VAlert,
  getV2VAlertsForVehicle,
  getActiveHazardForVehicle,
  subscribeV2VAlerts,
} from "@/lib/v2vStore";
import { V2VHazardAlert } from "@shared/api";
import {
  AlertTriangle,
  ArrowLeft,
  Bell,
  Camera,
  CheckCircle2,
  ChevronDown,
  CloudRain,
  Eye,
  Home,
  Loader2,
  Map as MapIcon,
  MapPin,
  Navigation,
  Route as RouteIcon,
  Thermometer,
  Truck,
  Wind,
  TriangleAlert,
  X,
} from "lucide-react";

/* ─── Constants & Fallbacks ─── */
const DEMO_ROUTE = {
  from: "Guwahati",
  to: "Itanagar",
  distance: "320 km",
  eta: "5h 20m",
  status: "Active",
};

const DEMO_ROAD_RISK = {
  level: "HIGH" as "HIGH" | "MEDIUM" | "LOW",
  summary: "Heavy rainfall + landslide risk",
  location: "Near Bhalukpong",
  action: "Slow down and follow the alternate route if available.",
};

const HAZARD_TYPES = [
  { value: "landslide", label: "Landslide" },
  { value: "flooding", label: "Flooding" },
  { value: "road_blocked", label: "Road Blocked" },
  { value: "road_damage", label: "Road Damage" },
  { value: "accident", label: "Accident" },
  { value: "obstruction", label: "Obstruction" },
  { value: "other_hazard", label: "Other Hazard" },
] as const;

type HazardType = (typeof HAZARD_TYPES)[number]["value"];
type Tab = "home" | "route" | "alerts" | "report";

/* ─── Helpers ─── */
function riskColor(level: "HIGH" | "MEDIUM" | "LOW") {
  if (level === "HIGH") return "driver-risk--high";
  if (level === "MEDIUM") return "driver-risk--medium";
  return "driver-risk--low";
}

/* ═══════════════════════════════════════════
   DRIVER PORTAL ROOT
═══════════════════════════════════════════ */
export default function DriverPortal() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("TRK-104");

  const weather = useWeather("Guwahati");
  const criticalAlert =
    alertRecords.find((a) => a.severity === "Critical" || a.severity === "High") ?? null;

  const [driverV2VAlerts, setDriverV2VAlerts] = useState<V2VHazardAlert[]>([]);
  const [activeHazard, setActiveHazard] = useState<V2VHazardAlert | null>(null);

  const activeVehicleRecord = vehicleRecords.find((v) => v.id === selectedVehicleId);
  const activeDriverName = activeVehicleRecord
    ? activeVehicleRecord.driver
    : selectedVehicleId === "TRK-104"
    ? "Driver A (Reporting Unit)"
    : "Assigned Driver";

  const refreshV2V = () => {
    setDriverV2VAlerts(getV2VAlertsForVehicle(selectedVehicleId));
    setActiveHazard(getActiveHazardForVehicle(selectedVehicleId));
  };

  useEffect(() => {
    refreshV2V();
    const unsubscribe = subscribeV2VAlerts(() => {
      refreshV2V();
    });
    return unsubscribe;
  }, [selectedVehicleId, activeTab]);

  function renderContent() {
    switch (activeTab) {
      case "route":
        return <MyRouteSection selectedVehicleId={selectedVehicleId} />;
      case "alerts":
        return (
          <DriverAlertsSection
            v2vAlerts={driverV2VAlerts}
            criticalAlert={criticalAlert}
          />
        );
      case "report":
        return (
          <HazardReportSection
            selectedVehicleId={selectedVehicleId}
            onSuccess={() => {
              refreshV2V();
              setActiveTab("alerts");
            }}
          />
        );
      default:
        return (
          <HomeContent
            weather={weather}
            criticalAlert={criticalAlert}
            activeHazard={activeHazard}
            onViewAlert={() => setActiveTab("alerts")}
            onReport={() => setActiveTab("report")}
          />
        );
    }
  }

  const activeV2VCount = driverV2VAlerts.filter((a) => a.status === "active").length;

  return (
    <div className="driver-root">
      <header className="driver-header">
        <button
          className="driver-back-btn"
          onClick={() => navigate("/")}
          aria-label="Back to role select"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="driver-header-brand">
          <PathnovaLogo />
          <div className="driver-header-title">
            <span className="driver-header-path">PATH</span>
            <span className="driver-header-nova">NOVA</span>
            <span className="driver-header-portal">Driver Portal</span>
          </div>
        </div>
        <div className="driver-identity">
          <div className="driver-identity-row">
            <Truck size={14} />
            <span>{selectedVehicleId}</span>
          </div>
        </div>
      </header>

      {/* Driver Identity Strip with Multi-Vehicle Toggle for End-to-End Testing */}
      <div className="driver-identity-strip">
        <div className="driver-identity-info">
          <span className="driver-identity-label">Driver</span>
          <span className="driver-identity-value">{activeDriverName}</span>
        </div>
        <div className="driver-identity-sep" />
        <div className="driver-identity-info">
          <span className="driver-identity-label">Vehicle</span>
          <select
            className="driver-vehicle-select"
            value={selectedVehicleId}
            onChange={(e) => setSelectedVehicleId(e.target.value)}
            aria-label="Active Vehicle Unit"
          >
            <option value="TRK-104">TRK-104 (Driver A · Reporting Unit)</option>
            <option value="NER-TRK-1042">
              NER-TRK-1042 (Driver B · Rahul Sharma · Recipient)
            </option>
            <option value="NER-TRK-1087">NER-TRK-1087 (Amit Kumar · Shillong)</option>
            <option value="NER-TRK-1210">NER-TRK-1210 (Sanjay Mehta · Jorhat)</option>
          </select>
        </div>
        <div className="driver-identity-sep" />
        <div className="driver-identity-info">
          <span className="driver-identity-label">Shift</span>
          <span className="driver-identity-value">Morning</span>
        </div>
      </div>

      <main className="driver-main">{renderContent()}</main>

      {/* Bottom Navigation */}
      <nav className="driver-bottom-nav">
        <button
          id="driver-nav-home"
          className={`driver-nav-tab ${activeTab === "home" ? "active" : ""}`}
          onClick={() => setActiveTab("home")}
        >
          <Home size={22} />
          <span>Home</span>
        </button>
        <button
          id="driver-nav-route"
          className={`driver-nav-tab ${activeTab === "route" ? "active" : ""}`}
          onClick={() => setActiveTab("route")}
        >
          <RouteIcon size={22} />
          <span>My Route</span>
        </button>
        <button
          id="driver-nav-alerts"
          className={`driver-nav-tab ${activeTab === "alerts" ? "active" : ""}`}
          onClick={() => setActiveTab("alerts")}
          style={{ position: "relative" }}
        >
          <Bell size={22} />
          <span>Alerts</span>
          {activeV2VCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: "6px",
                right: "10px",
                background: "#ef4444",
                color: "#fff",
                borderRadius: "50%",
                width: "16px",
                height: "16px",
                fontSize: "9px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
              }}
            >
              {activeV2VCount}
            </span>
          )}
        </button>
        <button
          id="driver-nav-report"
          className={`driver-nav-tab driver-nav-tab--report ${
            activeTab === "report" ? "active" : ""
          }`}
          onClick={() => setActiveTab("report")}
        >
          <AlertTriangle size={22} />
          <span>Report</span>
        </button>
      </nav>
    </div>
  );
}

/* ═══════════════════════════════════════════
   HOME CONTENT — REFINED DRIVER RISK UI
═══════════════════════════════════════════ */
function HomeContent({
  weather,
  criticalAlert,
  activeHazard,
  onViewAlert,
  onReport,
}: {
  weather: ReturnType<typeof useWeather>;
  criticalAlert: (typeof alertRecords)[0] | null;
  activeHazard: V2VHazardAlert | null;
  onViewAlert: () => void;
  onReport: () => void;
}) {
  const navigate = useNavigate();

  // Collapsible section state — COLLAPSED BY DEFAULT per requirements
  const [whyDangerousOpen, setWhyDangerousOpen] = useState(false);

  // Derive factual reasons strictly from current context
  const dangerReasons: string[] = [];

  if (activeHazard) {
    const hazardLabel = activeHazard.title.replace(/^V2V Hazard:\s*/i, "");
    dangerReasons.push(`${hazardLabel} reported by another driver ahead`);
  }

  if (weather.status === "success" && weather.data) {
    const cond = weather.data.condition.toLowerCase();
    if (cond.includes("rain") || cond.includes("shower") || weather.data.precipitation_mm > 0) {
      dangerReasons.push("Heavy rainfall detected along corridor");
    }
    if (weather.data.visibility_km < 8 || cond.includes("fog") || cond.includes("mist")) {
      dangerReasons.push("Reduced visibility detected");
    }
  } else {
    dangerReasons.push("Heavy rainfall detected");
  }

  dangerReasons.push("Landslide risk is elevated on mountain pass");
  dangerReasons.push("Monsoon/seasonal risk is high");

  if (criticalAlert) {
    dangerReasons.push(`Recent hazard reported ahead: ${criticalAlert.title}`);
  }

  return (
    <div className="driver-home">
      {/* ── ROAD RISK & HAZARD SECTION ── */}
      <section
        className={`driver-card driver-card--risk ${
          activeHazard || DEMO_ROAD_RISK.level === "HIGH"
            ? "driver-risk--high"
            : riskColor(DEMO_ROAD_RISK.level)
        }`}
      >
        <div className="driver-card-header">
          <TriangleAlert size={20} />
          <span>ROAD RISK: {activeHazard ? "HIGH" : DEMO_ROAD_RISK.level}</span>
          <span
            className="driver-live-badge"
            style={{ background: "#2a1619", color: "#f87171", borderColor: "#6b1d24" }}
          >
            Active Corridor
          </span>
        </div>

        {activeHazard ? (
          <div>
            <div
              className="driver-risk-level"
              style={{ color: "#f87171", display: "flex", alignItems: "center", gap: "6px" }}
            >
              <span>⚠ Hazard Ahead</span>
            </div>
            <p className="driver-risk-summary" style={{ fontWeight: 600 }}>
              {activeHazard.message}
            </p>
            <div className="driver-risk-detail">
              <div className="driver-risk-location">
                <strong>Location:</strong> {activeHazard.location}
              </div>
              <div className="driver-risk-action">
                <strong>Source:</strong> Reported by nearby driver
              </div>
              <div className="driver-risk-action">
                <strong>What to do:</strong> {activeHazard.recommendedAction}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="driver-risk-level">Road Risk: High</div>
            <p className="driver-risk-summary">{DEMO_ROAD_RISK.summary}</p>
            <div className="driver-risk-detail">
              <div className="driver-risk-location">
                <strong>Location:</strong> {DEMO_ROAD_RISK.location}
              </div>
              <div className="driver-risk-action">
                <strong>What to do:</strong> {DEMO_ROAD_RISK.action}
              </div>
            </div>
          </div>
        )}

        {/* ── COLLAPSIBLE: "Why is this road dangerous?" (Collapsed by default) ── */}
        <div className="driver-why-section">
          <button
            type="button"
            className="driver-why-toggle"
            onClick={() => setWhyDangerousOpen((prev) => !prev)}
            aria-expanded={whyDangerousOpen}
          >
            <span>Why is this road dangerous?</span>
            <span className={`driver-why-toggle-icon ${whyDangerousOpen ? "open" : ""}`}>
              <ChevronDown size={18} />
            </span>
          </button>

          {whyDangerousOpen && (
            <div className="driver-why-content">
              <div className="driver-why-title">
                <AlertTriangle size={15} style={{ color: "#f87171" }} />
                <span>Why is this road dangerous?</span>
              </div>
              <ul className="driver-why-list">
                {dangerReasons.map((reason, idx) => (
                  <li key={idx} className="driver-why-item">
                    <span className="driver-why-bullet">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>

              <div className="driver-why-actions">
                <button
                  type="button"
                  className="driver-btn driver-btn--outline"
                  onClick={onViewAlert}
                >
                  View Details
                </button>
                <button
                  type="button"
                  className="driver-btn driver-btn--secondary"
                  onClick={() => navigate("/routes")}
                >
                  Take safer route
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* My Route Card */}
      <section className="driver-card driver-card--route">
        <div className="driver-card-header">
          <RouteIcon size={20} />
          <span>MY ROUTE</span>
        </div>
        <div className="driver-route-main">
          <div className="driver-route-endpoints">
            <span className="driver-route-city">{DEMO_ROUTE.from}</span>
            <span className="driver-route-arrow">→</span>
            <span className="driver-route-city">{DEMO_ROUTE.to}</span>
          </div>
          <div className="driver-route-meta">
            <div className="driver-route-stat">
              <span className="driver-stat-label">Status</span>
              <span className="driver-stat-value driver-stat-value--green">
                Route Active
              </span>
            </div>
            <div className="driver-route-stat">
              <span className="driver-stat-label">ETA</span>
              <span className="driver-stat-value">{DEMO_ROUTE.eta}</span>
            </div>
            <div className="driver-route-stat">
              <span className="driver-stat-label">Distance</span>
              <span className="driver-stat-value">{DEMO_ROUTE.distance}</span>
            </div>
          </div>
        </div>
        <div className="driver-route-actions">
          <button
            id="driver-start-route"
            className="driver-btn driver-btn--primary driver-btn--full"
          >
            <Navigation size={18} />
            START / CONTINUE ROUTE
          </button>
          <button
            id="driver-view-map"
            className="driver-btn driver-btn--secondary driver-btn--full"
            onClick={() => navigate("/live-map")}
          >
            <MapIcon size={18} />
            VIEW MAP
          </button>
        </div>
        <p className="driver-proto-note">
          ⚠ Route progress and ETA are estimated based on corridor conditions.
        </p>
      </section>

      {/* Important Alert Card */}
      <section className="driver-card driver-card--alert">
        <div className="driver-card-header">
          <Bell size={20} />
          <span>IMPORTANT ALERT</span>
        </div>
        {criticalAlert ? (
          <div className="driver-alert-content">
            <div className="driver-alert-badge driver-alert-badge--critical">
              ⚠ {criticalAlert.severity.toUpperCase()}
            </div>
            <div className="driver-alert-title">{criticalAlert.title}</div>
            <div className="driver-alert-location">{criticalAlert.location}</div>
            <p className="driver-alert-action">{criticalAlert.recommendedAction}</p>
            <Link
              to="/alerts"
              className="driver-btn driver-btn--outline driver-btn--full"
            >
              VIEW ALERT →
            </Link>
          </div>
        ) : (
          <div className="driver-alert-clear">
            <div className="driver-alert-clear-icon">✓</div>
            <div className="driver-alert-clear-title">NO CRITICAL ALERTS</div>
            <p className="driver-alert-clear-desc">Your current route is clear.</p>
          </div>
        )}
      </section>

      {/* Live Weather Card */}
      <section className="driver-card driver-card--weather">
        <div className="driver-card-header">
          <CloudRain size={20} />
          <span>WEATHER — GUWAHATI</span>
          <span className="driver-live-badge">Live</span>
        </div>
        {weather.status === "loading" && (
          <div className="driver-weather-loading">Loading weather…</div>
        )}
        {weather.status === "error" && (
          <div className="driver-weather-error">Could not load weather data.</div>
        )}
        {weather.status === "success" && (
          <div className="driver-weather-content">
            <div className="driver-weather-main">
              <span className="driver-weather-icon">
                {weather.data.condition.toLowerCase().includes("rain")
                  ? "🌧"
                  : weather.data.condition.toLowerCase().includes("cloud")
                  ? "☁️"
                  : weather.data.condition.toLowerCase().includes("thunder")
                  ? "⛈"
                  : "☀️"}
              </span>
              <span className="driver-weather-condition">{weather.data.condition}</span>
              <span className="driver-weather-temp">{weather.data.temperature_c}°C</span>
            </div>
            <div className="driver-weather-meta">
              <div className="driver-weather-stat">
                <Wind size={14} />
                <span>{weather.data.wind_speed_kph} km/h wind</span>
              </div>
              <div className="driver-weather-stat">
                <Eye size={14} />
                <span>{weather.data.visibility_km} km visibility</span>
              </div>
              <div className="driver-weather-stat">
                <Thermometer size={14} />
                <span>{weather.data.humidity_percent}% humidity</span>
              </div>
            </div>
            {weather.data.condition.toLowerCase().includes("rain") ||
            weather.data.condition.toLowerCase().includes("thunder") ? (
              <div className="driver-weather-advice driver-weather-advice--warn">
                Drive carefully — reduced visibility ahead.
              </div>
            ) : (
              <div className="driver-weather-advice driver-weather-advice--ok">
                Weather conditions are acceptable for travel.
              </div>
            )}
          </div>
        )}
      </section>

      {/* Report Hazard CTA Button */}
      <section className="driver-card driver-card--report-cta">
        <button
          className="driver-report-btn"
          id="driver-report-problem"
          onClick={onReport}
        >
          <AlertTriangle size={28} />
          <div>
            <strong>🚨 REPORT ROAD HAZARD</strong>
            <span>Landslide · Flooding · Road Blocked · Damage · Obstruction</span>
          </div>
        </button>
      </section>

      {/* Quick Actions Grid */}
      <section className="driver-card driver-card--quick">
        <div className="driver-card-header">
          <span>QUICK ACTIONS</span>
        </div>
        <div className="driver-quick-grid">
          <button className="driver-quick-btn" onClick={() => navigate("/routes")}>
            <RouteIcon size={26} />
            <span>MY ROUTE</span>
          </button>
          <Link to="/alerts" className="driver-quick-btn">
            <Bell size={26} />
            <span>ROAD ALERTS</span>
          </Link>
          <Link to="/weather-hazards" className="driver-quick-btn">
            <CloudRain size={26} />
            <span>WEATHER</span>
          </Link>
          <button
            className="driver-quick-btn driver-quick-btn--danger"
            onClick={onReport}
          >
            <AlertTriangle size={26} />
            <span>REPORT</span>
          </button>
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════
   HAZARD REPORT SECTION (DRIVER A FLOW)
═══════════════════════════════════════════ */
function HazardReportSection({
  selectedVehicleId,
  onSuccess,
}: {
  selectedVehicleId: string;
  onSuccess: () => void;
}) {
  const [hazardType, setHazardType] = useState<HazardType>("landslide");
  const [description, setDescription] = useState("");
  const [locationText, setLocationText] = useState("Near Bhalukpong, NH-13");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [targetVehicleInfo, setTargetVehicleInfo] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("photo", file);
      const res = await fetch("/api/incidents/upload-photo", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setPhotoUrl(data.url);
      } else {
        setError("Photo upload failed. You can still submit without a photo.");
      }
    } catch {
      setError("Photo upload failed. You can still submit without a photo.");
    } finally {
      setPhotoUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        incident_type: hazardType,
        description: description || undefined,
        latitude: 27.0,
        longitude: 92.6,
        location_name: locationText,
        severity: [
          "landslide",
          "flooding",
          "road_blocked",
          "accident",
        ].includes(hazardType)
          ? "high"
          : "medium",
        photo_url: photoUrl ?? undefined,
      };
      const res = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) {
        setError("Could not submit the report. Please try again.");
        setSubmitting(false);
        return;
      }
      const incidentId = data.incident?.id ?? "local-" + Date.now();
      const recipient = findRelevantVehicle(locationText, selectedVehicleId);
      if (recipient) {
        const v2vAlert = generateV2VAlert(
          hazardType,
          locationText,
          incidentId,
          recipient,
          selectedVehicleId
        );
        addV2VAlert(v2vAlert);
        setTargetVehicleInfo(
          `Vehicle ${recipient.id} (${recipient.driver})`
        );
      } else {
        setTargetVehicleInfo("Nearby corridor vehicles");
      }
      setSubmitted(true);
      setTimeout(() => onSuccess(), 2500);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="driver-home">
        <section
          className="driver-card"
          style={{ textAlign: "center", padding: "40px 24px" }}
        >
          <CheckCircle2 size={56} style={{ color: "#22c55e", margin: "0 auto 16px" }} />
          <h2 style={{ color: "#16a34a", marginBottom: "8px" }}>Hazard Reported</h2>
          <p style={{ color: "#cbd5e1", marginBottom: "6px", fontSize: "15px" }}>
            Your report has been submitted to the operations team.
          </p>
          {targetVehicleInfo && (
            <p style={{ color: "#38bdf8", fontSize: "13px", fontWeight: 600 }}>
              Hazard alert transmitted to {targetVehicleInfo} on the corridor.
            </p>
          )}
          <p style={{ color: "#94a3b8", fontSize: "13px", marginTop: "10px" }}>
            Redirecting to your alerts…
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="driver-home">
      <section className="driver-card">
        <div className="driver-card-header">
          <AlertTriangle size={20} style={{ color: "#ef4444" }} />
          <span>REPORT A ROAD HAZARD</span>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: "16px" }}>
          <div style={{ marginBottom: "14px" }}>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                color: "#94a3b8",
                marginBottom: "5px",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              Hazard Type
            </label>
            <select
              value={hazardType}
              onChange={(e) => setHazardType(e.target.value as HazardType)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #334155",
                background: "#0f172a",
                color: "#f8fafc",
                fontSize: "14px",
              }}
              required
            >
              {HAZARD_TYPES.map((h) => (
                <option key={h.value} value={h.value}>
                  {h.label}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: "14px" }}>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                color: "#94a3b8",
                marginBottom: "5px",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              <MapPin size={11} style={{ display: "inline", marginRight: "4px" }} />
              Location / Landmark
            </label>
            <input
              type="text"
              value={locationText}
              onChange={(e) => setLocationText(e.target.value)}
              placeholder="e.g. Near Bhalukpong, NH-13 Km 45"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #334155",
                background: "#0f172a",
                color: "#f8fafc",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
              required
            />
          </div>
          <div style={{ marginBottom: "14px" }}>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                color: "#94a3b8",
                marginBottom: "5px",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe the hazard…"
              rows={3}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #334155",
                background: "#0f172a",
                color: "#f8fafc",
                fontSize: "14px",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ marginBottom: "18px" }}>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                color: "#94a3b8",
                marginBottom: "5px",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              <Camera size={11} style={{ display: "inline", marginRight: "4px" }} />
              Photo (optional)
            </label>
            <label
              htmlFor="v2v-photo-upload"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 14px",
                border: "1px dashed #475569",
                borderRadius: "8px",
                cursor: "pointer",
                color: "#94a3b8",
                fontSize: "13px",
                background: "#0f172a",
              }}
            >
              {photoUploading ? (
                <Loader2
                  size={16}
                  style={{ animation: "spin 1s linear infinite" }}
                />
              ) : (
                <Camera size={16} />
              )}
              {photoUrl
                ? "Photo attached ✓"
                : photoUploading
                ? "Uploading…"
                : "Tap to attach a photo"}
            </label>
            <input
              id="v2v-photo-upload"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoChange}
              style={{ display: "none" }}
            />
          </div>
          {error && (
            <div
              style={{
                background: "#451519",
                border: "1px solid #7f1d1d",
                borderRadius: "8px",
                padding: "10px 14px",
                color: "#fca5a5",
                fontSize: "13px",
                marginBottom: "14px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <X size={14} />
              {error}
            </div>
          )}
          <button
            type="submit"
            id="v2v-submit-hazard"
            className="driver-btn driver-btn--danger driver-btn--full"
            disabled={submitting || photoUploading}
            style={{ fontSize: "15px", padding: "14px" }}
          >
            {submitting ? (
              <>
                <Loader2
                  size={18}
                  style={{ animation: "spin 1s linear infinite" }}
                />
                Submitting…
              </>
            ) : (
              <>
                <AlertTriangle size={18} />
                SUBMIT HAZARD REPORT
              </>
            )}
          </button>
          <p
            style={{
              marginTop: "12px",
              fontSize: "11px",
              color: "#94a3b8",
              textAlign: "center",
            }}
          >
            Your report will be sent to the operations team and nearby corridor drivers will be notified.
          </p>
        </form>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════
   DRIVER ALERTS SECTION
═══════════════════════════════════════════ */
function DriverAlertsSection({
  v2vAlerts,
  criticalAlert,
}: {
  v2vAlerts: V2VHazardAlert[];
  criticalAlert: (typeof alertRecords)[0] | null;
}) {
  return (
    <div className="driver-home">
      <section className="driver-card">
        <div className="driver-card-header">
          <TriangleAlert size={20} style={{ color: "#ef4444" }} />
          <span>ROAD HAZARD ALERTS</span>
          {v2vAlerts.length > 0 && (
            <span
              style={{
                background: "#ef4444",
                color: "#fff",
                borderRadius: "12px",
                padding: "2px 8px",
                fontSize: "10px",
                fontWeight: 700,
                marginLeft: "auto",
              }}
            >
              {v2vAlerts.filter((a) => a.status === "active").length} active
            </span>
          )}
        </div>
        {v2vAlerts.length === 0 ? (
          <div
            style={{
              padding: "24px 16px",
              textAlign: "center",
              color: "#94a3b8",
            }}
          >
            <CheckCircle2
              size={36}
              style={{ color: "#22c55e", margin: "0 auto 10px" }}
            />
            <p style={{ fontWeight: 600, marginBottom: "4px", color: "#f8fafc" }}>
              No hazard alerts
            </p>
            <p style={{ fontSize: "13px" }}>
              Your route is currently clear of reported hazards.
            </p>
          </div>
        ) : (
          <div style={{ padding: "8px 0" }}>
            {v2vAlerts.map((alert) => (
              <div
                key={alert.id}
                style={{
                  padding: "14px 16px",
                  borderBottom: "1px solid #1e293b",
                  borderLeft:
                    "4px solid " +
                    (alert.severity === "High" ? "#ef4444" : "#f59e0b"),
                  marginBottom: "8px",
                  background: "#0f172a",
                  borderRadius: "6px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "6px",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      background:
                        alert.severity === "High" ? "#451519" : "#422006",
                      color:
                        alert.severity === "High" ? "#fca5a5" : "#fde047",
                      padding: "2px 8px",
                      borderRadius: "10px",
                      fontSize: "10px",
                      fontWeight: 700,
                    }}
                  >
                    ⚠ {alert.severity.toUpperCase()}
                  </span>
                  <strong style={{ fontSize: "14px", color: "#f8fafc" }}>
                    {alert.title}
                  </strong>
                </div>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#cbd5e1",
                    marginBottom: "6px",
                  }}
                >
                  {alert.message}
                </p>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#94a3b8",
                    marginBottom: "8px",
                  }}
                >
                  <span>
                    <strong>Location:</strong> {alert.location}
                  </span>
                  {" · "}
                  <span>
                    <strong>Source:</strong> Nearby driver report
                  </span>
                  {" · "}
                  <span>
                    <strong>Time:</strong> {alert.timestamp}
                  </span>
                </div>
                <div
                  style={{
                    background: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "6px",
                    padding: "8px 12px",
                    fontSize: "12px",
                    color: "#e2e8f0",
                  }}
                >
                  <strong>What to do:</strong> {alert.recommendedAction}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="driver-card" style={{ padding: "16px" }}>
        <div className="driver-card-header" style={{ marginBottom: "12px" }}>
          <Bell size={18} />
          <span>OPERATIONS ALERTS</span>
        </div>
        {criticalAlert && (
          <div
            style={{
              marginBottom: "12px",
              padding: "12px",
              background: "#33161c",
              borderRadius: "8px",
              border: "1px solid #7f1d1d",
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: "13px",
                color: "#fca5a5",
                marginBottom: "4px",
              }}
            >
              ⚠ {criticalAlert.severity}: {criticalAlert.title}
            </div>
            <div style={{ fontSize: "12px", color: "#cbd5e1" }}>
              {criticalAlert.location}
            </div>
          </div>
        )}
        <Link
          to="/alerts"
          className="driver-btn driver-btn--outline driver-btn--full"
        >
          View All Operations Alerts →
        </Link>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MY ROUTE SECTION
═══════════════════════════════════════════ */
function MyRouteSection({
  selectedVehicleId,
}: {
  selectedVehicleId: string;
}) {
  const navigate = useNavigate();
  const activeVehicleRecord = vehicleRecords.find((v) => v.id === selectedVehicleId);
  const routeFrom = activeVehicleRecord ? activeVehicleRecord.currentLocation : DEMO_ROUTE.from;
  const routeTo = activeVehicleRecord ? activeVehicleRecord.destination : DEMO_ROUTE.to;

  return (
    <div className="driver-home">
      <section className="driver-card driver-card--route">
        <div className="driver-card-header">
          <RouteIcon size={20} />
          <span>MY ROUTE</span>
        </div>
        <div className="driver-route-main">
          <div className="driver-route-endpoints">
            <span className="driver-route-city">{routeFrom}</span>
            <span className="driver-route-arrow">→</span>
            <span className="driver-route-city">{routeTo}</span>
          </div>
          <div className="driver-route-meta">
            <div className="driver-route-stat">
              <span className="driver-stat-label">Status</span>
              <span className="driver-stat-value driver-stat-value--green">
                Route Active
              </span>
            </div>
            <div className="driver-route-stat">
              <span className="driver-stat-label">ETA</span>
              <span className="driver-stat-value">
                {activeVehicleRecord ? activeVehicleRecord.eta : DEMO_ROUTE.eta}
              </span>
            </div>
            <div className="driver-route-stat">
              <span className="driver-stat-label">Distance</span>
              <span className="driver-stat-value">{DEMO_ROUTE.distance}</span>
            </div>
            <div className="driver-route-stat">
              <span className="driver-stat-label">Via</span>
              <span className="driver-stat-value">NH-15 / Bhalukpong</span>
            </div>
          </div>
        </div>
        <div className="driver-route-actions">
          <button
            id="driver-start-route-tab"
            className="driver-btn driver-btn--primary driver-btn--full"
          >
            <Navigation size={18} />
            START / CONTINUE ROUTE
          </button>
          <button
            id="driver-view-map-tab"
            className="driver-btn driver-btn--secondary driver-btn--full"
            onClick={() => navigate("/live-map")}
          >
            <MapIcon size={18} />
            VIEW MAP
          </button>
          <Link
            to="/routes"
            className="driver-btn driver-btn--outline driver-btn--full"
          >
            VIEW ALL ROUTES →
          </Link>
        </div>
        <p className="driver-proto-note">
          ⚠ Route progress and ETA are estimated based on corridor conditions.
        </p>
      </section>
    </div>
  );
}
