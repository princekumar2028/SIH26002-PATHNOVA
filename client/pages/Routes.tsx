import { useState, useEffect } from "react";
import {
  AlertTriangle,
  Bell,
  BrainCircuit,
  ChevronDown,
  ChevronRight,
  CloudRain,
  Clock3,
  Gauge,
  Leaf,
  LayoutDashboard,
  Map as MapIcon,
  Menu,
  Moon,
  Package,
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
import { getV2VAlerts, subscribeV2VAlerts } from "@/lib/v2vStore";
import { V2VHazardAlert } from "@shared/api";

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
function Planner({
  onAnalyze,
  emergency,
  setEmergency,
  cargoType,
  setCargoType,
}: any) {
  const [origin, setOrigin] = useState("Guwahati");
  const [destination, setDestination] = useState("Itanagar");

  const cargoOptions = [
    { value: "medical", label: "Medical Supplies", priority: "CRITICAL" },
    { value: "emergency", label: "Emergency Relief / Oxygen", priority: "CRITICAL" },
    { value: "food", label: "Food & Rations", priority: "HIGH" },
    { value: "agriculture", label: "Agriculture Produce", priority: "NORMAL" },
    { value: "construction", label: "Construction Material", priority: "NORMAL" },
    { value: "general", label: "General Cargo", priority: "NORMAL" },
  ];

  const activeCargo = cargoOptions.find((c) => c.value === cargoType) || cargoOptions[0];

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
          Cargo Type
          <select value={cargoType} onChange={(e) => setCargoType(e.target.value)}>
            {cargoOptions.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label} [{c.priority}]
              </option>
            ))}
          </select>
        </label>
        <button className="primary-button analyze-button" onClick={onAnalyze}>
          <BrainCircuit size={15} /> Analyze Route
        </button>
      </div>
      {activeCargo.priority === "CRITICAL" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#1e0e3e",
            border: "1px solid #7c3aed",
            borderRadius: "8px",
            padding: "8px 14px",
            marginTop: "12px",
          }}
        >
          <Package size={15} style={{ color: "#c084fc" }} />
          <span style={{ fontSize: "11px", color: "#ddd6fe" }}>
            <strong style={{ color: "#c084fc" }}>Essential-Supply Priority Protocol active:</strong>{" "}
            {activeCargo.label} shipment detected. Safer route will be prioritised even if travel time is slightly higher.
          </span>
        </div>
      )}
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

