import { useState, useEffect } from "react";
import {
  AlertTriangle,
  Bell,
  BrainCircuit,
  ChevronDown,
  ChevronRight,
  CloudLightning,
  CloudRain,
  LayoutDashboard,
  Map as MapIcon,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  RefreshCw,
  Route as RouteIcon,
  Sun,
  Truck,
  X,
  Waves,
  Mountain,
  MapPin,
  Loader2,
  WifiOff,
} from "lucide-react";
import { Link } from "react-router-dom";
import PathnovaLogo from "@/components/PathnovaLogo";
import { regions } from "@/data/dashboard";
import { weatherByRegion, WeatherRegion } from "@/data/weather";
import { useWeather } from "@/hooks/use-weather";

// ---------------------------------------------------------------------------
// Constants & Navigation
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
  ["Overview", LayoutDashboard, "/dashboard"],
  ["Routes", RouteIcon, "/routes"],
  ["Live Map", MapIcon, "/live-map"],
  ["Vehicles", Truck, "/vehicles"],
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
        <button
          className="icon-button sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>
      <div className="mobile-close">
        <button className="icon-button" onClick={() => setMobileOpen(false)} aria-label="Close menu">
          <X size={20} />
        </button>
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
          <button
            type="button"
            className="profile"
            onClick={() => setProfileOpen(!profileOpen)}
            aria-expanded={profileOpen}
          >
            <div className="avatar">LA</div>
            <div className="profile-copy">
              <strong>{loggedOut ? "Signed out" : "Logistics Administrator"}</strong>
              <small>{loggedOut ? "Session ended" : "Operations Manager"}</small>
            </div>
            <ChevronDown size={16} />
          </button>
          {profileOpen && (
            <div className="profile-dropdown" role="menu">
              <button type="button" role="menuitem" onClick={() => setProfileOpen(false)}>Profile</button>
              <button
                type="button"
                role="menuitem"
                onClick={() => { setLoggedOut(true); setProfileOpen(false); }}
              >
                Logout
              </button>
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
        <button className="icon-button" onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <Menu size={22} />
        </button>
      </div>
      <div className="title-block">
        <h1>Weather &amp; Hazard Intelligence</h1>
        <p>Monitor real-time weather conditions, environmental hazards and logistics impact across NER.</p>
      </div>
      <div className="header-actions">
        <div className="select-wrap">
          <MapIcon size={16} />
          <select value={region} onChange={(e) => setRegion(e.target.value)} aria-label="Select region">
            {weatherRegions.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          <ChevronDown size={14} />
        </div>
        <span className="date-header">
          {lastUpdated ? `Live · ${lastUpdated}` : "Last updated · 10:44 AM"}
        </span>
        <button
          className={`system-status ${online ? "online" : "offline"}`}
          onClick={() => setOnline(!online)}
          aria-label="Toggle Live Weather status"
        >
          <i />{online ? "Live Weather: Online" : "Weather Offline"}
        </button>
        <button
          className="icon-button"
          onClick={() => setDark(!dark)}
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {dark ? <Sun size={19} /> : <Moon size={19} />}
        </button>
        <div className="header-avatar">LA</div>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// 1. LIVE WEATHER — Real backend WeatherAPI integration
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

  const lastUpdatedValue = weather.status === "success" ? weather.data.last_updated : null;
  useEffect(() => {
    if (lastUpdatedValue) {
      onWeatherUpdated(lastUpdatedValue);
    }
  }, [lastUpdatedValue, onWeatherUpdated]);

  return (
    <section className="panel current-weather">
      <div className="panel-header">
        <div>
          <span className="eyebrow blue">LIVE CONDITIONS · WEATHERAPI.COM</span>
          <h2>Real-Time Weather</h2>
          <p>Live telemetry from the PATHNOVA weather backend</p>
        </div>
        <CloudRain className="weather-big-icon" size={32} />
      </div>

      {/* Location Selector */}
      <div style={{ padding: "0 20px 14px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "var(--teal, #299b8b)" }}>
          <MapPin size={14} />
          <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>
            City:
          </span>
        </div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {NER_LOCATIONS.map((loc) => (
            <button
              key={loc}
              type="button"
              className={`weather-loc-btn ${location === loc ? "active" : ""}`}
              onClick={() => setLocation(loc)}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {weather.status === "loading" && (
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "28px 20px", color: "#6e8394" }}>
          <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />
          <span style={{ fontSize: "12px" }}>Fetching live weather for <strong>{location}</strong>…</span>
        </div>
      )}

      {/* Error State */}
      {weather.status === "error" && (
        <div style={{
          display: "flex", alignItems: "flex-start", gap: "10px",
          margin: "12px 20px", padding: "12px 14px", borderRadius: "8px",
          background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b",
        }}>
          <WifiOff size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
          <div>
            <strong style={{ display: "block", fontSize: "11px", marginBottom: "2px" }}>Weather service notice</strong>
            <span style={{ fontSize: "10px" }}>{weather.message}</span>
          </div>
        </div>
      )}

      {/* Success State — Real Data */}
      {weather.status === "success" && (() => {
        const d = weather.data;
        return (
          <>
            <div className="current-main">
              <div className="current-temp">
                <img
                  src={d.condition_icon}
                  alt={d.condition}
                  width={54}
                  height={54}
                  style={{ marginBottom: "2px" }}
                />
                <strong>{d.temperature_c}°</strong>
                <span>{d.condition}</span>
                <small style={{ marginTop: "3px", color: "#748695", fontSize: "10px" }}>
                  {d.location_name}, {d.region}, {d.country}
                </small>
              </div>

              <div className="weather-stats">
                <span>
                  <b>Feels like {d.feels_like_c}°C</b>
                  <small>Apparent Temp</small>
                </span>
                <span>
                  <b>{d.humidity_percent}%</b>
                  <small>Humidity</small>
                </span>
                <span>
                  <b>{d.wind_speed_kph} km/h {d.wind_direction}</b>
                  <small>Wind Velocity</small>
                </span>
                <span>
                  <b>{d.precipitation_mm} mm</b>
                  <small>Precipitation</small>
                </span>
                <span>
                  <b>{d.visibility_km} km</b>
                  <small>Visibility</small>
                </span>
                <span>
                  <b style={{ color: "#299b8b", fontSize: "10px" }}>
                    {d.latitude.toFixed(2)}° N, {d.longitude.toFixed(2)}° E
                  </b>
                  <small>Coordinates</small>
                </span>
              </div>
            </div>

            <div style={{ padding: "10px 20px 0", fontSize: "9px", color: "#8496a5", display: "flex", alignItems: "center", gap: "6px" }}>
              <RefreshCw size={11} />
              Live observation: {d.last_updated} · Local Timezone: {d.timezone}
            </div>
          </>
        );
      })()}

      {weather.status === "idle" && (
        <p style={{ color: "#728495", fontSize: "11px", padding: "14px 20px" }}>
          Select an NER city above to load real-time meteorological telemetry.
        </p>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// 2. HAZARD RISK / WEATHER HAZARD STATUS
// ---------------------------------------------------------------------------

function Hazards() {
  const cards: [string, number, string, string, any, string][] = [
    ["Flood Risk", 68, "Silchar, Guwahati", "Heavy rainfall + river catchment swell", Waves, "High"],
    ["Landslide Risk", 79, "Bhalukpong, Bomdila", "Saturated hill slope + rockfall susceptibility", Mountain, "High"],
    ["Severe Weather", 42, "Meghalaya, Assam", "Convective storm cells + strong gusts", CloudLightning, "Medium"],
    ["Flash Flood Risk", 61, "Arunachal Foothills", "Intense localized cloudburst accumulation", Waves, "Medium-High"],
  ];

  return (
    <section className="hazards-section">
      <div className="section-heading">
        <div>
          <h2>Hazard Risk &amp; Status</h2>
          <p>Active environmental hazards impacting regional logistics corridors</p>
        </div>
      </div>
      <div className="hazard-cards">
        {cards.map(([l, v, a, r, Icon, s]) => (
          <div className="panel hazard-card" key={l}>
            <div className="hazard-card-top">
              <span className="hazard-icon"><Icon size={18} /></span>
              <span className={`status-pill ${s.includes("High") ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>
                {s.toUpperCase()}
              </span>
            </div>
            <h3>{l}</h3>
            <strong className={`risk-${s.includes("High") ? "red" : "amber"}`}>{v}%</strong>
            <p><b>Corridors:</b> {a}</p>
            <small>{r}</small>
            <div className="hazard-progress"><i style={{ width: `${v}%` }} /></div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 3. REGIONAL WEATHER MAP
// ---------------------------------------------------------------------------

function WeatherMap({ weather }: { weather: WeatherRegion }) {
  const [layers, setLayers] = useState(true);

  return (
    <section className="panel weather-map-panel">
      <div className="panel-header">
        <div>
          <h2>Regional Weather &amp; Hazard Map</h2>
          <p>Geographic hazard zones, rainfall intensity and corridor connectivity</p>
        </div>
        <button className="outline-button" onClick={() => setLayers(!layers)}>
          <MapIcon size={14} /> {layers ? "Hazard zones: Visible" : "Hazard zones: Hidden"}
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
            <div
              className="city"
              key={n}
              style={{
                left: `${[22, 47, 31, 70, 60, 79, 44, 5, 51, 38][i]}%`,
                top: `${[72, 29, 79, 76, 91, 56, 94, 67, 84, 41][i]}%`
              }}
            >
              <i />{n}
            </div>
          ))}
          {layers && (
            <>
              {[[36, 43, "orange"], [39, 35, "orange"], [31, 78, "red"], [51, 84, "amber"], [70, 76, "amber"], [60, 91, "amber"]].map(([x, y, t], i) => (
                <span key={i} className={`weather-zone ${t}`} style={{ left: `${x}%`, top: `${y}%` }} />
              ))}
            </>
          )}
        </div>

        <div className="map-controls">
          <button aria-label="Zoom in">+</button>
          <button aria-label="Zoom out">−</button>
          <button aria-label="Map layers"><MapIcon size={14} /></button>
          <button aria-label="Reset">□</button>
        </div>

        <div className="weather-legend">
          <strong>HAZARD SEVERITY</strong>
          <span><i className="legend-green" />Low Risk</span>
          <span><i className="legend-yellow" />Moderate</span>
          <span><i className="legend-orange" />High Risk</span>
          <span><i className="legend-critical" />Critical</span>
        </div>

        <div className="map-weather-label">
          <CloudRain size={14} /> Regional Status: {weather.condition} · {weather.rainfall3h} mm/3h
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 4. WEATHER IMPACT
// ---------------------------------------------------------------------------

function Impact({ weather }: { weather: WeatherRegion }) {
  const routes = [
    { name: "Guwahati → Itanagar", weather: "Heavy Rain", hazard: "Flash Flood Threat", risk: "High", delay: "+45 min", vehicles: "8" },
    { name: "Bhalukpong → Bomdila", weather: "Continuous Rain", hazard: "Landslide Risk", risk: "High", delay: "+90 min", vehicles: "6" },
    { name: "Shillong → Silchar", weather: "Moderate Rain", hazard: "Waterlogging", risk: "Medium", delay: "+30 min", vehicles: "4" },
    { name: "Silchar → Aizawl", weather: "River Swell", hazard: "Flood Inundation", risk: "High", delay: "+70 min", vehicles: "5" },
  ];

  return (
    <section className="panel impact-panel" style={{ marginTop: "18px" }}>
      <div className="panel-header">
        <div>
          <h2>Weather Impact on Logistics Corridors</h2>
          <p>Practical operational disruption assessment across key transit routes</p>
        </div>
        <span className="status-pill bg-amber-50 text-amber-700">Moderate Regional Impact</span>
      </div>

      <div className="impact-stats">
        <span><b>{weather.affectedRoutes}</b>Affected routes</span>
        <span><b>14</b>Delayed convoys</span>
        <span><b>7</b>High-risk vehicles</span>
        <span><b>6h 40m</b>Cumulative delay</span>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Corridor Route</th>
              <th>Weather Condition</th>
              <th>Primary Hazard</th>
              <th>Risk Severity</th>
              <th>Expected Delay</th>
              <th>Active Convoys</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((r) => (
              <tr key={r.name}>
                <td><strong>{r.name}</strong></td>
                <td>{r.weather}</td>
                <td>{r.hazard}</td>
                <td><b className={r.risk === "High" ? "risk-red" : "risk-amber"}>{r.risk}</b></td>
                <td>{r.delay}</td>
                <td>{r.vehicles}</td>
                <td>
                  <Link to="/routes" className="view-button">Inspect route</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 5. AI RECOMMENDATION (Decision Support Prototype)
// ---------------------------------------------------------------------------

function AiRecommendation() {
  return (
    <section className="panel weather-action" style={{ marginTop: "18px" }}>
      <div>
        <span className="ai-icon"><BrainCircuit size={18} /></span>
        <div>
          <h2>AI Recommended Action</h2>
          <p>
            Due to sustained precipitation and elevated landslide probability along the <strong>Bhalukpong–Bomdila corridor (NH-13)</strong>, logistics dispatchers should reroute non-essential supply convoys via Tezpur bypass. Restrict heavy convoy movement until slope saturation recedes.
          </p>
        </div>
      </div>
      <div>
        <span className="status-pill bg-red-50 text-red-700">DECISION SUPPORT ADVISORY</span>
        <Link to="/routes" className="primary-button">View alternate route <ChevronRight size={14} /></Link>
        <button
          className="outline-button"
          onClick={() => alert("Weather advisory broadcasted to fleet drivers in active corridors.")}
        >
          Alert fleet
        </button>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------

export default function WeatherHazards() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [region, setRegion] = useState("Assam");
  const [dark, setDark] = useState(false);
  const [refresh, setRefresh] = useState(false);

  // Live weather location — default to Guwahati (real WeatherAPI)
  const [liveLocation, setLiveLocation] = useState("Guwahati");
  const [liveLastUpdated, setLiveLastUpdated] = useState("");

  const weather = weatherByRegion[region] || weatherByRegion["Assam"];

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
              <p>Track real-time weather conditions, regional hazards and operational logistics impact across the North Eastern Region.</p>
            </div>
            <button className="outline-button" onClick={() => setRefresh(!refresh)}>
              <RefreshCw size={14} /> Refresh data
            </button>
          </div>

          {/* 1. Live Weather (Real WeatherAPI integration) */}
          <LiveWeatherCard
            location={liveLocation}
            setLocation={setLiveLocation}
            onWeatherUpdated={setLiveLastUpdated}
          />

          {/* 2. Hazard Risk / Status */}
          <Hazards />

          {/* 3. Regional Weather Map */}
          <WeatherMap weather={weather} />

          {/* 4. Weather Impact */}
          <Impact weather={weather} />

          {/* 5. AI Recommendation */}
          <AiRecommendation />

          <p className="mock-disclaimer">
            Live weather is powered in real-time by WeatherAPI.com. Hazard assessments and routing recommendations are decision-support automated heuristics.
          </p>
        </div>
      </main>
    </div>
  );
}
