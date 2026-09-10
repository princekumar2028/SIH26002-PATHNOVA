import { useMemo, useState, useEffect } from "react";
import {
  AlertTriangle,
  Bell,
  BrainCircuit,
  ChevronDown,
  ChevronRight,
  CloudRain,
  Crosshair,
  Info,
  Layers3,
  LayoutDashboard,
  Map as MapIcon,
  Maximize2,
  Menu,
  Minus,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Route as RouteIcon,
  Search,
  Sun,
  Truck,
  X,
  MapPin,
  ShieldAlert,
  Clock,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import PathnovaLogo from "@/components/PathnovaLogo";
import { regions, routes } from "@/data/dashboard";
import { getV2VAlerts, subscribeV2VAlerts } from "@/lib/v2vStore";

// ---------------------------------------------------------------------------
// Operational Target Types & Dataset
// ---------------------------------------------------------------------------

type TargetType = "incident" | "vehicle" | "route" | "city";

interface MapTarget {
  type: TargetType;
  id: string;
  title: string;
  category: string;
  location: string;
  condition: string;
  status: string;
  severity: string;
  severityTone: "green" | "yellow" | "red" | "critical";
  lastUpdated: string;
  details: string;
  linkTo: string;
  linkText: string;
}

const NER_CITIES = [
  { name: "Guwahati", x: 22, y: 72, state: "Assam", role: "Regional Command & Primary Transit Hub" },
  { name: "Itanagar", x: 47, y: 29, state: "Arunachal Pradesh", role: "Capital Logistics Terminal" },
  { name: "Shillong", x: 31, y: 79, state: "Meghalaya", role: "Highland Transit Junction" },
  { name: "Imphal", x: 70, y: 76, state: "Manipur", role: "Eastern Terminal & Border Route Hub" },
  { name: "Aizawl", x: 60, y: 91, state: "Mizoram", role: "Southern Mountain Gateway" },
  { name: "Kohima", x: 79, y: 56, state: "Nagaland", role: "Mountain Pass Corridor" },
  { name: "Agartala", x: 44, y: 94, state: "Tripura", role: "Western Border Terminal" },
  { name: "Gangtok", x: 5, y: 67, state: "Sikkim", role: "Northwestern Mountain Gateway" },
  { name: "Silchar", x: 51, y: 84, state: "Assam", role: "Barak Valley Logistics Junction" },
  { name: "Bomdila", x: 38, y: 41, state: "Arunachal Pradesh", role: "High-Altitude Pass (NH-13)" },
  { name: "Bhalukpong", x: 35, y: 48, state: "Assam/Arunachal", role: "Border Transit Checkpoint" },
];

const VEHICLES_DATA = [
  {
    id: "NR-042",
    x: 39,
    y: 50,
    status: "normal",
    speed: "68 km/h",
    corridor: "Bhalukpong → Itanagar (NH-13)",
    eta: "4h 18m",
    risk: "42%",
    riskLevel: "Moderate Risk (42%)",
    cargo: "Essential Medical Supplies",
    lastUpdated: "Just now (Simulated GPS)",
  },
  {
    id: "NR-073",
    x: 66,
    y: 67,
    status: "delayed",
    speed: "31 km/h",
    corridor: "Imphal → Kohima (NH-29)",
    eta: "6h 10m",
    risk: "61%",
    riskLevel: "High Risk (61%)",
    cargo: "Fuel Tanker Convoy",
    lastUpdated: "2 min ago (Simulated GPS)",
  },
  {
    id: "NR-091",
    x: 53,
    y: 83,
    status: "critical",
    speed: "25 km/h",
    corridor: "Silchar → Aizawl (NH-306)",
    eta: "8h 45m",
    risk: "78%",
    riskLevel: "Critical Risk (78%)",
    cargo: "Emergency Relief Packets",
    lastUpdated: "1 min ago (Simulated GPS)",
  },
  {
    id: "NR-018",
    x: 29,
    y: 76,
    status: "offline",
    speed: "0 km/h",
    corridor: "Shillong Transit Depot",
    eta: "Stationary",
    risk: "15%",
    riskLevel: "Low Risk (15%)",
    cargo: "Standby Transport Unit",
    lastUpdated: "14 min ago (Signal Standby)",
  },
];

const INCIDENTS_DATA = [
  {
    id: "INC-101",
    x: 51,
    y: 38,
    type: "Landslide Blockage",
    corridor: "NH-13 Corridor near Bomdila Pass",
    severity: "CRITICAL",
    risk: "87%",
    status: "Partially Blocked (Single Lane)",
    clearance: "~3 hours",
    details: "Heavy rainfall triggered rock and debris flow across uphill lane. 6 convoys queued.",
    lastUpdated: "10 min ago (Corridor Sensor)",
    routeId: 0,
  },
  {
    id: "INC-102",
    x: 57,
    y: 81,
    type: "Flash Flood / River Inundation",
    corridor: "Silchar – Hailakandi Riverway",
    severity: "HIGH",
    risk: "74%",
    status: "Roadway Submerged",
    clearance: "~5 hours",
    details: "Barak River swell inundated 400m low-lying roadbed. Alternate highland path active.",
    lastUpdated: "28 min ago (Field Report)",
    routeId: 1,
  },
  {
    id: "INC-103",
    x: 73,
    y: 62,
    type: "Road Structural Damage",
    corridor: "Kohima Pass Mountain Section",
    severity: "MODERATE",
    risk: "52%",
    status: "Controlled Single-Lane Open",
    clearance: "~2 hours",
    details: "Shoulder erosion on hairpin bend. Heavy tonnage vehicles diverted via bypass.",
    lastUpdated: "1 hour ago (Weather Advisory)",
    routeId: 2,
  },
];

const DEFAULT_TARGET: MapTarget = {
  type: "incident",
  id: INCIDENTS_DATA[0].id,
  title: `${INCIDENTS_DATA[0].type} — ${INCIDENTS_DATA[0].corridor}`,
  category: "HAZARD INCIDENT · CRITICAL",
  location: INCIDENTS_DATA[0].corridor,
  condition: INCIDENTS_DATA[0].details,
  status: INCIDENTS_DATA[0].status,
  severity: `CRITICAL (${INCIDENTS_DATA[0].risk} Disruption)`,
  severityTone: "critical",
  lastUpdated: INCIDENTS_DATA[0].lastUpdated,
  details: `Estimated clearance: ${INCIDENTS_DATA[0].clearance}`,
  linkTo: "/incidents",
  linkText: "Inspect Incident Report",
};

// ---------------------------------------------------------------------------
// Sidebar Component
// ---------------------------------------------------------------------------

function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }: any) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);

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
        {nav.map(([label, Icon, href]: any) => (
          <Link
            key={label}
            to={href}
            className={`nav-item ${label === "Live Map" ? "active" : ""}`}
            title={collapsed ? label : undefined}
            onClick={() => setMobileOpen(false)}
          >
            <Icon size={18} />
            <span>{label}</span>
            {label === "Alerts" && <b className="nav-badge">23</b>}
          </Link>
        ))}
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