/* ─── Essential-Supply Priority Decision Panel ─── */
function EssentialSupplyCard({ cargoType }: { cargoType: string }) {
  const cargoLabels: Record<string, { label: string; priority: string; color: string }> = {
    medical: { label: "Medical Supplies", priority: "CRITICAL", color: "#f87171" },
    emergency: { label: "Emergency Relief / Oxygen", priority: "CRITICAL", color: "#f87171" },
    food: { label: "Food & Rations", priority: "HIGH", color: "#fbbf24" },
    agriculture: { label: "Agriculture Produce", priority: "NORMAL", color: "#4ade80" },
    construction: { label: "Construction Material", priority: "NORMAL", color: "#4ade80" },
    general: { label: "General Cargo", priority: "NORMAL", color: "#4ade80" },
  };

  const cargo = cargoLabels[cargoType] || cargoLabels["general"];
  const isCritical = cargo.priority === "CRITICAL";
  const isHigh = cargo.priority === "HIGH";

  return (
    <section className="panel" style={{ marginTop: "18px" }}>
      <div className="panel-header">
        <div>
          <h2 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Package size={18} style={{ color: "#7c3aed" }} />
            Essential-Supply Priority
          </h2>
          <p>PATHNOVA adjusts route recommendation based on cargo criticality.</p>
        </div>
        <span
          className="status-pill"
          style={{
            background: isCritical ? "#fef2f2" : isHigh ? "#fffbeb" : "#f0fdf4",
            color: isCritical ? "#b91c1c" : isHigh ? "#92400e" : "#15803d",
            fontWeight: 700,
          }}
        >
          {cargo.priority} PRIORITY
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
        <Package size={14} style={{ color: cargo.color }} />
        <span style={{ fontSize: "13px", color: "#334155" }}>
          Cargo: <strong style={{ color: cargo.color }}>{cargo.label}</strong>
        </span>
      </div>

      {isCritical && (
        <div
          style={{
            background: "#fff7ed",
            border: "1px solid #fdba74",
            borderRadius: "8px",
            padding: "12px 14px",
            marginBottom: "16px",
            fontSize: "13px",
            color: "#9a3412",
          }}
        >
          <strong>⚕ Protect Critical Medical Delivery:</strong> This shipment carries life-critical
          supplies. PATHNOVA recommends the safer corridor even if travel time is slightly higher.
        </div>
      )}

      {/* Route comparison */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
        {/* Route A — Recommended */}
        <div
          style={{
            background: isCritical ? "#f0fdf4" : "#f8fafc",
            border: isCritical ? "2px solid #15803d" : "1px solid #e2e8f0",
            borderRadius: "10px",
            padding: "14px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <strong style={{ fontSize: "13px" }}>Route A</strong>
            {isCritical && (
              <span style={{ fontSize: "9px", background: "#15803d", color: "#fff", borderRadius: "10px", padding: "2px 8px", fontWeight: 700 }}>
                RECOMMENDED
              </span>
            )}
          </div>
          {[
            ["Risk", "18%", "#15803d"],
            ["ETA", isCritical ? "4h 35m" : "4h 35m", "#334155"],
            ["Disruption", "Low (15%)", "#15803d"],
            ["Landslide Risk", "None", "#15803d"],
          ].map(([l, v, c]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "4px" }}>
              <span style={{ color: "#64748b" }}>{l}</span>
              <strong style={{ color: c }}>{v}</strong>
            </div>
          ))}
        </div>
        {/* Route B */}
        <div
          style={{
            background: isCritical ? "#fff1f2" : "#f8fafc",
            border: isCritical ? "1.5px solid #f87171" : "1px solid #e2e8f0",
            borderRadius: "10px",
            padding: "14px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <strong style={{ fontSize: "13px" }}>Route B</strong>
            {isCritical && (
              <span style={{ fontSize: "9px", background: "#fee2e2", color: "#b91c1c", borderRadius: "10px", padding: "2px 8px", fontWeight: 700 }}>
                HIGH RISK
              </span>
            )}
          </div>
          {[
            ["Risk", "82%", "#b91c1c"],
            ["ETA", "4h 10m (25m faster)", "#334155"],
            ["Disruption", "High (68%)", "#b91c1c"],
            ["Landslide Risk", "Significant", "#b91c1c"],
          ].map(([l, v, c]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "4px" }}>
              <span style={{ color: "#64748b" }}>{l}</span>
              <strong style={{ color: c }}>{v}</strong>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          background: isCritical ? "#1e3a5f" : "#f1f5f9",
          border: `1px solid ${isCritical ? "#3b82f6" : "#e2e8f0"}`,
          borderRadius: "8px",
          padding: "10px 14px",
          display: "flex",
          alignItems: "flex-start",
          gap: "8px",
        }}
      >
        <BrainCircuit size={15} style={{ color: isCritical ? "#93c5fd" : "#94a3b8", flexShrink: 0, marginTop: "1px" }} />
        <p style={{ margin: 0, fontSize: "12px", color: isCritical ? "#bfdbfe" : "#475569", lineHeight: "1.5" }}>
          {isCritical
            ? `Use Route A — Route B is 25 minutes faster but has 82% disruption risk, making it unsuitable for a ${cargo.label.toLowerCase()} shipment.`
            : isHigh
            ? `Route A recommended due to lower disruption risk for ${cargo.label.toLowerCase()} shipment.`
            : `Route A provides the best balance of safety and travel time for this shipment.`}
        </p>
      </div>
    </section>
  );
}

/* ─── Seasonal Route Intelligence Panel ─── */
function SeasonalRouteIntelligence() {
  const [expanded, setExpanded] = useState(true);
  const season = "Monsoon";
  const normalRisk = 24;
  const monsoonRisk = 68;

  return (
    <section className="panel" style={{ marginTop: "18px" }}>
      <div
        className="panel-header"
        style={{ cursor: "pointer", userSelect: "none" }}
        onClick={() => setExpanded((v) => !v)}
      >
        <div>
          <h2 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Leaf size={18} style={{ color: "#059669" }} />
            Seasonal Route Intelligence
          </h2>
          <p>Historical disruption patterns across NER corridors by season</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            className="status-pill"
            style={{ background: "#fff7ed", color: "#c2410c", fontWeight: 700 }}
          >
            {season.toUpperCase()} ACTIVE
          </span>
          <ChevronDown
            size={16}
            style={{
              color: "#64748b",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          />
        </div>
      </div>

      {expanded && (
        <>
          {/* Seasonal Risk Comparison */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
            <div
              style={{
                background: "#f0fdf4",
                border: "1px solid #86efac",
                borderRadius: "10px",
                padding: "14px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "10px", color: "#15803d", fontWeight: 700, marginBottom: "4px" }}>NORMAL CONDITIONS</div>
              <div style={{ fontSize: "28px", fontWeight: 900, color: "#15803d" }}>{normalRisk}%</div>
              <div style={{ fontSize: "10px", color: "#16a34a" }}>Baseline Risk · Disruption: Low</div>
            </div>
            <div
              style={{
                background: "#fff7ed",
                border: "2px solid #f97316",
                borderRadius: "10px",
                padding: "14px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "10px", color: "#c2410c", fontWeight: 700, marginBottom: "4px" }}>MONSOON CONDITIONS</div>
              <div style={{ fontSize: "28px", fontWeight: 900, color: "#c2410c" }}>{monsoonRisk}%</div>
              <div style={{ fontSize: "10px", color: "#ea580c" }}>Seasonal Risk · Disruption: High</div>
            </div>
          </div>

          {/* Key seasonal risk drivers */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "11px", color: "#475569", fontWeight: 700, marginBottom: "8px" }}>MONSOON RISK FACTORS (Historical)</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
              {[
                ["Heavy Rainfall", "+38%", "#3b82f6"],
                ["Landslide Susceptibility", "+45%", "#f59e0b"],
                ["Flash Flood Risk", "+25%", "#06b6d4"],
                ["Road Surface Damage", "+32%", "#ef4444"],
              ].map(([factor, delta, color]) => (
                <div
                  key={factor}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    padding: "6px 10px",
                  }}
                >
                  <span style={{ fontSize: "10px", color: "#475569" }}>{factor}</span>
                  <strong style={{ fontSize: "11px", color }}>{delta}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Corridor Seasonal Comparison Table */}
          <div style={{ marginBottom: "14px" }}>
            <div style={{ fontSize: "11px", color: "#475569", fontWeight: 700, marginBottom: "8px" }}>CORRIDOR SEASONAL COMPARISON</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {[
                {
                  name: "Route A — Tezpur Bypass",
                  km: "330 km",
                  normalRisk: "18%",
                  monsoonRisk: "35%",
                  disruption: "Moderate",
                  recommended: true,
                  disruptionColor: "#d97706",
                },
                {
                  name: "Route B — Bhalukpong Valley",
                  km: "298 km",
                  normalRisk: "22%",
                  monsoonRisk: "68%",
                  disruption: "High",
                  recommended: false,
                  disruptionColor: "#b91c1c",
                },
              ].map((r) => (
                <div
                  key={r.name}
                  style={{
                    background: r.recommended ? "#f0fdf4" : "#fff1f2",
                    border: `1.5px solid ${r.recommended ? "#86efac" : "#fca5a5"}`,
                    borderRadius: "10px",
                    padding: "12px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <strong style={{ fontSize: "11px" }}>{r.name}</strong>
                    {r.recommended && (
                      <span style={{ fontSize: "9px", background: "#15803d", color: "#fff", borderRadius: "10px", padding: "2px 7px" }}>
                        RECOMMENDED
                      </span>
                    )}
                  </div>
                  {[
                    ["Distance", r.km],
                    ["Normal Risk", r.normalRisk],
                    ["Monsoon Risk", r.monsoonRisk],
                    ["Disruption (Hist.)", r.disruption],
                  ].map(([l, v], i) => (
                    <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", marginBottom: "3px" }}>
                      <span style={{ color: "#64748b" }}>{l}</span>
                      <strong
                        style={{
                          color: i === 2 ? (r.recommended ? "#d97706" : "#b91c1c") : i === 3 ? r.disruptionColor : "#334155",
                        }}
                      >
                        {v}
                      </strong>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Seasonal Recommendation */}
          <div
            style={{
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "8px",
              padding: "10px 14px",
              display: "flex",
              gap: "8px",
              alignItems: "flex-start",
            }}
          >
            <BrainCircuit size={15} style={{ color: "#38bdf8", flexShrink: 0, marginTop: "2px" }} />
            <p style={{ margin: 0, fontSize: "12px", color: "#bae6fd", lineHeight: "1.5" }}>
              <strong style={{ color: "#7dd3fc" }}>Seasonal Recommendation:</strong> During monsoon
              season, Route B (Bhalukpong Valley) experiences 68% disruption risk due to landslide
              activity and heavy rainfall. PATHNOVA recommends Route A (Tezpur Bypass) for all
              critical logistics movements — June through September.{" "}
              <span style={{ color: "#94a3b8", fontSize: "10px" }}>(Based on historical data)</span>
            </p>
          </div>
        </>
      )}
    </section>
  );
}

/* ─── 2. Route Option Card ─── */
function RouteCard({
  route,
  selected,
  onSelect,
  activeV2VAlert,
}: {
  route: RouteOption;
  selected: boolean;
  onSelect: () => void;
  activeV2VAlert?: V2VHazardAlert | null;
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

      {route.id === "route-b" && activeV2VAlert && (
        <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "6px", padding: "8px 12px", marginTop: "10px", color: "#b91c1c", fontSize: "12px" }}>
          <AlertTriangle size={13} style={{ display: "inline", marginRight: "5px" }} />
          <strong>Driver-reported hazard ahead:</strong> {activeV2VAlert.message}. Safer alternative (Route A) recommended.
        </div>
      )}

      {route.isRecommended ? (
        <p className="route-reason">
          <Zap size={13} /> Lower disruption probability and better road conditions despite
          slightly longer travel time.
        </p>
      ) : (
        route.id === "route-b" && !activeV2VAlert && (
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
function AiRecommendation({ emergency, activeV2VAlert }: { emergency: boolean; activeV2VAlert?: V2VHazardAlert | null }) {
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
        {activeV2VAlert
          ? `Driver-reported hazard received near ${activeV2VAlert.location}. Route A is strongly recommended as the safer alternative.`
          : `Although Route B is 50 minutes faster under normal conditions, current rainfall and congestion increase its disruption probability. Route A provides the best balance between safety, reliability and travel time.`}
      </p>
      <ul className="ai-checks">
        {activeV2VAlert && <li style={{ color: "#dc2626", fontWeight: 600 }}>⚠ Driver-reported hazard active on Route B</li>}
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
    <div className="risk-delay-grid">
      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Risk Factor Distribution</h2>
            <p>Weighted inputs to route risk score</p>
          </div>
        </div>
        <div className="risk-factor-list">
          {riskFactors.slice(0, 4).map(([label, value]) => (
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

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Delay Probability Window</h2>
            <p>Estimated delay likelihood across corridors</p>
          </div>
        </div>
        <div className="delay-stats">
          <span>
            <b>Route A</b>+20 min delay (15% prob.)
          </span>
          <span>
            <b>Route B</b>+75 min delay (68% prob.)
          </span>
          <span>
            <b>Route C</b>+45 min delay (32% prob.)
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
  const [cargoType, setCargoType] = useState("medical");

  const [v2vAlerts, setV2VAlerts] = useState(() => getV2VAlerts());
  useEffect(() => {
    const unsub = subscribeV2VAlerts(() => setV2VAlerts(getV2VAlerts()));
    return unsub;
  }, [refresh]);

  const activeV2VAlert = v2vAlerts.find((a) => a.status === "active") ?? null;

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
          <Planner
            onAnalyze={() => setAnalyzed(true)}
            {...{ emergency, setEmergency, cargoType, setCargoType }}
          />

          {/* Essential-Supply Priority Decision Panel */}
          <EssentialSupplyCard cargoType={cargoType} />

          {/* Seasonal Route Intelligence */}
          <SeasonalRouteIntelligence />

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
                activeV2VAlert={activeV2VAlert}
              />
            ))}
          </div>

          {/* 3. Map + 4. AI Recommendation */}
          <div className="route-main-grid">
            <RouteMap selected={selected} />
            <AiRecommendation emergency={emergency} activeV2VAlert={activeV2VAlert} />
          </div>

          {/* 5. Risk & Delay (compact) */}
          <RiskAndDelay />
        </div>
      </main>
    </div>
  );
}
