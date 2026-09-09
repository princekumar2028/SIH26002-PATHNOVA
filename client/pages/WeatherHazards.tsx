import { useMemo, useState } from "react";
import {
  Activity, AlertTriangle, BarChart3, Bell, BrainCircuit,
  ChevronDown, ChevronRight, CircleHelp, CloudLightning, CloudRain,
  FileText, Gauge, LayoutDashboard, Map as MapIcon, Menu, Moon,
  PanelLeftClose, PanelLeftOpen, RefreshCw, Route as RouteIcon,
  Settings, Sun, Truck, X, Waves, Mountain, Wind, Droplets, Eye,
  Thermometer, ShieldCheck, Zap, MapPin, Loader2, WifiOff,
} from "lucide-react";
import { Link } from "react-router-dom";
import PathnovaLogo from "@/components/PathnovaLogo";
import { regions } from "@/data/dashboard";
import {
  weatherAlerts,
  weatherByRegion,
  weatherStations,
  forecasts,
  rainfallForecast,
  WeatherRegion,
} from "@/data/weather";
import { useWeather } from "@/hooks/use-weather";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const NER_LOCATIONS = [
  "Guwahati",
  "Shillong",
  "Imphal",
  "Aizawl",
  "Kohima",
  "Agartala",
  "Itanagar",
  "Gangtok",
] as const;

const weatherRegions = regions.slice(1);

const nav: [string, any, string][] = [
  ["Overview", LayoutDashboard, "/"],
  ["Live Map", MapIcon, "/live-map"],
  ["Vehicles", Truck, "/vehicles"],
  ["Routes", RouteIcon, "/routes"],
  ["Risk Intelligence", BrainCircuit, "/risk-intelligence"],
  ["Incident Reporting", AlertTriangle, "/incidents"],
  ["Weather & Hazards", CloudRain, "/weather-hazards"],
  ["Alerts", Bell, "/alerts"],
];

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------

