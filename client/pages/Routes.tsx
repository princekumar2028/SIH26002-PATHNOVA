import { useState } from "react";
import {
  AlertTriangle,
  Bell,
  BrainCircuit,
  ChevronDown,
  ChevronRight,
  CloudRain,
  Clock3,
  Gauge,
  LayoutDashboard,
  Map as MapIcon,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  RefreshCw,
  Route as RouteIcon,
  ShieldCheck,
  Sun,
  Truck,
  X,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import PathnovaLogo from "@/components/PathnovaLogo";
import { regions } from "@/data/dashboard";
import { routeOptions, riskFactors, RouteOption } from "@/data/routes";

const nav = [
  ["Overview", LayoutDashboard, "/dashboard"],
  ["Routes", RouteIcon, "/routes"],
  ["Live Map", MapIcon, "/live-map"],
  ["Vehicles", Truck, "/vehicles"],
  ["Risk Intelligence", BrainCircuit, "/risk-intelligence"],
  ["Incident Reporting", AlertTriangle, "/incidents"],
  ["Weather & Hazards", CloudRain, "/weather-hazards"],
  ["Alerts", Bell, "/alerts"],
];

const tone = (risk: string) =>
  risk === "Low" ? "green" : risk === "Medium" ? "amber" : "red";

/* ─── Sidebar ─── */
function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }: any) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);

  return (
    <aside
      className={`sidebar ${collapsed ? "sidebar-collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}
    >
      <div className="brand">
        <div className="brand-mark">
          <PathnovaLogo />
        </div>
        <div className="brand-copy">
          <strong>
            <span className="path-wordmark">PATH</span>
            <span className="nova-wordmark">NOVA</span>
          </strong>
        </div>
        <button
          className="icon-button sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Collapse sidebar"
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      <div className="mobile-close">
        <button className="icon-button" onClick={() => setMobileOpen(false)}>
          <X size={20} />
        </button>
      </div>

      <nav className="nav-list">
        {nav.map(([label, Icon, href]: any) =>
          href === "#" ? (
            <button key={label} className="nav-item">
              <Icon size={18} />
              <span>{label}</span>
              {label === "Alerts" && <b className="nav-badge">23</b>}
            </button>
          ) : (
            <Link
              key={label}
              to={href}
              className={`nav-item ${label === "Routes" ? "active" : ""}`}
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={18} />
              <span>{label}</span>
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
              <button type="button" role="menuitem" onClick={() => setProfileOpen(false)}>
                Profile
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setLoggedOut(true);
                  setProfileOpen(false);
                }}
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

/* ─── Header ─── */
function Header({ region, setRegion, dark, setDark, setMobileOpen }: any) {
  return (
    <header className="topbar">
      <div className="mobile-menu">
        <button className="icon-button" onClick={() => setMobileOpen(true)}>
          <Menu size={22} />
        </button>
      </div>
      <div className="title-block">
        <h1>Route Intelligence</h1>
        <p>AI-powered route analysis, risk assessment and alternate route recommendations for NER logistics.</p>
      </div>
      <div className="header-actions">
        <div className="select-wrap">
          <MapIcon size={16} />
          <select value={region} onChange={(e) => setRegion(e.target.value)}>
            {regions.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          <ChevronDown size={14} />
        </div>
        <span className="date-header">02 Sep 2026 · 10:44 AM</span>
        <span className="system-status online">
          <i /> AI Engine: Online
        </span>
        <button
          className="icon-button"
          onClick={() => setDark(!dark)}
          aria-label="Toggle dark mode"
        >
          {dark ? <Sun size={19} /> : <Moon size={19} />}
        </button>
        <div className="header-avatar">LA</div>
      </div>
    </header>
  );
}

/* ─── 1. Route Planner ─── */
function Planner({ onAnalyze, emergency, setEmergency }: any) {
  const [origin, setOrigin] = useState("Guwahati");
  const [destination, setDestination] = useState("Itanagar");

  return (
    <section className="panel planner">
      <div className="planner-copy">
        <span className="eyebrow blue">ROUTE PLANNING</span>
        <h2>Find the safest way forward</h2>
        <p>Compare live conditions and AI-predicted disruption risk before dispatch.</p>
      </div>
      <div className="planner-fields">
        <label>
          Origin
          <select value={origin} onChange={(e) => setOrigin(e.target.value)}>
            <option>Guwahati</option>
            <option>Shillong</option>
            <option>Imphal</option>
            <option>Silchar</option>
            <option>Agartala</option>
          </select>
        </label>
        <span className="swap-arrow">→</span>
        <label>
          Destination
          <select value={destination} onChange={(e) => setDestination(e.target.value)}>
            <option>Itanagar</option>
            <option>Kohima</option>
            <option>Aizawl</option>
            <option>Shillong</option>
            <option>Gangtok</option>
          </select>
        </label>
        <label>
          Vehicle Type
          <select>
            <option>Heavy Truck</option>
            <option>Truck</option>
            <option>Van</option>
          </select>
        </label>
        <label>
          Priority
          <select>
            <option>Normal</option>
            <option>High Priority</option>
            <option>Emergency</option>
          </select>
        </label>
        <button className="primary-button analyze-button" onClick={onAnalyze}>
          <BrainCircuit size={15} /> Analyze Route
        </button>
      </div>
      <button
        className={`emergency-button route-emergency ${emergency ? "active" : ""}`}
        onClick={() => setEmergency(!emergency)}
      >
        <AlertTriangle size={14} />{" "}
        {emergency ? "Emergency Route Active" : "Emergency Route Mode"}
      </button>
    </section>
  );
}

/* ─── 2. Route Option Card ─── */
function RouteCard({
  route,
  selected,
  onSelect,
}: {
  route: RouteOption;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <article className={`route-option ${selected ? "selected" : ""}`}>
      <div className="route-option-head">
        <div>
          <span className="eyebrow">
            {route.id === "route-a"
              ? "BEST BALANCE"
              : route.id === "route-b"
              ? "TIME OPTIMIZED"
              : "LOW TRAFFIC"}
          </span>
          <h3>{route.name}</h3>
        </div>
        {route.isRecommended ? (
          <span className="ai-badge">AI RECOMMENDED</span>
        ) : (
          <span
            className={`status-pill ${
              route.id === "route-b" ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"
            }`}
          >
            {route.id === "route-b" ? "FASTEST" : "BACKUP"}
          </span>
        )}
      </div>
      <p className="route-path">{route.path}</p>
      <div className="route-metrics">
        <span>
          <b>{route.distance}</b>Distance
        </span>
        <span>
          <b>{route.predictedEta}</b>ETA
        </span>
        <span>
          <b>{route.delay}</b>Delay
        </span>
        <span>
          <b className={`risk-${tone(route.riskLevel)}`}>{route.riskLevel}</b>Risk
        </span>
      </div>
      <div className="route-factors">
        <span>
          <Gauge size={13} />
          Traffic <b>{route.trafficLevel}</b>
        </span>
        <span>
          <CloudRain size={13} />
          Weather <b>{route.weatherCondition}</b>
        </span>
        <span>
          <ShieldCheck size={13} />
          Road <b>{route.roadCondition}</b>
        </span>
      </div>
      {route.isRecommended ? (
        <p className="route-reason">
          <Zap size={13} /> Lower disruption probability and better road conditions despite
          slightly longer travel time.
        </p>
      ) : (
        route.id === "route-b" && (
          <p className="route-warning">
            <AlertTriangle size={13} /> High congestion and rainfall risk detected.
          </p>
        )
      )}
      <button className={selected ? "primary-button" : "outline-button"} onClick={onSelect}>
        {selected ? "Selected Route" : "Select Route"} <ChevronRight size={14} />
      </button>
    </article>
  );
}

/* ─── 3. Route Comparison Map ─── */
function RouteMap({ selected }: { selected: number }) {
  return (
    <section className="panel route-map-panel">
      <div className="panel-header">
        <div>
          <h2>Route Comparison Map</h2>
          <p>Live road conditions, weather hazards and incident overlays</p>
        </div>
        <span className="map-connect">
          <i /> GIS ready · Updated 2 min ago
        </span>
      </div>
      <div className="route-map">
        <div className="map-grid">
          <div className="district-lines" />
          <div className="region-shape" />
          <svg className="routes-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d="M20 73 C31 66 34 52 39 42 S45 33 47 29"
              className={`route-line route-blue-highlight ${selected === 0 ? "route-selected" : ""}`}
            />
            <path
              d="M20 73 C26 68 42 66 53 57 S56 40 47 29"
              className={`route-line route-red ${selected === 1 ? "route-selected" : ""}`}
            />
            <path
              d="M20 73 C35 81 46 81 58 67 S46 42 47 29"
              className={`route-line route-yellow ${selected === 2 ? "route-selected" : ""}`}
            />
          </svg>
          <div className="map-origin">
            Guwahati<i />
          </div>
          <div className="map-destination">
            Itanagar<i />
          </div>
          <div className="map-hazard hazard-a">
            <AlertTriangle size={13} />
          </div>
          <div className="map-hazard hazard-b">
            <CloudRain size={13} />
          </div>
          <div className="map-incident-label">Heavy rain · Bhalukpong</div>
        </div>
        <div className="route-map-legend">
          <span>
            <i className="legend-blue" />
            AI Recommended
          </span>
          <span>
            <i className="legend-red" />
            Fastest / High Risk
          </span>
          <span>
            <i className="legend-yellow" />
            Alternate
          </span>
          <span>
            <i className="legend-critical" />
            Incident
          </span>
        </div>
        <div className="map-controls">
          <button>+</button>
          <button>−</button>
          <button>
            <MapIcon size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ─── 4. AI Route Recommendation ─── */
function AiRecommendation({ emergency }: { emergency: boolean }) {
  return (
    <section className="panel route-ai-card">
      <div className="ai-heading">
        <span className="ai-icon">
          <BrainCircuit size={20} />
        </span>
        <div>
          <h2>AI Route Recommendation</h2>
          <p>{emergency ? "Safety-first emergency routing" : "Decision support for your shipment"}</p>
        </div>
        <span className="ai-badge">AI POWERED</span>
      </div>
      <div className="ai-recommend-title">
        <span className="eyebrow">RECOMMENDED FOR GUWAHATI → ITANAGAR</span>
        <h3>Route A provides the best balance</h3>
      </div>
      <div className="ai-score-row">
        <span>
          <b>18%</b>Risk score
        </span>
        <span>
          <b>20 min</b>Expected delay
        </span>
        <span>
          <b>Good</b>Road condition
        </span>
      </div>
      <p className="ai-reasoning">
        Although Route B is 50 minutes faster under normal conditions, current rainfall and
        congestion increase its disruption probability. Route A provides the best balance between
        safety, reliability and travel time.
      </p>
      <ul className="ai-checks">
        <li>Lower disruption probability</li>
        <li>Better road condition</li>
        <li>Lower landslide exposure</li>
        <li>More reliable ETA</li>
      </ul>
      <button className="primary-button">
        Use Recommended Route <ChevronRight size={15} />
      </button>
    </section>
  );
}

/* ─── 5. Risk & Delay Summary (merged compact section) ─── */
function RiskAndDelay() {
  return (
    <div className="route-two-col">
      {/* Risk Analysis */}
      <section className="panel risk-analysis">
        <div className="panel-header">
          <div>
            <h2>Route Risk Analysis</h2>
            <p>
              Route A · Overall Risk Score <b className="risk-low">18% — LOW</b>
            </p>
          </div>
          <span className="risk-score">18%</span>
        </div>
        <div className="factor-list">
          {riskFactors.map(([label, value]) => (
            <div key={label}>
              <span>
                <b>{label}</b>
                <em>{value}%</em>
              </span>
              <i>
                <b style={{ width: `${value}%` }} />
              </i>
            </div>
          ))}
        </div>
      </section>

      {/* Delay Prediction */}
      <section className="panel delay-card">
        <div className="panel-header">
          <div>
            <h2>AI Delay Prediction</h2>
            <p>Route A · Confidence 87%</p>
          </div>
          <Clock3 className="weather-icon" size={20} />
        </div>
        <div className="delay-values">
          <span>
            <b>10h 20m</b>Normal travel time
          </span>
          <span>
            <b>10h 40m</b>Predicted travel time
          </span>
          <span>
            <b className="risk-medium">+20 min</b>Expected delay
          </span>
        </div>
        <div className="delay-bar">
          <i />
          <b>87% confidence</b>
        </div>
      </section>
    </div>
  );
}

/* ═══════════════ Page Root ═══════════════ */
export default function Routes() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [region, setRegion] = useState(regions[0]);
  const [dark, setDark] = useState(false);
  const [selected, setSelected] = useState(0);
  const [emergency, setEmergency] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [refresh, setRefresh] = useState(false);

  return (
    <div className={dark ? "app-shell dark-mode" : "app-shell"}>
      <Sidebar {...{ collapsed, setCollapsed, mobileOpen, setMobileOpen }} />
      <main className="main-shell">
        <Header {...{ region, setRegion, dark, setDark, setMobileOpen }} />
        <div className="dashboard route-dashboard">
          {/* Intro */}
          <div className="dashboard-intro">
            <div>
              <span className="eyebrow blue">ROUTE INTELLIGENCE · AI DECISION SUPPORT</span>
              <h2>Plan with confidence</h2>
              <p>
                Analyze route conditions, predicted risk and reliable alternatives for every NER
                logistics movement.
              </p>
            </div>
            <div className="route-head-actions">
              <button className="outline-button" onClick={() => setRefresh(!refresh)}>
                <RefreshCw size={14} /> Refresh
              </button>
              <span className="live-label">
                <i /> AI Engine Online
              </span>
            </div>
          </div>

          {/* 1. Route Planner */}
          <Planner onAnalyze={() => setAnalyzed(true)} {...{ emergency, setEmergency }} />

          {/* Route Summary (shown after Analyze) */}
          {analyzed && (
            <div className="route-summary">
              <span>
                <small>ORIGIN</small>
                <b>Guwahati</b>
              </span>
              <span>
                <small>DESTINATION</small>
                <b>Itanagar</b>
              </span>
              <span>
                <small>DISTANCE</small>
                <b>Approx. 440 km</b>
              </span>
              <span>
                <small>NORMAL ETA</small>
                <b>10h 20m</b>
              </span>
              <span>
                <small>CURRENT ETA</small>
                <b>11h 05m</b>
              </span>
              <span>
                <small>OVERALL RISK</small>
                <b className="risk-medium">Medium</b>
              </span>
            </div>
          )}

          {/* 2. Route Options */}
          <div className="route-options-head">
            <div>
              <h2>Compare route options</h2>
              <p>AI has evaluated 3 available corridors for safety, access and travel time.</p>
            </div>
            <span className="status-pill bg-green-50 text-green-700">
              {selected === 0 ? "Route A selected" : "Route option selected"}
            </span>
          </div>
          <div className="route-options">
            {routeOptions.map((r, i) => (
              <RouteCard
                key={r.id}
                route={r}
                selected={selected === i}
                onSelect={() => setSelected(i)}
              />
            ))}
          </div>

          {/* 3. Map + 4. AI Recommendation */}
          <div className="route-main-grid">
            <RouteMap selected={selected} />
            <AiRecommendation emergency={emergency} />
          </div>

          {/* 5. Risk & Delay (compact) */}
          <RiskAndDelay />
        </div>
      </main>
    </div>
  );
}
