import { useState, useEffect } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  BrainCircuit,
  ChevronDown,
  ChevronRight,
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
  Mountain,
  TrafficCone,
  Clock3,
  Target
} from "lucide-react";
import { Link } from "react-router-dom";
import PathnovaLogo from "@/components/PathnovaLogo";
import { regions } from "@/data/dashboard";
import { riskFactors, riskZones, RiskZone } from "@/data/risk";
import { getV2VAlerts, subscribeV2VAlerts } from "@/lib/v2vStore";

const nav = [
  ["Overview", LayoutDashboard, "/dashboard"],
  ["Routes", RouteIcon, "/routes"],
  ["Live Map", MapIcon, "/live-map"],
  ["Vehicles", Truck, "/vehicles"],
  ["Risk Intelligence", BrainCircuit, "/risk-intelligence"],
  ["Incident Reporting", AlertTriangle, "/incidents"],
  ["Weather & Hazards", CloudRain, "/weather-hazards"],
  ["Alerts", Bell, "/alerts"]
];

const tone = (level: string) =>
  level === "Low" ? "green" : level === "Medium" ? "amber" : level === "High" ? "orange" : "red";

function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }: any) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);

  return (
    <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
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
        {nav.map(([label, Icon, href]: any) =>
          href === "#" ? (
            <button className="nav-item" key={label}>
              <Icon size={18} />
              <span>{label}</span>
              {label === "Alerts" && <b className="nav-badge">23</b>}
            </button>
          ) : (
            <Link
              className={`nav-item ${label === "Risk Intelligence" ? "active" : ""}`}
              key={label}
              to={href}
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

function Header({ region, setRegion, dark, setDark, setMobileOpen }: any) {
  const [online, setOnline] = useState(true);

  return (
    <header className="topbar">
      <div className="mobile-menu">
        <button className="icon-button" onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <Menu size={22} />
        </button>
      </div>
      <div className="title-block">
        <h1>Risk Intelligence</h1>
        <p>Operational risk detection, corridor vulnerability analysis and preventive routing recommendations.</p>
      </div>
      <div className="header-actions">
        <div className="select-wrap">
          <MapIcon size={16} />
          <select value={region} onChange={(e) => setRegion(e.target.value)} aria-label="Select region">
            {regions.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          <ChevronDown size={14} />
        </div>
        <span className="date-header">Last updated · 10:42 AM</span>
        <button
          className={`system-status ${online ? "online" : "offline"}`}
          onClick={() => setOnline(!online)}
          aria-label="Toggle AI Status"
        >
          <i />
          {online ? "Risk Monitor: Active" : "Monitor Paused"}
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

/* 1. Overall Risk Summary KPIs */
const kpis = [
  ["Overall Regional Risk", "32%", "Medium Risk · Stable", Activity, "amber"],
  ["High-Risk Corridors", "3 Areas", "Needs attention: Bhalukpong, Bomdila, Shillong", Target, "red"],
  ["Active Disruption Alerts", "2 Alerts", "Heavy rainfall & saturated slope hazard", AlertTriangle, "orange"],
  ["Monitored Corridors", "8 Routes", "Active telemetry across key hill tracts", RouteIcon, "green"]
];

function Kpis() {
  return (
    <div className="kpi-grid risk-kpis">
      {kpis.map(([label, value, note, Icon, t]: any) => (
        <div className="kpi-card" key={label}>
          <div className="kpi-top">
            <span
              className={`kpi-icon ${
                t === "red"
                  ? "text-red-600 bg-red-50"
                  : t === "orange"
                  ? "text-orange-600 bg-orange-50"
                  : t === "green"
                  ? "text-emerald-600 bg-emerald-50"
                  : "text-amber-600 bg-amber-50"
              }`}
            >
              <Icon size={18} />
            </span>
            <span className="muted">Live Status</span>
          </div>
          <div className="kpi-value">{value}</div>
          <div className="kpi-label">{label}</div>
          <div className="kpi-footer">
            <span className={`dot ${t}`} />
            <span className="muted">{note}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* 1. Overall Risk Summary - Regional Score & Factors */
function ScoreCard() {
  return (
    <section className="panel score-panel">
      <div className="panel-header">
        <div>
          <h2>Overall Regional Risk Score</h2>
          <p>North Eastern Logistics Corridor · Real-time status</p>
        </div>
        <BrainCircuit size={20} className="status-green" />
      </div>
      <div className="big-risk-ring">
        <strong>32%</strong>
        <span>Medium Risk</span>
      </div>
      <p className="score-trend">↓ 4.2% compared with yesterday</p>
      <div className="score-note">
        Regional baseline conditions remain moderate across the lowlands. Higher disruption risk is localized to hill corridors in western Arunachal Pradesh due to active rainfall.
      </div>
    </section>
  );
}

function Factors() {
  return (
    <section className="panel factor-panel">
      <div className="panel-header">
        <div>
          <h2>Risk Factor Breakdown</h2>
          <p>Signals contributing to regional score</p>
        </div>
        <BarChart3 size={18} className="muted" />
      </div>
      <div className="risk-factor-list">
        {riskFactors.slice(0, 5).map(([label, value]) => (
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
  );
}

/* 2. High-Risk Locations - Map & Table */
function RiskMap({
  onSelect,
  selected
}: {
  onSelect: (z: RiskZone) => void;
  selected: RiskZone | null;
}) {
  return (
    <section className="panel risk-map-panel">
      <div className="panel-header">
        <div>
          <h2>Regional Risk Map</h2>
          <p>Interactive risk zones across the North Eastern Region</p>
        </div>
        <span className="map-connect">
          <i /> Updated 5 min ago
        </span>
      </div>
      <div className="risk-map">
        <div className="map-grid">
          <div className="district-lines" />
          <div className="region-shape" />
          <svg className="routes-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M20 73 C32 62 39 40 47 29 S63 50 70 76" className="route-line route-red" />
            <path d="M21 73 C33 79 56 79 70 76" className="route-line route-green" />
            <path d="M47 29 C52 49 58 65 70 76" className="route-line route-yellow" />
          </svg>
          {riskZones.map((z) => (
            <button
              key={z.id}
              className={`risk-marker ${tone(z.riskLevel)} ${selected?.id === z.id ? "selected" : ""}`}
              style={{ left: `${z.x}%`, top: `${z.y}%` }}
              onClick={() => onSelect(z)}
              aria-label={`${z.location} risk ${z.riskScore}%`}
            >
              <span>{z.riskScore}</span>
            </button>
          ))}
          <div className="risk-cloud cloud-one" />
          <div className="risk-cloud cloud-two" />
        </div>
        <div className="map-controls">
          <button aria-label="Zoom in">+</button>
          <button aria-label="Zoom out">−</button>
          <button aria-label="Center view">
            <Target size={14} />
          </button>
          <button aria-label="Reset view">□</button>
        </div>
        <div className="risk-map-legend">
          <strong>RISK LEVEL</strong>
          <span>
            <i className="legend-green" />
            Low risk
          </span>
          <span>
            <i className="legend-yellow" />
            Medium risk
          </span>
          <span>
            <i className="legend-orange" />
            High risk
          </span>
          <span>
            <i className="legend-critical" />
            Critical risk
          </span>
        </div>
        {selected && (
          <div className="risk-popup">
            <button onClick={() => onSelect(null as any)} aria-label="Close popup">
              <X size={14} />
            </button>
            <span
              className={`status-pill ${
                tone(selected.riskLevel) === "red" ? "bg-red-50 text-red-700" : "bg-orange-50 text-orange-700"
              }`}
            >
              {selected.riskLevel.toUpperCase()} RISK
            </span>
            <h3>{selected.location}</h3>
            <div className="popup-risk-score">
              {selected.riskScore}% <small>risk score</small>
            </div>
            <p>{selected.primaryCause}</p>
            <div className="popup-facts">
              <span>
                Impact<b>{selected.predictedImpact}</b>
              </span>
              <span>
                Confidence<b>{selected.confidence}%</b>
              </span>
            </div>
            <button className="popup-action" onClick={() => onSelect(selected)}>
              View risk details <ChevronRight size={13} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function HighRiskTable({
  onSelect,
  selectedId
}: {
  onSelect: (z: RiskZone) => void;
  selectedId?: string;
}) {
  return (
    <section className="panel risk-table">
      <div className="panel-header">
        <div>
          <h2>High-Risk Locations</h2>
          <p>Areas requiring preventive operator action and route monitoring</p>
        </div>
        <span className="status-pill bg-red-50 text-red-700">3 Priority Corridors</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Location</th>
              <th>Risk Score</th>
              <th>Primary Hazard</th>
              <th>Predicted Impact</th>
              <th>Confidence</th>
              <th>Last Updated</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {riskZones.slice(0, 5).map((z) => (
              <tr
                key={z.id}
                onClick={() => onSelect(z)}
                style={{
                  cursor: "pointer",
                  backgroundColor: selectedId === z.id ? "rgba(40, 119, 209, 0.08)" : undefined
                }}
              >
                <td>
                  <strong>{z.location}</strong>
                </td>
                <td>
                  <b className={`risk-${tone(z.riskLevel)}`}>{z.riskScore}%</b>
                </td>
                <td>{z.primaryCause}</td>
                <td>{z.predictedImpact}</td>
                <td>{z.confidence}%</td>
                <td>{z.lastUpdated}</td>
                <td>
                  <button
                    className="view-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(z);
                    }}
                  >
                    Inspect
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* 3. Why is this Road Dangerous? (AI Explanation) */
function WhyDangerous({ zone, v2vAlerts }: { zone: RiskZone; v2vAlerts?: ReturnType<typeof getV2VAlerts> }) {
  const activeV2V = v2vAlerts && v2vAlerts.length > 0 ? v2vAlerts[0] : null;

  return (
    <section className="panel prediction-card">
      <div className="ai-heading">
        <span className="ai-icon">
          <BrainCircuit size={19} />
        </span>
        <div>
          <h2>Why is this Road Dangerous?</h2>
          <p>Operational risk factor breakdown for {zone.location} Corridor</p>
        </div>
        <span
          className={`status-pill ${
            tone(zone.riskLevel) === "red" ? "bg-red-50 text-red-700" : "bg-orange-50 text-orange-700"
          }`}
          style={{ marginLeft: "auto" }}
        >
          {zone.riskScore}% RISK SCORE · {zone.riskLevel.toUpperCase()}
        </span>
      </div>

      <div className="prediction-message">
        Elevated transit hazard detected near <strong>{zone.location}</strong>. Risk factors reflect combined meteorological, terrain slope, driver reports, and telemetry inputs:
      </div>

      <div className="risk-reasons-grid">
        {activeV2V && (
          <div className="risk-reason-item" style={{ border: "1px solid #fca5a5", background: "#fef2f2", borderRadius: "8px" }}>
            <span className="risk-reason-icon" style={{ background: "#fee2e2", color: "#dc2626" }}>
              <AlertTriangle size={16} />
            </span>
            <div>
              <strong style={{ color: "#991b1b" }}>Driver-Reported Road Hazard</strong>
              <p style={{ color: "#7f1d1d" }}>
                Active hazard report ({activeV2V.title.replace(/^V2V Hazard:\s*/i, "")}) received near {activeV2V.location}. Shared across transport network.
              </p>
            </div>
          </div>
        )}

        <div className="risk-reason-item">
          <span className="risk-reason-icon">
            <CloudRain size={16} />
          </span>
          <div>
            <strong>Rainfall Accumulation</strong>
            <p>High precipitation volume ({zone.weatherRisk}% intensity) saturating slope soil and reducing traction.</p>
          </div>
        </div>

        <div className="risk-reason-item">
          <span className="risk-reason-icon">
            <Mountain size={16} />
          </span>
          <div>
            <strong>Landslide-Prone Hill Terrain</strong>
            <p>Steep slope gradient with {zone.landslideRisk}% geological instability and historical rockfall vulnerability.</p>
          </div>
        </div>

        <div className="risk-reason-item">
          <span className="risk-reason-icon">
            <TrafficCone size={16} />
          </span>
          <div>
            <strong>Road Surface Damage Reports</strong>
            <p>Pavement degradation ({zone.roadRisk}% risk) and shoulder fissures reported on primary carriageway.</p>
          </div>
        </div>

        <div className="risk-reason-item">
          <span className="risk-reason-icon">
            <Activity size={16} />
          </span>
          <div>
            <strong>Vehicle Speed Anomalies</strong>
            <p>Convoy telemetry shows average speeds dropped {Math.round(zone.trafficRisk * 0.6)}% below baseline speed.</p>
          </div>
        </div>
      </div>

      <div className="prediction-stats">
        <span>
          <b>Next 4–6h</b>Expected Window
        </span>
        <span>
          <b>{zone.predictedImpact}</b>Predicted Impact
        </span>
        <span>
          <b>{zone.affectedVehicles} Convoys</b>Vehicles in Corridor
        </span>
        <span>
          <b>{zone.confidence}%</b>Signal Confidence
        </span>
      </div>
    </section>
  );
}

/* 4. AI Recommended Action */
function RecommendedAction({ zone }: { zone: RiskZone }) {
  return (
    <section className="panel action-card">
      <div>
        <span className="ai-icon">
          <BrainCircuit size={19} />
        </span>
        <div>
          <h2>AI Recommended Action</h2>
          <p>
            Due to high landslide and rainfall risk near <strong>{zone.location}</strong>, reroute active supply convoys to the verified alternate route via Tezpur bypass. Restrict non-essential transit until slope stability inspection.
          </p>
        </div>
      </div>
      <div>
        <span className="status-pill bg-red-50 text-red-700">HIGH PRIORITY</span>
        <Link to="/routes" className="primary-button">
          View alternate route <ChevronRight size={14} />
        </Link>
        <button
          className="outline-button"
          onClick={() => alert(`Priority advisory dispatched to vehicles active near ${zone.location}.`)}
        >
          Alert vehicles
        </button>
      </div>
    </section>
  );
}

/* Detailed zone inspection drawer */
function Details({ zone, close }: { zone: RiskZone; close: () => void }) {
  return (
    <div className="drawer-overlay" onClick={close}>
      <aside className="risk-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <div>
            <span className="eyebrow red">RISK ZONE DETAILS</span>
            <h2>{zone.location}</h2>
            <p>Updated {zone.lastUpdated}</p>
          </div>
          <button className="icon-button" onClick={close} aria-label="Close drawer">
            <X size={19} />
          </button>
        </div>
        <div className="drawer-risk">
          <div className="drawer-risk-ring">
            <strong>{zone.riskScore}%</strong>
            <span>{zone.riskLevel} risk</span>
          </div>
          <div>
            <small>PRIMARY CAUSE</small>
            <b>{zone.primaryCause}</b>
            <small>PREDICTED IMPACT</small>
            <b>{zone.predictedImpact}</b>
          </div>
        </div>
        <div className="drawer-risk-grid">
          {[
            ["Weather", zone.weatherRisk + "%"],
            ["Road condition", zone.roadRisk + "%"],
            ["Traffic", zone.trafficRisk + "%"],
            ["Landslide", zone.landslideRisk + "%"],
            ["Flood", zone.floodRisk + "%"],
            ["Confidence", zone.confidence + "%"]
          ].map(([l, v]) => (
            <span key={l}>
              <small>{l}</small>
              <b>{v}</b>
            </span>
          ))}
        </div>
        <div className="drawer-info">
          <p>
            <MapIcon size={14} />
            Coordinates <b>27.01° N, 92.64° E</b>
          </p>
          <p>
            <RouteIcon size={14} />
            Affected routes <b>{zone.affectedRoutes}</b>
          </p>
          <p>
            <Truck size={14} />
            Affected vehicles <b>{zone.affectedVehicles}</b>
          </p>
          <p>
            <Clock3 size={14} />
            Historical incidents <b>6 in 90 days</b>
          </p>
        </div>
        <div className="drawer-recommend">
          <strong>
            <BrainCircuit size={15} /> Recommended action
          </strong>
          <p>Avoid the affected corridor during the next 6 hours and consider the alternate route through Tezpur.</p>
        </div>
        <Link to="/routes" className="primary-button drawer-wide" onClick={close}>
          View alternate route <ChevronRight size={14} />
        </Link>
      </aside>
    </div>
  );
}

export default function RiskIntelligence() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [region, setRegion] = useState(regions[0]);
  const [dark, setDark] = useState(false);
  const [selected, setSelected] = useState<RiskZone | null>(null);
  const [drawerZone, setDrawerZone] = useState<RiskZone | null>(null);
  const [refresh, setRefresh] = useState(false);

  const [v2vAlerts, setV2VAlerts] = useState(() => getV2VAlerts());
  useEffect(() => {
    const unsub = subscribeV2VAlerts(() => setV2VAlerts(getV2VAlerts()));
    return unsub;
  }, [refresh]);

  // Active zone for explanation & action (defaults to Bhalukpong - highest risk, or selected)
  const activeZone = selected || riskZones[0];

  const handleSelect = (zone: RiskZone | null) => {
    setSelected(zone);
  };

  const handleInspect = (zone: RiskZone) => {
    setSelected(zone);
    setDrawerZone(zone);
  };

  return (
    <div className={dark ? "app-shell dark-mode" : "app-shell"}>
      <Sidebar {...{ collapsed, setCollapsed, mobileOpen, setMobileOpen }} />
      <main className="main-shell">
        <Header {...{ region, setRegion, dark, setDark, setMobileOpen }} />
        <div className="dashboard risk-dashboard">
          <div className="dashboard-intro">
            <div>
              <span className="eyebrow blue">AI PREDICTION · RISK OPERATIONS</span>
              <h2>See risk before it becomes disruption</h2>
              <p>
                Understand where logistics access is vulnerable, why conditions are changing and what action the AI recommends.
              </p>
            </div>
            <button className="outline-button" onClick={() => setRefresh(!refresh)}>
              <RefreshCw size={14} /> Refresh predictions
            </button>
          </div>

          {/* 1. Overall Risk Summary */}
          <Kpis />
          <div className="risk-two-col">
            <ScoreCard />
            <Factors />
          </div>

          {/* 2. High-Risk Locations */}
          <div style={{ marginTop: "18px" }}>
            <RiskMap onSelect={handleSelect} selected={selected} />
          </div>
          <HighRiskTable onSelect={handleInspect} selectedId={activeZone.id} />

          {/* 3. Why is this Road Dangerous? (AI Explanation) */}
          <div style={{ marginTop: "18px" }}>
            <WhyDangerous zone={activeZone} v2vAlerts={v2vAlerts} />
          </div>

          {/* 4. AI Recommended Action */}
          <RecommendedAction zone={activeZone} />
        </div>
      </main>
      {drawerZone && <Details zone={drawerZone} close={() => setDrawerZone(null)} />}
    </div>
  );
}
