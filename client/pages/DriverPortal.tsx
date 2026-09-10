import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PathnovaLogo from "@/components/PathnovaLogo";
import { useWeather } from "@/hooks/use-weather";
import { alertRecords } from "@/data/alerts";
import {
  AlertTriangle,
  ArrowLeft,
  Bell,
  CloudRain,
  Eye,
  Home,
  Map as MapIcon,
  Navigation,
  Route as RouteIcon,
  Thermometer,
  Truck,
  Wind,
  TriangleAlert,
} from "lucide-react";

/* ─── Prototype route data (clearly labelled) ─── */
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
  action: "Slow down and follow the alternate route.",
};

/* ─── Helpers ─── */
function riskColor(level: "HIGH" | "MEDIUM" | "LOW") {
  if (level === "HIGH") return "driver-risk--high";
  if (level === "MEDIUM") return "driver-risk--medium";
  return "driver-risk--low";
}

function riskLabel(level: "HIGH" | "MEDIUM" | "LOW") {
  if (level === "HIGH") return "HIGH RISK";
  if (level === "MEDIUM") return "MEDIUM RISK";
  return "LOW RISK";
}

/* ─── Bottom nav tabs ─── */
type Tab = "home" | "route" | "alerts" | "report";

/* ─── Driver Portal ─── */
export default function DriverPortal() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("home");

  // Live weather from existing WeatherAPI integration
  const weather = useWeather("Guwahati");

  // Most critical alert from existing alert data
  const criticalAlert = alertRecords.find(
    (a) => a.severity === "Critical" || a.severity === "High"
  ) ?? null;

  /* ─── Tab content ─── */
  function renderContent() {
    switch (activeTab) {
      case "route":
        return <MyRouteSection />;
      case "alerts":
        // Navigate to full ops alerts page
        return (
          <div className="driver-tab-redirect">
            <TriangleAlert size={48} className="driver-redirect-icon" />
            <h2>Alert Centre</h2>
            <p>View the full list of active alerts in the Operations Portal.</p>
            <Link to="/alerts" className="driver-btn driver-btn--primary">
              Open Alerts →
            </Link>
          </div>
        );
      case "report":
        return (
          <div className="driver-tab-redirect">
            <AlertTriangle size={48} className="driver-redirect-icon driver-redirect-icon--red" />
            <h2>Report a Road Problem</h2>
            <p>
              Use the Incident Reporting form to submit road damage, flooding, landslides, or other hazards.
              Your report goes directly to the operations team.
            </p>
            <Link to="/incidents" className="driver-btn driver-btn--danger">
              🚨 Open Report Form →
            </Link>
          </div>
        );
      default:
        return <HomeContent weather={weather} criticalAlert={criticalAlert} />;
    }
  }

  return (
    <div className="driver-root">
      {/* ── Header ── */}
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
            <span>TRK-104</span>
          </div>
        </div>
      </header>

      {/* ── Identity strip ── */}
      <div className="driver-identity-strip">
        <div className="driver-identity-info">
          <span className="driver-identity-label">Driver</span>
          <span className="driver-identity-value">Assigned Driver</span>
        </div>
        <div className="driver-identity-sep" />
        <div className="driver-identity-info">
          <span className="driver-identity-label">Vehicle</span>
          <span className="driver-identity-value">TRK-104</span>
        </div>
        <div className="driver-identity-sep" />
        <div className="driver-identity-info">
          <span className="driver-identity-label">Shift</span>
          <span className="driver-identity-value">Morning</span>
        </div>
      </div>

      {/* ── Main content area ── */}
      <main className="driver-main">
        {renderContent()}
      </main>

      {/* ── Bottom navigation ── */}
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
        >
          <Bell size={22} />
          <span>Alerts</span>
        </button>
        <button
          id="driver-nav-report"
          className={`driver-nav-tab driver-nav-tab--report ${activeTab === "report" ? "active" : ""}`}
          onClick={() => setActiveTab("report")}
        >
          <AlertTriangle size={22} />
          <span>Report</span>
        </button>
      </nav>
    </div>
  );
}

/* ─── Home Content ─── */
function HomeContent({
  weather,
  criticalAlert,
}: {
  weather: ReturnType<typeof useWeather>;
  criticalAlert: (typeof alertRecords)[0] | null;
}) {
  const navigate = useNavigate();

  return (
    <div className="driver-home">
      {/* 1 — My Route (summary card) */}
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
              <span className="driver-stat-value driver-stat-value--green">Route Active</span>
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

      {/* 2 — Road Ahead */}
      <section className={`driver-card driver-card--risk ${riskColor(DEMO_ROAD_RISK.level)}`}>
        <div className="driver-card-header">
          <TriangleAlert size={20} />
          <span>ROAD AHEAD</span>
          <span className="driver-proto-badge">Simulated</span>
        </div>
        <div className="driver-risk-level">{riskLabel(DEMO_ROAD_RISK.level)}</div>
        <p className="driver-risk-summary">{DEMO_ROAD_RISK.summary}</p>
        <div className="driver-risk-detail">
          <div className="driver-risk-location">
            <strong>Location:</strong> {DEMO_ROAD_RISK.location}
          </div>
          <div className="driver-risk-action">
            <strong>What to do:</strong> {DEMO_ROAD_RISK.action}
          </div>
        </div>
      </section>

      {/* 3 — Important Alert */}
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
            <Link to="/alerts" className="driver-btn driver-btn--outline driver-btn--full">
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

      {/* 4 — Weather (live WeatherAPI integration) */}
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
                {weather.data.condition.toLowerCase().includes("rain") ? "🌧" :
                 weather.data.condition.toLowerCase().includes("cloud") ? "☁️" :
                 weather.data.condition.toLowerCase().includes("thunder") ? "⛈" : "☀️"}
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

      {/* 5 — Report a Problem CTA */}
      <section className="driver-card driver-card--report-cta">
        <Link to="/incidents" className="driver-report-btn" id="driver-report-problem">
          <AlertTriangle size={28} />
          <div>
            <strong>🚨 REPORT ROAD PROBLEM</strong>
            <span>Damage · Accident · Flooding · Landslide · Obstruction</span>
          </div>
        </Link>
      </section>

      {/* 6 — Quick Actions */}
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
          <Link to="/incidents" className="driver-quick-btn driver-quick-btn--danger">
            <AlertTriangle size={26} />
            <span>REPORT</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

/* ─── My Route full tab ─── */
function MyRouteSection() {
  const navigate = useNavigate();
  return (
    <div className="driver-home">
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
              <span className="driver-stat-value driver-stat-value--green">Route Active</span>
            </div>
            <div className="driver-route-stat">
              <span className="driver-stat-label">ETA</span>
              <span className="driver-stat-value">{DEMO_ROUTE.eta}</span>
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