// ---------------------------------------------------------------------------
// Header Component
// ---------------------------------------------------------------------------

function Header({ region, setRegion, dark, setDark, setMobileOpen }: any) {
  const [online, setOnline] = useState(true);
  const [todayStr] = useState(() => {
    const d = new Date();
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  });

  return (
    <header className="topbar">
      <div className="mobile-menu">
        <button className="icon-button" onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <Menu size={22} />
        </button>
      </div>
      <div className="title-block">
        <h1>Live Operational Map</h1>
        <p>GIS telemetry and accessibility tracking across the North Eastern Region</p>
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
        <span className="date-header">{todayStr} · GIS Feed</span>
        <button
          className={`system-status ${online ? "online" : "offline"}`}
          onClick={() => setOnline(!online)}
          aria-label="Toggle GIS telemetry status"
        >
          <i />
          {online ? "Telemetry Active" : "Offline Cache"}
        </button>
        <button
          className="icon-button theme-toggle"
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
// In-Canvas Marker Popup
// ---------------------------------------------------------------------------

function MarkerPopup({
  target,
  close,
}: {
  target: MapTarget;
  close: () => void;
}) {
  return (
    <div className="map-popup live-popup">
      <button onClick={close} aria-label="Close details">
        <X size={14} />
      </button>
      <small className={`eyebrow ${target.type === "incident" ? "red" : "blue"}`}>
        {target.category}
      </small>
      <h3 style={{ fontSize: "14px", marginTop: "4px" }}>{target.title}</h3>
      <p style={{ fontSize: "10px", color: "#7e91a1", marginBottom: "8px" }}>{target.location}</p>
      <div className="live-detail-list">
        <span>
          Status <b>{target.status}</b>
        </span>
        <span>
          Severity/Risk <b>{target.severity}</b>
        </span>
        <span>
          Telemetry <b>{target.lastUpdated}</b>
        </span>
        <span>
          Operational Detail <b>{target.details}</b>
        </span>
      </div>
      <div className="popup-actions">
        <Link to={target.linkTo} className="popup-action" style={{ textAlign: "center", textDecoration: "none" }}>
          {target.linkText}
        </Link>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Compact Map Legend (Requirement #2)
// ---------------------------------------------------------------------------

function MapLegend() {
  return (
    <div className="map-compact-legend">
      <div className="legend-items-wrap">
        <strong style={{ fontSize: "9px", color: "#4f677b", letterSpacing: "0.5px" }}>MAP LEGEND:</strong>
        <span className="legend-item">
          <i className="legend-dot dot-green" /> Safe / Accessible Route
        </span>
        <span className="legend-item">
          <i className="legend-dot dot-yellow" /> Warning / Delayed Convoy
        </span>
        <span className="legend-item">
          <i className="legend-dot dot-red" /> Critical / High Risk Corridor
        </span>
        <span className="legend-item">
          <i className="legend-dot dot-incident" /> Active Hazard Incident
        </span>
        <span className="legend-item">
          <i className="legend-dot dot-vehicle" /> Fleet Vehicle (Simulated)
        </span>
      </div>
      <div className="legend-meta">
        <Info size={13} />
        <span>GIS Telemetry · NER Operational Corridors</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Selected Target / Location Detail Panel (Requirement #4)
// ---------------------------------------------------------------------------

function SelectedTargetDetail({
  target,
  onClose,
}: {
  target: MapTarget | null;
  onClose: () => void;
}) {
  if (!target) return null;

  return (
    <section className="map-selected-detail">
      <div className="detail-head">
        <div className="detail-title-group">
          <div className={`detail-icon ${target.type}`}>
            {target.type === "incident" && <AlertTriangle size={18} />}
            {target.type === "vehicle" && <Truck size={18} />}
            {target.type === "route" && <RouteIcon size={18} />}
            {target.type === "city" && <MapPin size={18} />}
          </div>
          <div>
            <span className={`eyebrow ${target.type === "incident" ? "red" : "blue"}`}>
              {target.category}
            </span>
            <h3>{target.title}</h3>
            <p>{target.location}</p>
          </div>
        </div>
        <button className="icon-button" onClick={onClose} aria-label="Dismiss detail panel" style={{ color: "#8a9caa" }}>
          <X size={16} />
        </button>
      </div>

      <div className="detail-grid" style={{ gridTemplateColumns: 'repeat(3,minmax(0,1fr))' }}>
        <div className="detail-cell">
          <span>Status</span>
          <strong>{target.status}</strong>
        </div>
        <div className="detail-cell">
          <span>Severity &amp; Risk</span>
          <strong
            style={{
              color:
                target.severityTone === "critical"
                  ? "#d15156"
                  : target.severityTone === "yellow"
                  ? "#d1932a"
                  : "#25a16b",
            }}
          >
            {target.severity}
          </strong>
        </div>
        <div className="detail-cell">
          <span>Condition</span>
          <strong>{target.condition}</strong>
        </div>
      </div>

      <div className="detail-actions">
        <span style={{ fontSize: "10px", color: "#8497a7", marginRight: "auto", display: "flex", alignItems: "center", gap: "5px" }}>
          <Clock size={13} />
          <span>Telemetry updated automatically</span>
        </span>
        <Link to={target.linkTo} className="outline-button" style={{ textDecoration: "none" }}>
          <span>{target.linkText}</span>
          <ExternalLink size={12} />
        </Link>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// GIS Map Component
// ---------------------------------------------------------------------------

function GisMap({
  activeFilter,
  setActiveFilter,
  selectedTarget,
  setSelectedTarget,
  onOpenPlanModal,
  emergency,
  onToggleEmergency,
}: {
  activeFilter: string;
  setActiveFilter: (f: string) => void;
  selectedTarget: MapTarget | null;
  setSelectedTarget: (t: MapTarget | null) => void;
  onOpenPlanModal: () => void;
  emergency: boolean;
  onToggleEmergency: () => void;
}) {
  const [layersOpen, setLayersOpen] = useState(false);
  const [styleOpen, setStyleOpen] = useState(false);
  const [mapStyle, setMapStyle] = useState("Standard");
  const [zoom, setZoom] = useState(1);
  const [popup, setPopup] = useState<MapTarget | null>(selectedTarget);
  const [selectedRoute, setSelectedRoute] = useState(0);
  const [showLocation, setShowLocation] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [v2vAlerts, setV2VAlerts] = useState(() => getV2VAlerts());

  useEffect(() => {
    const unsub = subscribeV2VAlerts(() => {
      setV2VAlerts(getV2VAlerts());
    });
    return unsub;
  }, []);

  const [layers, setLayers] = useState({
    vehicles: true,
    routes: true,
    incidents: true,
    risk: true,
    districts: true,
  });

  const toggleLayer = (key: keyof typeof layers) =>
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));

  // Filter markers based on quick filter & search
  const visibleVehicles = useMemo(() => {
    if (!layers.vehicles) return [];
    return VEHICLES_DATA.filter((v) => {
      if (activeFilter === "Incidents") return false;
      if (activeFilter === "Weather") return false;
      if (activeFilter === "Offline" && v.status !== "offline") return false;
      if (activeFilter === "High Risk" && v.riskLevel.indexOf("Critical") === -1 && v.riskLevel.indexOf("High") === -1)
        return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return v.id.toLowerCase().includes(q) || v.corridor.toLowerCase().includes(q);
      }
      return true;
    });
  }, [layers.vehicles, activeFilter, searchQuery]);

  const visibleIncidents = useMemo(() => {
    if (!layers.incidents) return [];
    return INCIDENTS_DATA.filter((inc) => {
      if (activeFilter === "Vehicles" || activeFilter === "Offline") return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return inc.type.toLowerCase().includes(q) || inc.corridor.toLowerCase().includes(q);
      }
      return true;
    });
  }, [layers.incidents, activeFilter, searchQuery]);

  const visibleCities = useMemo(() => {
    if (!layers.districts) return [];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return NER_CITIES.filter((c) => c.name.toLowerCase().includes(q) || c.state.toLowerCase().includes(q));
    }
    return NER_CITIES;
  }, [layers.districts, searchQuery]);

  const handleSelectVehicle = (v: typeof VEHICLES_DATA[0]) => {
    const target: MapTarget = {
      type: "vehicle",
      id: v.id,
      title: `Convoy Unit ${v.id} (${v.cargo})`,
      category: "FLEET VEHICLE · EN ROUTE (SIMULATED)",
      location: v.corridor,
      condition: `Speed: ${v.speed} · ETA: ${v.eta}`,
      status: v.status === "normal" ? "On Schedule" : v.status === "delayed" ? "Delayed in Mountain Pass" : v.status,
      severity: v.riskLevel,
      severityTone: v.status === "normal" ? "green" : v.status === "delayed" ? "yellow" : "critical",
      lastUpdated: v.lastUpdated,
      details: `Active telemetry node: ${v.id}`,
      linkTo: "/vehicles",
      linkText: "Inspect Vehicle Telemetry",
    };
    setSelectedTarget(target);
    setPopup(target);
  };

  const handleSelectIncident = (inc: typeof INCIDENTS_DATA[0]) => {
    const target: MapTarget = {
      type: "incident",
      id: inc.id,
      title: `${inc.type} — ${inc.corridor}`,
      category: "HAZARD INCIDENT · CRITICAL",
      location: inc.corridor,
      condition: inc.details,
      status: inc.status,
      severity: `${inc.severity} (${inc.risk} Disruption)`,
      severityTone: inc.severity === "CRITICAL" ? "critical" : "yellow",
      lastUpdated: inc.lastUpdated,
      details: `Estimated clearance time: ${inc.clearance}`,
      linkTo: "/incidents",
      linkText: "Inspect Incident Report",
    };
    setSelectedTarget(target);
    setPopup(target);
  };

  const handleSelectRoute = (routeIdx: number) => {
    setSelectedRoute(routeIdx);
    const r = routes[routeIdx];
    if (!r) return;
    const target: MapTarget = {
      type: "route",
      id: `ROUTE-${routeIdx}`,
      title: `Corridor: ${r.route}`,
      category: "TRANSIT CORRIDOR · LOGISTICS ROUTE",
      location: `Corridor Distance: ${r.distance}`,
      condition: `Weather: ${r.condition} · ETA: ${r.eta}`,
      status: r.status,
      severity: `${r.risk}% Disruption Risk`,
      severityTone: r.risk > 70 ? "critical" : r.risk > 40 ? "yellow" : "green",
      lastUpdated: "Simulated Model Telemetry",
      details: `Corridor status: ${r.status}`,
      linkTo: "/routes",
      linkText: "Inspect Corridor Analysis",
    };
    setSelectedTarget(target);
    setPopup(target);
  };

  const handleSelectCity = (c: typeof NER_CITIES[0]) => {
    const target: MapTarget = {
      type: "city",
      id: `CITY-${c.name}`,
      title: `${c.name} Logistics Hub`,
      category: "REGIONAL HUB · DISPATCH NODE",
      location: `${c.state}, North Eastern Region`,
      condition: c.role,
      status: "Operational Dispatch Hub",
      severity: "Hub Normal",
      severityTone: "green",
      lastUpdated: "Connected to Regional GIS",
      details: "Regional monitoring station active",
      linkTo: "/live-map",
      linkText: "Set Map Center",
    };
    setSelectedTarget(target);
    setPopup(target);
  };

  return (
    <div className="gis-wrap">
      {/* Top Map Toolbar */}
      <div className="map-toolbar">
        <div className="map-toolbar-left">
          <label className="map-search">
            <Search size={16} />
            <input
              placeholder="Search city, route, or vehicle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search map items"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                style={{ border: 0, background: "transparent", color: "#8a98aa", padding: 0 }}
              >
                <X size={14} />
              </button>
            )}
          </label>

          <button className="outline-button" onClick={onOpenPlanModal}>
            <RouteIcon size={14} /> Plan Route
          </button>

          {/* Layers Dropdown */}
          <div className="map-tool-menu">
            <button className="outline-button" onClick={() => setLayersOpen(!layersOpen)}>
              <Layers3 size={14} /> Layers
            </button>
            {layersOpen && (
              <div className="gis-menu">
                <strong>Map Layers</strong>
                {[
                  ["vehicles", "Vehicles (Fleet)"],
                  ["routes", "Primary Routes"],
                  ["incidents", "Incident Markers"],
                  ["risk", "Hazard Risk Zones"],
                  ["districts", "City/District Nodes"],
                ].map(([key, label]) => (
                  <label key={key}>
                    <input
                      type="checkbox"
                      checked={layers[key as keyof typeof layers]}
                      onChange={() => toggleLayer(key as keyof typeof layers)}
                    />
                    {label}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Style Dropdown */}
          <div className="map-tool-menu">
            <button className="outline-button" onClick={() => setStyleOpen(!styleOpen)}>
              <MapIcon size={14} /> {mapStyle}
            </button>
            {styleOpen && (
              <div className="gis-menu style-menu">
                {["Standard", "Satellite", "Terrain"].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setMapStyle(s);
                      setStyleOpen(false);
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="map-toolbar-right">
          <button
            className={`emergency-button ${emergency ? "active" : ""}`}
            onClick={onToggleEmergency}
            title="Toggle priority emergency corridor monitoring"
          >
            <ShieldAlert size={14} />
            {emergency ? "EMERGENCY PRIORITY ACTIVE" : "Emergency Mode"}
          </button>
        </div>
      </div>

      {/* Map Canvas */}
      <div className={`live-map-canvas ${mapStyle.toLowerCase()}`}>
        <div className="map-grid" style={{ transform: `scale(${zoom})` }}>
          <div className="district-lines" />
          <div className="region-shape" />

          {/* SVG Routes */}
          <svg className="routes-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            {layers.routes && (
              <>
                <path
                  d="M20 73 C32 62 39 40 47 29 S63 50 70 76"
                  className={`route-line route-red ${selectedRoute === 0 ? "route-selected" : ""}`}
                  onClick={() => handleSelectRoute(0)}
                >
                  <title>Guwahati → Itanagar (NH-13)</title>
                </path>
                <path
                  d="M21 73 C33 79 56 79 70 76"
                  className={`route-line route-green ${selectedRoute === 1 ? "route-selected" : ""}`}
                  onClick={() => handleSelectRoute(1)}
                >
                  <title>Guwahati → Shillong → Imphal</title>
                </path>
                <path
                  d="M47 29 C52 49 58 65 70 76"
                  className={`route-line route-yellow ${selectedRoute === 2 ? "route-selected" : ""}`}
                  onClick={() => handleSelectRoute(2)}
                >
                  <title>Itanagar → Imphal Corridor</title>
                </path>
                <path d="M20 73 C39 59 57 45 70 76" className="route-line route-alt">
                  <title>Alternate Route</title>
                </path>
              </>
            )}
          </svg>

          {/* Cities / Regional Nodes */}
          {visibleCities.map((p) => (
            <div
              className="city"
              key={p.name}
              style={{ left: `${p.x}%`, top: `${p.y}%`, cursor: "pointer" }}
              onClick={() => handleSelectCity(p)}
              title={`${p.name} (${p.state})`}
            >
              <i />
              {p.name}
            </div>
          ))}

          {/* Hazard Risk Zones */}
          {layers.risk && (
            <>
              <div className="risk-zone zone-one" title="High Landslide Vulnerability Zone" />
              <div className="risk-zone zone-two" title="Moderate Flood Risk Plain" />
            </>
          )}

          {/* Vehicle Markers */}
          {visibleVehicles.map((v) => (
            <button
              key={v.id}
              className={`marker vehicle-marker ${v.status}`}
              style={{ left: `${v.x}%`, top: `${v.y}%` }}
              onClick={() => handleSelectVehicle(v)}
              aria-label={`Vehicle ${v.id}`}
              title={`Vehicle ${v.id} (${v.status})`}
            >
              <Truck size={13} />
            </button>
          ))}

          {/* Incident Markers */}
          {visibleIncidents.map((inc) => (
            <button
              key={inc.id}
              className="marker incident-marker"
              style={{ left: `${inc.x}%`, top: `${inc.y}%` }}
              onClick={() => handleSelectIncident(inc)}
              aria-label={inc.type}
              title={`${inc.type} - ${inc.corridor}`}
            >
              <AlertTriangle size={14} />
            </button>
          ))}

          {/* V2V Driver-Reported Hazard Markers */}
          {layers.incidents &&
            v2vAlerts
              .filter((a) => a.status === "active")
              .map((v2vAlert) => {
                const locLower = v2vAlert.location.toLowerCase();
                let x = 36;
                let y = 46;
                if (locLower.includes("bhalukpong")) { x = 35; y = 48; }
                else if (locLower.includes("bomdila")) { x = 38; y = 41; }
                else if (locLower.includes("itanagar")) { x = 47; y = 29; }
                else if (locLower.includes("guwahati")) { x = 22; y = 72; }
                else if (locLower.includes("shillong")) { x = 31; y = 79; }
                else if (locLower.includes("silchar")) { x = 51; y = 84; }

                const handleSelectV2V = () => {
                  const target: MapTarget = {
                    type: "incident",
                    id: v2vAlert.id,
                    title: `⚠ Hazard Reported Ahead: ${v2vAlert.title.replace(/^V2V Hazard:\s*/i, "")}`,
                    category: "DRIVER-REPORTED HAZARD",
                    location: v2vAlert.location,
                    condition: v2vAlert.message,
                    status: "Driver Report Active",
                    severity: `${v2vAlert.severity.toUpperCase()} (${v2vAlert.confidenceScore}% Signal Confidence)`,
                    severityTone: v2vAlert.severity === "High" ? "critical" : "yellow",
                    lastUpdated: v2vAlert.timestamp,
                    details: `Recommended action: ${v2vAlert.recommendedAction}. Source: Driver report`,
                    linkTo: "/alerts",
                    linkText: "Inspect Driver Hazard Alert",
                  };
                  setSelectedTarget(target);
                  setPopup(target);
                };

                return (
                  <button
                    key={v2vAlert.id}
                    className="marker incident-marker"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      border: "2px solid #ef4444",
                      background: "#991b1b",
                      boxShadow: "0 0 10px rgba(239, 68, 68, 0.6)",
                    }}
                    onClick={handleSelectV2V}
                    aria-label={v2vAlert.title}
                    title={`⚠ Hazard reported ahead: ${v2vAlert.title} at ${v2vAlert.location}`}
                  >
                    <AlertTriangle size={14} style={{ color: "#fca5a5" }} />
                  </button>
                );
              })}
        </div>

        {/* Floating Marker Popup */}
        {popup && <MarkerPopup target={popup} close={() => setPopup(null)} />}

        {/* Map Control Buttons */}
        <div className="map-controls">
          <button onClick={() => setZoom((z) => Math.min(1.4, Number((z + 0.1).toFixed(1))))} aria-label="Zoom in">
            <Plus size={16} />
          </button>
          <button onClick={() => setZoom((z) => Math.max(0.8, Number((z - 0.1).toFixed(1))))} aria-label="Zoom out">
            <Minus size={16} />
          </button>
          <button onClick={() => setShowLocation(!showLocation)} aria-label="Toggle operator location">
            <Crosshair size={16} />
          </button>
          <button onClick={() => setZoom(1)} aria-label="Reset zoom">
            <Maximize2 size={16} />
          </button>
        </div>

        {/* Operator Location Chip */}
        {showLocation && (
          <div className="operator-location">
            <Crosshair size={14} /> Operator location · Guwahati Operations Command
          </div>
        )}

        {/* Selected Route Chip */}
        <div className="route-chip" onClick={() => handleSelectRoute(selectedRoute)}>
          <span className="route-dot" />
          {routes[selectedRoute]?.route}
          <b>{routes[selectedRoute]?.risk}% disruption risk</b>
        </div>

        {/* Canvas Bottom Status Bar */}
        <div className="map-status-bar">
          <span>
            <i /> GIS Telemetry: <b>Active</b>
          </span>
          <span>
            Fleet <b>128 vehicles</b>
          </span>
          <span>
            Hazards <b>23 active</b>
          </span>
        </div>
      </div>

      {/* Compact Quick Filters (Requirement #5) */}
      <div className="quick-filters">
        <span className="quick-filters-label">Filters:</span>
        {["All", "Vehicles", "Routes", "Incidents", "High Risk", "Weather", "Offline"].map((f) => (
          <button
            className={activeFilter === f ? "active" : ""}
            key={f}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Compact Legend Bar (Requirement #2) */}
      <MapLegend />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Route Planning & Emergency Modal
// ---------------------------------------------------------------------------

function Modal({ type, close }: { type: "emergency" | "plan"; close: () => void }) {
  const isEmergency = type === "emergency";
  return (
    <div className="modal-backdrop" onClick={close}>
      <div className="compare-modal map-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={close} aria-label="Close modal">
          <X size={19} />
        </button>
        <small className={`eyebrow ${isEmergency ? "red" : "blue"}`}>
          {isEmergency ? "PRIORITY OPERATIONS" : "CORRIDOR ROUTE PLANNING"}
        </small>
        <h2>{isEmergency ? "Activate Emergency Mode?" : "Plan Operations Route"}</h2>
        {isEmergency ? (
          <>
            <p className="modal-subtitle">
              Emergency mode prioritizes critical supply corridors, disaster response convoys, and automated bypass routing.
            </p>
            <ul className="modal-bullets">
              <li>High-priority relief supplies and emergency logistics</li>
              <li>Hazard alerts across blocked and partially closed corridors</li>
              <li>Real-time rerouting around high-vulnerability mountain passes</li>
            </ul>
            <div className="modal-footer">
              <span />
              <div>
                <button className="primary-button" onClick={close}>
                  Activate Mode
                </button>
                <button className="outline-button" onClick={close}>
                  Cancel
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="form-grid">
              <label>
                Origin Hub
                <select defaultValue="Guwahati">
                  {NER_CITIES.map((c) => (
                    <option key={c.name}>{c.name}</option>
                  ))}
                </select>
              </label>
              <label>
                Destination Terminal
                <select defaultValue="Itanagar">
                  {NER_CITIES.map((c) => (
                    <option key={c.name}>{c.name}</option>
                  ))}
                </select>
              </label>
              <label>
                Convoy Unit
                <select defaultValue="NR-042">
                  {VEHICLES_DATA.map((v) => (
                    <option key={v.id}>{v.id} ({v.cargo})</option>
                  ))}
                </select>
              </label>
              <label>
                Cargo Classification
                <select defaultValue="Medicine">
                  <option>Medicine &amp; Relief</option>
                  <option>Food Supplies</option>
                  <option>Heavy Freight</option>
                  <option>Fuel Tanker</option>
                </select>
              </label>
              <label>
                Priority Class
                <select defaultValue="High">
                  <option>Normal Operational</option>
                  <option>High Priority</option>
                  <option>Emergency Transit</option>
                </select>
              </label>
              <label>
                Departure Window
                <input type="time" defaultValue="11:00" />
              </label>
            </div>
            <div className="modal-footer">
              <p>AI evaluates terrain vulnerability, weather hazards, and elevation grades to recommend optimal routes.</p>
              <button className="primary-button" onClick={close}>
                Calculate Optimal Corridor <ChevronRight size={15} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Live Map Screen
// ---------------------------------------------------------------------------

export default function LiveMap() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [region, setRegion] = useState(regions[0]);
  const [dark, setDark] = useState(false);
  const [filter, setFilter] = useState("All");
  const [modal, setModal] = useState<"emergency" | "plan" | null>(null);
  const [emergency, setEmergency] = useState(false);

  // Selected target for compact operational detail panel
  const [selectedTarget, setSelectedTarget] = useState<MapTarget | null>(DEFAULT_TARGET);

  return (
    <div className={dark ? "app-shell dark-mode" : "app-shell"}>
      <Sidebar {...{ collapsed, setCollapsed, mobileOpen, setMobileOpen }} />

      <main className="main-shell">
        <Header {...{ region, setRegion, dark, setDark, setMobileOpen }} />

        <div className="dashboard live-dashboard">
          <div className={`map-page-grid ${emergency ? "emergency-active" : ""}`}>
            {/* Full-width Operational Map Panel */}
            <section className="panel live-map-panel">
              <div className="panel-header">
                <div>
                  <h2>Live Regional Operational Map</h2>
                  <p>OpenStreetMap-aligned GIS surface · Active View: {filter}</p>
                </div>
                <div className="map-connect">
                  <i /> Connected · Simulated Telemetry
                </div>
              </div>

              <GisMap
                activeFilter={filter}
                setActiveFilter={setFilter}
                selectedTarget={selectedTarget}
                setSelectedTarget={setSelectedTarget}
                onOpenPlanModal={() => setModal("plan")}
                emergency={emergency}
                onToggleEmergency={() => setEmergency(!emergency)}
              />
            </section>

            {/* Selected Location / Incident Detail (Requirement #4) */}
            <SelectedTargetDetail
              target={selectedTarget}
              onClose={() => setSelectedTarget(null)}
            />
          </div>
        </div>
      </main>

      {/* Modals */}
      {modal && (
        <Modal
          type={modal}
          close={() => {
            setModal(null);
            if (modal === "emergency") setEmergency(true);
          }}
        />
      )}
    </div>
  );
}