function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }: any) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);
  return (
    <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
      <div className="brand">
        <div className="brand-mark"><PathnovaLogo /></div>
        <div className="brand-copy">
          <strong><span className="path-wordmark">PATH</span><span className="nova-wordmark">NOVA</span></strong>
        </div>
        <button className="icon-button sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>
      <div className="mobile-close">
        <button className="icon-button" onClick={() => setMobileOpen(false)}><X size={20} /></button>
      </div>
      <nav className="nav-list">
        {nav.map(([label, Icon, href]) =>
          href === "#" ? (
            <button key={label} className="nav-item">
              <Icon size={18} /><span>{label}</span>
              {label === "Alerts" && <b className="nav-badge">23</b>}
            </button>
          ) : (
            <Link
              key={label}
              to={href}
              className={`nav-item ${label === "Weather & Hazards" ? "active" : ""}`}
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={18} /><span>{label}</span>
            </Link>
          )
        )}
      </nav>
      <div className="sidebar-bottom user-sidebar-bottom">
        <div className="profile-menu">
          <button type="button" className="profile" onClick={() => setProfileOpen(!profileOpen)} aria-expanded={profileOpen}>
            <div className="avatar">LA</div>
            <div className="profile-copy">
              <strong>{loggedOut ? "Signed out" : "Logistics Administrator"}</strong>
              <small>{loggedOut ? "Demo session ended" : "Operations Manager"}</small>
            </div>
            <ChevronDown size={16} />
          </button>
          {profileOpen && (
            <div className="profile-dropdown" role="menu">
              <button type="button" role="menuitem" onClick={() => setProfileOpen(false)}>Profile</button>
              <button type="button" role="menuitem" onClick={() => { setLoggedOut(true); setProfileOpen(false); }}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------

function Header({ region, setRegion, dark, setDark, setMobileOpen, lastUpdated }: any) {
  const [online, setOnline] = useState(true);
  return (
    <header className="topbar">
      <div className="mobile-menu">
        <button className="icon-button" onClick={() => setMobileOpen(true)}><Menu size={22} /></button>
      </div>
      <div className="title-block">
        <h1>Weather &amp; Hazard Intelligence</h1>
        <p>Monitor weather conditions and their impact on logistics across NER.</p>
      </div>
      <div className="header-actions">
        <div className="select-wrap">
          <MapIcon size={16} />
          <select value={region} onChange={e => setRegion(e.target.value)}>
            {weatherRegions.map(r => <option key={r}>{r}</option>)}
          </select>
          <ChevronDown size={14} />
        </div>
        <span className="date-header">
          {lastUpdated ? `Live · ${lastUpdated}` : "Last updated · 10:44 AM"}
        </span>
        <button className={`system-status ${online ? "online" : "offline"}`} onClick={() => setOnline(!online)}>
          <i />{online ? "Live Weather: Online" : "Weather Offline"}
        </button>
        <button className="icon-button" onClick={() => setDark(!dark)}>
          {dark ? <Sun size={19} /> : <Moon size={19} />}
        </button>
        <div className="header-avatar">LA</div>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// KPIs — driven by mock data (unchanged)
// ---------------------------------------------------------------------------

function Kpis({ weather }: { weather: WeatherRegion }) {
  const data: [string, string, string, any, string][] = [
    ["Regional Temperature", `${weather.temperature}°C`, `Feels like ${weather.feelsLike}°`, Thermometer, "blue"],
    ["Rainfall Today", `${weather.rainfall24h} mm`, "24 hour accumulation", Droplets, "blue"],
    ["Heavy Rain Alerts", "12", "Across selected region", CloudRain, "orange"],
    ["Flood Risk Zones", "8", "Monitoring river levels", Waves, "amber"],
    ["Landslide Risk Zones", "11", "Mountain corridors", Mountain, "red"],
    ["Weather-Affected Routes", `${weather.affectedRoutes}`, "Require attention", RouteIcon, "red"],
  ];
  return (
    <div className="kpi-grid weather-kpis">
      {data.map(([l, v, n, Icon, t]) => (
        <div className="kpi-card" key={l}>
          <div className="kpi-top">
            <span className={`kpi-icon ${t === "red" ? "text-red-600 bg-red-50" : t === "orange" ? "text-orange-600 bg-orange-50" : t === "amber" ? "text-amber-600 bg-amber-50" : "text-blue-600 bg-blue-50"}`}>
              <Icon size={18} />
            </span>
            <span className="muted">Live</span>
          </div>
          <div className="kpi-value">{v}</div>
          <div className="kpi-label">{l}</div>
          <div className="kpi-footer">
            <span className={`dot ${t}`} /><span className="muted">{n}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Live Weather Card — NEW: driven by real backend data
// ---------------------------------------------------------------------------

function LiveWeatherCard({
  location,
  setLocation,
  onWeatherUpdated,
}: {
  location: string;
  setLocation: (l: string) => void;
  onWeatherUpdated: (time: string) => void;
}) {
  const weather = useWeather(location);

  // Bubble up last_updated to header whenever we get fresh data
  if (weather.status === "success") {
    onWeatherUpdated(weather.data.last_updated);
  }

  return (
    <section className="panel current-weather">
      {/* Panel header with location selector */}
      <div className="panel-header">
        <div>
          <span className="eyebrow blue">LIVE CONDITIONS · WEATHERAPI.COM</span>
          <h2>Real-Time Weather</h2>
          <p>Live data from the PATHNOVA weather backend</p>
        </div>
        <CloudRain className="weather-big-icon" size={35} />
      </div>

      {/* NER Location Selector */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <MapPin size={15} style={{ color: "var(--teal, #299b8b)", flexShrink: 0 }} />
        <span style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted-text, #6b7280)" }}>
          Select Location
        </span>
        <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
          {NER_LOCATIONS.map(loc => (
            <button
              key={loc}
              onClick={() => setLocation(loc)}
              style={{
                padding: "0.25rem 0.625rem",
                borderRadius: "999px",
                fontSize: "0.75rem",
                fontWeight: 500,
                border: location === loc ? "1.5px solid #299b8b" : "1.5px solid #e5e7eb",
                background: location === loc ? "#e6f7f5" : "transparent",
                color: location === loc ? "#1a6b5e" : "inherit",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {weather.status === "loading" && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "2rem 0", color: "var(--muted-text, #6b7280)" }}>
          <Loader2 size={22} style={{ animation: "spin 1s linear infinite" }} />
          <span>Fetching live weather for <strong>{location}</strong>…</span>
        </div>
      )}

      {/* Error state */}
      {weather.status === "error" && (
        <div style={{
          display: "flex", alignItems: "flex-start", gap: "0.75rem",
          padding: "1rem", borderRadius: "0.5rem",
          background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b",
          marginBottom: "0.5rem",
        }}>
          <WifiOff size={18} style={{ flexShrink: 0, marginTop: "0.1rem" }} />
          <div>
            <strong style={{ display: "block", marginBottom: "0.2rem" }}>Weather data unavailable</strong>
            <span style={{ fontSize: "0.8rem" }}>{weather.message}</span>
          </div>
        </div>
      )}

      {/* Success state — real data */}
      {weather.status === "success" && (() => {
        const d = weather.data;
        return (
          <>
            <div className="current-main">
              <div className="current-temp">
                <img
                  src={d.condition_icon}
                  alt={d.condition}
                  width={56}
                  height={56}
                  style={{ marginBottom: "0.25rem" }}
                />
                <strong>{d.temperature_c}°</strong>
                <span>{d.condition}</span>
                <small style={{ marginTop: "0.2rem", color: "var(--muted-text, #6b7280)", fontSize: "0.75rem" }}>
                  {d.location_name}, {d.region}, {d.country}
                </small>
              </div>
              <div className="weather-stats">
                <span>
                  <b>Feels like {d.feels_like_c}°</b>
                  <small>Temperature</small>
                </span>
                <span>
                  <b>{d.humidity_percent}%</b>
                  <small>Humidity</small>
                </span>
                <span>
                  <b>{d.wind_speed_kph} km/h {d.wind_direction}</b>
                  <small>Wind</small>
                </span>
                <span>
                  <b>{d.visibility_km} km</b>
                  <small>Visibility</small>
                </span>
                <span>
                  <b>{d.precipitation_mm} mm</b>
                  <small>Precipitation</small>
                </span>
                <span>
                  <b style={{ color: "var(--teal, #299b8b)", fontSize: "0.7rem" }}>
                    {d.latitude.toFixed(4)}, {d.longitude.toFixed(4)}
                  </b>
                  <small>Coordinates</small>
                </span>
              </div>
            </div>
            <div style={{ marginTop: "0.75rem", fontSize: "0.72rem", color: "var(--muted-text, #6b7280)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <RefreshCw size={11} />
              Last updated: {d.last_updated} · Timezone: {d.timezone}
            </div>
          </>
        );
      })()}

      {/* Idle state */}
      {weather.status === "idle" && (
        <p style={{ color: "var(--muted-text, #6b7280)", fontSize: "0.875rem" }}>
          Select a location above to fetch live weather data.
        </p>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Mock CurrentWeather — kept for the existing mock data flow
// ---------------------------------------------------------------------------

function CurrentWeather({ weather }: { weather: WeatherRegion }) {
  return (
    <section className="panel current-weather" style={{ display: "none" }}>
      {/* Hidden — replaced by LiveWeatherCard above */}
    </section>
  );
}

// ---------------------------------------------------------------------------
// WeatherMap (unchanged)
// ---------------------------------------------------------------------------

function WeatherMap({ weather }: { weather: WeatherRegion }) {
  const [layers, setLayers] = useState(true);
  return (
    <section className="panel weather-map-panel">
      <div className="panel-header">
        <div>
          <h2>Regional Weather &amp; Hazard Map</h2>
          <p>Weather stations, rainfall intensity and logistics impact overlays</p>
        </div>
        <button className="outline-button" onClick={() => setLayers(!layers)}>
          <MapIcon size={14} /> {layers ? "Layers active" : "Layers off"}
        </button>
      </div>
      <div className="weather-map">
        <div className="map-grid">
          <div className="district-lines" />
          <div className="region-shape" />
          <svg className="routes-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M20 73 C32 62 39 40 47 29 S63 50 70 76" className="route-line route-red" />
            <path d="M21 73 C33 79 56 79 70 76" className="route-line route-green" />
            <path d="M47 29 C52 49 58 65 70 76" className="route-line route-yellow" />
          </svg>
          {["Guwahati", "Itanagar", "Shillong", "Imphal", "Aizawl", "Kohima", "Agartala", "Gangtok", "Silchar", "Bomdila"].map((n, i) => (
            <div className="city" key={n} style={{ left: `${[22, 47, 31, 70, 60, 79, 44, 5, 51, 38][i]}%`, top: `${[72, 29, 79, 76, 91, 56, 94, 67, 84, 41][i]}%` }}>
              <i />{n}
            </div>
          ))}
          {layers && <>{[[36, 43, "orange"], [39, 35, "orange"], [31, 78, "red"], [51, 84, "amber"], [70, 76, "amber"], [60, 91, "amber"]].map(([x, y, t], i) => (
            <span key={i} className={`weather-zone ${t}`} style={{ left: `${x}%`, top: `${y}%` }} />
          ))}</>}
        </div>
        <div className="map-controls">
          <button>+</button><button>−</button>
          <button><MapIcon size={14} /></button><button>□</button>
        </div>
        <div className="weather-legend">
          <strong>HAZARD LEVEL</strong>
          <span><i className="legend-green" />Low</span>
          <span><i className="legend-yellow" />Moderate</span>
          <span><i className="legend-orange" />High</span>
          <span><i className="legend-critical" />Critical</span>
        </div>
        <div className="map-weather-label">
          <CloudRain size={14} /> {weather.condition} · {weather.rainfall3h} mm
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Hazards (unchanged)
// ---------------------------------------------------------------------------

function Hazards() {
  const cards: [string, number, string, string, any, string][] = [
    ["Flood Risk", 68, "Silchar, Guwahati", "Heavy rainfall + river level increase", Waves, "High"],
    ["Landslide Risk", 79, "Bhalukpong, Bomdila", "Continuous rainfall + unstable terrain", Mountain, "High"],
    ["Severe Weather", 42, "Meghalaya, Assam", "Strong wind + thunderstorms", CloudLightning, "Medium"],
    ["Flash Flood Risk", 61, "Arunachal Pradesh", "High-intensity rainfall", Waves, "Medium-High"],
  ];
  return (
    <section className="hazards-section">
      <div className="section-heading">
        <div>
          <h2>Hazard Monitoring</h2>
          <p>Active environmental risks affecting regional access</p>
        </div>
      </div>
      <div className="hazard-cards">
        {cards.map(([l, v, a, r, Icon, s]) => (
          <div className="panel hazard-card" key={l}>
            <div className="hazard-card-top">
              <span className="hazard-icon"><Icon size={18} /></span>
              <span className={`status-pill ${s === "High" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>{s}</span>
            </div>
            <h3>{l}</h3>
            <strong className={`risk-${s === "High" ? "red" : "amber"}`}>{v}%</strong>
            <p><b>Affected:</b> {a}</p>
            <small>{r}</small>
            <div className="hazard-progress"><i style={{ width: `${v}%` }} /></div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Impact (unchanged)
// ---------------------------------------------------------------------------

function Impact({ weather }: { weather: WeatherRegion }) {
  return (
    <section className="panel impact-panel">
      <div className="panel-header">
        <div>
          <h2>Weather Impact on Logistics</h2>
          <p>How current conditions affect operations</p>
        </div>
        <span className="status-pill bg-amber-50 text-amber-700">Moderate impact</span>
      </div>
      <div className="impact-stats">
        <span><b>{weather.affectedRoutes}</b>Affected routes</span>
        <span><b>14</b>Delayed vehicles</span>
        <span><b>7</b>High-risk vehicles</span>
        <span><b>6h 40m</b>Total delay</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Route</th><th>Weather</th><th>Risk</th><th>Expected Delay</th><th>Vehicles</th><th>Action</th></tr></thead>
          <tbody>
            {[["Guwahati → Itanagar", "Heavy Rain", "High", "+45 min", "8"], ["Shillong → Silchar", "Heavy Rain", "Medium", "+30 min", "4"], ["Silchar → Aizawl", "Flood Risk", "High", "+70 min", "5"]].map(r => (
              <tr key={r[0]}>
                <td><strong>{r[0]}</strong></td><td>{r[1]}</td>
                <td><b className={r[2] === "High" ? "risk-red" : "risk-amber"}>{r[2]}</b></td>
                <td>{r[3]}</td><td>{r[4]}</td>
                <td><button className="view-button">View route</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Forecast (unchanged)
// ---------------------------------------------------------------------------

function Forecast() {
  return (
    <section className="panel forecast-weather">
      <div className="panel-header">
        <div><h2>24-Hour Weather Forecast</h2><p>Selected region · operational outlook</p></div>
        <span className="eyebrow blue">LIVE FORECAST</span>
      </div>
      <div className="forecast-cards">
        {forecasts.map(f => (
          <div key={f.day}>
            <strong>{f.day}</strong>
            <CloudRain size={19} />
            <b>{f.temp}°C</b>
            <span>{f.condition}</span>
            <small>{f.probability}% rain · {f.rainfall} mm</small>
            <em className={f.hazard === "High" ? "risk-red" : "risk-amber"}>{f.hazard} hazard</em>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Alerts (unchanged)
// ---------------------------------------------------------------------------

function AlertsSection() {
  return (
    <section className="panel weather-alerts">
      <div className="panel-header">
        <div><h2>Active Weather Alerts</h2><p>Conditions requiring operator awareness</p></div>
        <span className="status-pill bg-red-50 text-red-700">3 active</span>
      </div>
      {weatherAlerts.map(a => (
        <div className="weather-alert" key={a.title}>
          <span className={`alert-icon ${a.tone}`}><AlertTriangle size={15} /></span>
          <span><strong>{a.title}</strong><small>{a.location} · {a.detail}</small></span>
          <b>{a.impact}</b>
          <ChevronRight size={14} />
        </div>
      ))}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Rainfall (unchanged)
// ---------------------------------------------------------------------------

function Rainfall() {
  return (
    <section className="panel rainfall">
      <div className="panel-header">
        <div><h2>Rainfall Intelligence</h2><p>Guwahati station · mm precipitation</p></div>
        <Droplets size={19} className="weather-icon" />
      </div>
      <div className="rainfall-stats">
        <span><b>18 mm</b>Current</span>
        <span><b>42 mm</b>Last 6 hours</span>
        <span><b>76 mm</b>Last 24 hours</span>
        <span><b>92 mm</b>Forecast 24 hours</span>
      </div>
      <div className="rainfall-chart">
        <svg viewBox="0 0 600 130" preserveAspectRatio="none">
          <path d="M0 105 L120 75 L240 52 L360 30 L480 56 L600 79 L600 130 L0 130Z" fill="#3e9ac322" />
          <path d="M0 105 L120 75 L240 52 L360 30 L480 56 L600 79" fill="none" stroke="#299b8b" strokeWidth="3" />
        </svg>
        <div>
          {rainfallForecast.map(([x, y]) => (
            <span key={x}><b>{y}</b>{x}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// AI Impact (unchanged)
// ---------------------------------------------------------------------------

function AiImpact() {
  return (
    <section className="panel weather-ai">
      <div className="ai-heading">
        <span className="ai-icon"><BrainCircuit size={19} /></span>
        <div><h2>AI Weather Impact Prediction</h2><p>Route disruption early warning</p></div>
        <span className="ai-badge">91% CONFIDENCE</span>
      </div>
      <p className="weather-ai-message">
        Heavy rainfall is expected to significantly increase disruption probability on the Guwahati → Itanagar corridor over the next 6 hours.
      </p>
      <div className="ai-score-row">
        <span><b>42%</b>Current risk</span>
        <span><b className="risk-red">78%</b>Predicted risk</span>
        <span><b>+45–70 min</b>Expected impact</span>
      </div>
      <div className="ai-factors">
        <span>Heavy rainfall</span>
        <span>Wet road surface</span>
        <span>Landslide-prone terrain</span>
        <span>Historical disruption pattern</span>
      </div>
      <div className="ai-actions">
        <button className="primary-button">View risk analysis <ChevronRight size={14} /></button>
        <button className="outline-button">Find safer route</button>
        <button className="outline-button">Alert vehicles</button>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Stations (unchanged)
// ---------------------------------------------------------------------------

function Stations() {
  return (
    <section className="panel stations">
      <div className="panel-header">
        <div><h2>Weather Monitoring Stations</h2><p>Regional sensor network · simulated prototype data</p></div>
        <span className="status-pill bg-green-50 text-green-700">4 online</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Station</th><th>Location</th><th>Temp</th><th>Rainfall</th><th>Wind</th><th>Humidity</th><th>Hazard</th><th>Updated</th></tr>
          </thead>
          <tbody>
            {weatherStations.map(s => (
              <tr key={s[0]}>
                {s.map((x, i) => (
                  <td key={i} className={i === 6 ? `risk-${x === "Critical" ? "red" : x === "High" ? "orange" : "amber"}` : i === 0 ? "station-id" : ""}>
                    {i === 0 ? <strong>{x}</strong> : x}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Pipeline (unchanged)
// ---------------------------------------------------------------------------

function Pipeline() {
  const steps: [any, string][] = [
    [CloudRain, "Weather API"],
    [Droplets, "Rainfall & Forecast"],
    [AlertTriangle, "Hazard Detection"],
    [BrainCircuit, "ML Risk Prediction"],
    [RouteIcon, "Route Impact"],
    [Zap, "AI Recommendation"],
    [Bell, "Operator Alert"],
  ];
  return (
    <section className="panel weather-pipeline">
      <div className="panel-header">
        <div><h2>Weather → Risk Pipeline</h2><p>How environmental signals become an operator decision</p></div>
      </div>
      <div className="weather-pipeline-flow">
        {steps.map(([Icon, label], i) => (
          <div key={label}>
            <span><Icon size={15} /></span>
            <b>{label}</b>
            {i < 6 && <ChevronRight size={13} />}
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Page root
// ---------------------------------------------------------------------------

export default function WeatherHazards() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [region, setRegion] = useState("Assam");
  const [dark, setDark] = useState(false);
  const [scenario, setScenario] = useState("Normal");
  const [refresh, setRefresh] = useState(false);

  // Live weather location — default to Guwahati
  const [liveLocation, setLiveLocation] = useState("Guwahati");
  const [liveLastUpdated, setLiveLastUpdated] = useState("");

  const weather = weatherByRegion[region];

  const values: Record<string, [number, number, number, number]> = {
    Normal: [32, 12, 20, 8],
    "Moderate Rain": [45, 18, 35, 12],
    "Heavy Rain": [58, 24, 60, 18],
    "Extreme Rain": [78, 31, 95, 27],
    Thunderstorm: [67, 25, 70, 20],
    "Flood Conditions": [72, 31, 88, 24],
  };

  return (
    <div className={dark ? "app-shell dark-mode" : "app-shell"}>
      <Sidebar {...{ collapsed, setCollapsed, mobileOpen, setMobileOpen }} />
      <main className="main-shell">
        <Header
          {...{ region, setRegion, dark, setDark, setMobileOpen }}
          lastUpdated={liveLastUpdated}
        />
        <div className="dashboard weather-dashboard">
          <div className="dashboard-intro">
            <div>
              <span className="eyebrow blue">WEATHER OPERATIONS · HAZARD INTELLIGENCE</span>
              <h2>Weather &amp; Hazard Monitoring</h2>
              <p>Track rainfall, floods, landslides and weather-affected routes before they disrupt operations.</p>
            </div>
            <button className="outline-button" onClick={() => setRefresh(!refresh)}>
              <RefreshCw size={14} /> Refresh data
            </button>
          </div>

          <Kpis weather={weather} />

          <div className="weather-top-grid">
            {/* Live weather card replaces the mock CurrentWeather */}
            <LiveWeatherCard
              location={liveLocation}
              setLocation={setLiveLocation}
              onWeatherUpdated={setLiveLastUpdated}
            />
            <WeatherMap weather={weather} />
          </div>

          <Forecast />
          <Hazards />

          <div className="weather-two-col">
            <Rainfall />
            <AlertsSection />
          </div>

          <Impact weather={weather} />
          <AiImpact />

          <div className="panel weather-simulator">
            <div className="panel-header">
              <div>
                <h2>Weather Scenario Simulator</h2>
                <p>Preview how changing conditions affect logistics access.</p>
              </div>
              <span className="eyebrow blue">MOCK SIMULATION</span>
            </div>
            <div className="weather-sim-body">
              <div className="weather-sim-tabs">
                {Object.keys(values).map(s => (
                  <button className={scenario === s ? "active" : ""} onClick={() => setScenario(s)} key={s}>{s}</button>
                ))}
              </div>
              <div className="sim-weather-result">
                <span>{scenario} scenario</span>
                <strong>Risk {values[scenario][0]}% <em>→</em> {values[scenario][1]} routes affected</strong>
                <small>Expected delay +{values[scenario][2]} min · {values[scenario][3]} vehicles affected</small>
              </div>
            </div>
          </div>

          <div className="weather-two-col">
            <Stations />
            <Pipeline />
          </div>

          <section className="panel weather-action">
            <div>
              <span className="ai-icon"><BrainCircuit size={18} /></span>
              <div>
                <h2>AI Recommended Action</h2>
                <p>Due to increasing rainfall and landslide probability along the Bhalukpong corridor, avoid the affected segment during the next 4–6 hours. Use the alternate route with lower predicted disruption probability.</p>
              </div>
            </div>
            <div>
              <span className="status-pill bg-red-50 text-red-700">HIGH PRIORITY · 91% CONFIDENCE</span>
              <button className="primary-button">View alternate route <ChevronRight size={14} /></button>
              <button className="outline-button">Alert fleet</button>
            </div>
          </section>

          <p className="mock-disclaimer">
            Hazard, forecast and simulation values are illustrative for the prototype.
            The &quot;Real-Time Weather&quot; panel above shows live data from the PATHNOVA backend.
          </p>
        </div>
      </main>
    </div>
  );
}
