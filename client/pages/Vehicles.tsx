import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Bell,
  BrainCircuit,
  ChevronDown,
  ChevronRight,
  Clock3,
  CloudRain,
  Download,
  Fuel,
  Gauge,
  LayoutDashboard,
  Map as MapIcon,
  MapPin,
  Menu,
  Minus,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  RefreshCw,
  Route as RouteIcon,
  Search,
  SlidersHorizontal,
  Sun,
  Truck,
  X,
  ExternalLink,
  ShieldAlert,
  Info,
} from "lucide-react";
import { Link } from "react-router-dom";
import PathnovaLogo from "@/components/PathnovaLogo";
import { regions } from "@/data/dashboard";
import { vehicleRecords, VehicleRecord } from "@/data/vehicles";

// ---------------------------------------------------------------------------
// Helpers & Data Mappings
// ---------------------------------------------------------------------------

const statusTone = (x: string) =>
  x === "Moving" ? "green" : x === "Delayed" ? "amber" : x === "Critical" ? "red" : "slate";

const toneMap: Record<string, string> = {
  blue: "text-blue-600 bg-blue-50",
  green: "text-emerald-600 bg-emerald-50",
  amber: "text-amber-600 bg-amber-50",
  red: "text-red-600 bg-red-50",
  slate: "text-slate-500 bg-slate-100",
};

const mapCities: [string, number, number][] = [
  ["Guwahati", 22, 72],
  ["Itanagar", 47, 29],
  ["Shillong", 31, 79],
  ["Imphal", 70, 76],
  ["Aizawl", 60, 91],
  ["Kohima", 79, 56],
  ["Agartala", 44, 94],
  ["Gangtok", 5, 67],
  ["Silchar", 51, 84],
  ["Bomdila", 38, 41],
];

// Coordinates on the SVG canvas for the 8 vehicles
const vehicleCoords = [
  [39, 50],
  [31, 79],
  [70, 76],
  [60, 91],
  [38, 41],
  [55, 48],
  [51, 84],
  [22, 72],
];

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
            className={`nav-item ${label === "Vehicles" ? "active" : ""}`}
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
        <h1>Fleet Tracking</h1>
        <p>Operational vehicle monitoring and corridor progress across North Eastern Region</p>
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
        <span className="date-header">{todayStr} · Fleet Feed</span>
        <button
          className={`system-status ${online ? "online" : "offline"}`}
          onClick={() => setOnline(!online)}
          aria-label="Toggle telemetry status"
        >
          <i />
          {online ? "Simulated GPS" : "Offline Cache"}
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
// 1. Compact Fleet Overview (Requirement #1)
// ---------------------------------------------------------------------------

function FleetOverview() {
  const kpis = [
    ["Total Vehicles", "128", "Fleet registered", Truck, "blue"],
    ["Moving / Active", "96", "On schedule in corridor", Activity, "green"],
    ["Delayed", "14", "Mountain pass congestion", Clock3, "amber"],
    ["Critical", "5", "Immediate review required", AlertTriangle, "red"],
    ["Offline", "18", "Depot standby / no signal", MapPin, "slate"],
  ];

  return (
    <div className="kpi-grid fleet-kpis">
      {kpis.map(([label, value, note, Icon, tone]: any) => (
        <div className="kpi-card" key={label}>
          <div className="kpi-top">
            <span className={`kpi-icon ${toneMap[tone] || "text-slate-500 bg-slate-100"}`}>
              <Icon size={18} />
            </span>
            <span className="muted">Telemetry</span>
          </div>
          <div className="kpi-value">{value}</div>
          <div className="kpi-label">{label}</div>
          <div className="kpi-footer">
            <span className={`dot ${tone}`} />
            <span className="muted">{note}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 5. Fleet Map Component (Optional / Collapsible, Requirement #5)
// ---------------------------------------------------------------------------

function FleetMap({ onSelect }: { onSelect: (v: VehicleRecord) => void }) {
  const [zoom, setZoom] = useState(1);

  return (
    <div className="fleet-map">
      <div className="map-grid" style={{ transform: `scale(${zoom})` }}>
        <div className="district-lines" />
        <div className="region-shape" />

        {/* SVG Route Corridors */}
        <svg className="routes-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M20 73 C32 62 39 40 47 29 S63 50 70 76" className="route-line route-red" />
          <path d="M21 73 C33 79 56 79 70 76" className="route-line route-green" />
          <path d="M47 29 C52 49 58 65 70 76" className="route-line route-yellow" />
          <path d="M20 73 C39 59 57 45 70 76" className="route-line route-alt" />
        </svg>

        {/* NER Regional Nodes */}
        {mapCities.map(([name, x, y]) => (
          <div className="city" key={name} style={{ left: `${x}%`, top: `${y}%` }}>
            <i />
            {name}
          </div>
        ))}

        {/* Vehicle Markers */}
        {vehicleRecords.map((v, i) => {
          const [cx, cy] = vehicleCoords[i] || [50, 50];
          return (
            <button
              key={v.id}
              className={`marker fleet-marker ${statusTone(v.status)}`}
              style={{ left: `${cx}%`, top: `${cy}%` }}
              onClick={() => onSelect(v)}
              aria-label={`View ${v.id}`}
              title={`${v.id} (${v.status}) - ${v.currentLocation} → ${v.destination}`}
            >
              <Truck size={13} />
            </button>
          );
        })}
      </div>

      {/* Map Controls */}
      <div className="map-controls">
        <button
          onClick={() => setZoom((z) => Math.min(1.4, Number((z + 0.1).toFixed(1))))}
          aria-label="Zoom in"
        >
          <Plus size={16} />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(0.8, Number((z - 0.1).toFixed(1))))}
          aria-label="Zoom out"
        >
          <Minus size={16} />
        </button>
        <button onClick={() => setZoom(1)} aria-label="Reset zoom">
          <MapPin size={15} />
        </button>
      </div>

      {/* Map Legend Caption */}
      <div className="fleet-map-caption">
        <span>
          <i className="legend-green" /> Moving
        </span>
        <span>
          <i className="legend-yellow" /> Delayed
        </span>
        <span>
          <i className="legend-red" /> Critical
        </span>
        <span>
          <i className="legend-critical" /> Offline
        </span>
        <span style={{ color: "#7b91a2", marginLeft: "4px" }}>· Click any marker to inspect</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 2 & 3. Main Vehicle Operations Table (Requirement #2 & #3)
// ---------------------------------------------------------------------------

function VehicleTable({
  records,
  onSelect,
  search,
  setSearch,
  filter,
  setFilter,
  showMap,
  setShowMap,
}: {
  records: VehicleRecord[];
  onSelect: (v: VehicleRecord) => void;
  search: string;
  setSearch: (s: string) => void;
  filter: string;
  setFilter: (f: string) => void;
  showMap: boolean;
  setShowMap: (m: boolean) => void;
}) {
  return (
    <section className="panel vehicle-table-panel">
      <div className="panel-header">
        <div>
          <h2>Vehicle Operations Directory</h2>
          <p>
            {records.length} {records.length === 1 ? "unit" : "units"} matching current search and filter criteria
          </p>
        </div>
        <div className="table-actions">
          <button
            className={`outline-button ${showMap ? "active" : ""}`}
            onClick={() => setShowMap(!showMap)}
            title="Toggle compact fleet map overview"
          >
            <MapIcon size={14} />
            {showMap ? "Hide Map" : "Show Map"}
          </button>
          <button
            className="outline-button"
            onClick={() => alert("Fleet manifest report exported.")}
            title="Export vehicle fleet manifest"
          >
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Collapsible Fleet Map View */}
      {showMap && (
        <div className="fleet-map-container" style={{ padding: "0 20px 14px" }}>
          <FleetMap onSelect={onSelect} />
        </div>
      )}

      {/* Search Bar & Filter Chips */}
      <div className="vehicle-toolbar">
        <label className="search-box fleet-search">
          <Search size={15} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, driver, location, or destination..."
            aria-label="Search vehicles"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              style={{ border: 0, background: "transparent", color: "#8a98aa", padding: 0 }}
            >
              <X size={14} />
            </button>
          )}
        </label>

        <div className="filter-chips">
          {["All", "Active", "Moving", "Delayed", "Critical", "High Risk", "Offline"].map((f) => (
            <button
              key={f}
              className={filter === f ? "active" : ""}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Table */}
      <div className="table-wrap">
        <table className="fleet-table">
          <thead>
            <tr>
              <th>Vehicle ID &amp; Type</th>
              <th>Assigned Driver</th>
              <th>Corridor Route</th>
              <th>Current Speed</th>
              <th>Status</th>
              <th>Risk Level</th>
              <th>ETA &amp; Progress</th>
              <th>Fuel</th>
              <th>Last Telemetry</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ textAlign: "center", padding: "30px", color: "#8497a7" }}>
                  No vehicles found matching "{search}". Clear your search or filter.
                </td>
              </tr>
            ) : (
              records.map((v: VehicleRecord) => (
                <tr key={v.id} onClick={() => onSelect(v)}>
                  <td>
                    <strong>{v.id}</strong>
                    <small>{v.vehicleType}</small>
                  </td>
                  <td>{v.driver}</td>
                  <td>
                    <strong>{v.currentLocation}</strong>
                    <small style={{ color: "#7e91a1" }}>→ {v.destination}</small>
                  </td>
                  <td>
                    <strong>{v.speed} km/h</strong>
                    <small style={{ color: "#8a9caa" }}>Avg {v.averageSpeed} km/h</small>
                  </td>
                  <td>
                    <span className={`fleet-status ${statusTone(v.status)}`}>
                      <i />
                      {v.status}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`risk-value ${
                        v.riskLevel === "High"
                          ? "risk-high"
                          : v.riskLevel === "Medium"
                          ? "risk-medium"
                          : v.riskLevel === "Low"
                          ? "risk-low"
                          : ""
                      }`}
                    >
                      {v.riskLevel}
                    </span>
                  </td>
                  <td>
                    <strong>{v.eta}</strong>
                    <small style={{ color: "#7e91a1" }}>{v.routeProgress}% completed</small>
                  </td>
                  <td>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <Fuel size={12} style={{ color: v.fuelLevel < 40 ? "#d15156" : "#2677d9" }} />
                      <b>{v.fuelLevel}%</b>
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: "9px", color: "#8a9caa" }}>{v.lastUpdated}</span>
                  </td>
                  <td>
                    <button
                      className="view-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(v);
                      }}
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 6. Active Fleet Exceptions (Requirement #6)
// ---------------------------------------------------------------------------

function AlertsPanel({ onSelect }: { onSelect: (v: VehicleRecord) => void }) {
  const alertedVehicles = vehicleRecords.filter((v) => v.alert);

  return (
    <section className="panel vehicle-alerts">
      <div className="panel-header">
        <div>
          <h2>Active Fleet Exceptions &amp; Alerts</h2>
          <p>Corridor warnings and vehicle delay advisories requiring operator attention</p>
        </div>
        <span className="status-pill bg-red-50 text-red-700">{alertedVehicles.length} Active</span>
      </div>

      {alertedVehicles.map((v) => (
        <button key={v.id} onClick={() => onSelect(v)}>
          <span className={`alert-icon ${v.riskLevel === "High" ? "high" : "medium"}`}>
            <AlertTriangle size={14} />
          </span>
          <span>
            <strong>
              {v.id} · {v.currentLocation} → {v.destination}
            </strong>
            <small>{v.alert}</small>
          </span>
          <ChevronRight size={14} />
        </button>
      ))}
    </section>
  );
}

// ---------------------------------------------------------------------------
// 4. Selected Vehicle Details Drawer (Requirement #4)
// ---------------------------------------------------------------------------

function DetailsDrawer({
  vehicle,
  close,
}: {
  vehicle: VehicleRecord;
  close: () => void;
}) {
  return (
    <div className="drawer-overlay" onClick={close}>
      <aside className="vehicle-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <div>
            <span className="eyebrow blue">SIMULATED TELEMETRY</span>
            <h2>{vehicle.id}</h2>
            <p>
              {vehicle.driver} · {vehicle.vehicleType}
            </p>
          </div>
          <button className="icon-button" onClick={close} aria-label="Close drawer">
            <X size={19} />
          </button>
        </div>

        {/* Status Pills */}
        <div className="drawer-status">
          <span className={`fleet-status ${statusTone(vehicle.status)}`}>
            <i />
            {vehicle.status}
          </span>
          <span
            className={`status-pill ${
              vehicle.riskLevel === "High"
                ? "bg-red-50 text-red-700"
                : vehicle.riskLevel === "Medium"
                ? "bg-amber-50 text-amber-700"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {vehicle.riskLevel} Risk
          </span>
        </div>

        {/* Route Progress Bar */}
        <div className="drawer-route">
          <div>
            <MapPin size={15} />
            <span>{vehicle.currentLocation}</span>
          </div>
          <div className="route-progress">
            <i style={{ width: `${vehicle.routeProgress}%` }} />
            <b>{vehicle.routeProgress}%</b>
          </div>
          <div>
            <MapPin size={15} />
            <span>{vehicle.destination}</span>
          </div>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="drawer-details">
          {[
            ["Current speed", `${vehicle.speed} km/h`, Gauge],
            ["Average speed", `${vehicle.averageSpeed} km/h`, Activity],
            ["Distance travelled", `${vehicle.distanceTravelled} km`, RouteIcon],
            ["Remaining distance", `${vehicle.remainingDistance} km`, MapPin],
            ["Estimated Arrival", vehicle.eta, Clock3],
            ["Fuel level", `${vehicle.fuelLevel}%`, Fuel],
            ["Telemetry ping", `${vehicle.lastUpdated} (Simulated)`, Clock3],
          ].map(([label, value, Icon]: any) => (
            <div key={label}>
              <Icon size={14} />
              <span>
                {label}
                <b>{value}</b>
              </span>
            </div>
          ))}
        </div>

        {/* Vehicle Alert Notice */}
        {vehicle.alert && (
          <div
            style={{
              marginTop: "20px",
              padding: "12px",
              background: "#fff5f4",
              border: "1px solid #f9dedb",
              borderRadius: "8px",
              display: "flex",
              alignItems: "flex-start",
              gap: "8px",
            }}
          >
            <AlertTriangle size={16} style={{ color: "#d15156", flexShrink: 0, marginTop: "2px" }} />
            <div>
              <strong style={{ fontSize: "11px", color: "#b93d40", display: "block" }}>
                Operational Exception Detected
              </strong>
              <p style={{ fontSize: "10px", color: "#6a7b8a", margin: "3px 0 0", lineHeight: "1.4" }}>
                {vehicle.alert}
              </p>
            </div>
          </div>
        )}

        {/* Quick Navigation Actions */}
        <div className="drawer-actions" style={{ marginTop: "22px" }}>
          <Link to="/live-map" className="primary-button" style={{ display: "flex", justifyContent: "center", gap: "6px" }}>
            <span>Locate on Live Map</span>
            <ExternalLink size={13} />
          </Link>
          <Link to="/routes" className="outline-button" style={{ display: "flex", justifyContent: "center", gap: "6px" }}>
            <span>Inspect Route Corridors</span>
            <ExternalLink size={13} />
          </Link>
        </div>
      </aside>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Fleet Tracking Page
// ---------------------------------------------------------------------------

export default function Vehicles() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [region, setRegion] = useState(regions[0]);
  const [dark, setDark] = useState(false);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<VehicleRecord | null>(null);
  const [refresh, setRefresh] = useState(false);
  const [showMap, setShowMap] = useState(true);

  // Filtered records
  const records = useMemo(() => {
    return vehicleRecords.filter((v) => {
      const matchesFilter =
        filter === "All"
          ? true
          : filter === "Active"
          ? v.status !== "Offline"
          : filter === "High Risk"
          ? v.riskLevel === "High"
          : filter === "Moving"
          ? v.status === "Moving"
          : filter === "Delayed"
          ? v.status === "Delayed"
          : filter === "Critical"
          ? v.status === "Critical"
          : filter === "Offline"
          ? v.status === "Offline"
          : true;

      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        v.id.toLowerCase().includes(q) ||
        v.driver.toLowerCase().includes(q) ||
        v.currentLocation.toLowerCase().includes(q) ||
        v.destination.toLowerCase().includes(q) ||
        v.vehicleType.toLowerCase().includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [filter, search]);

  return (
    <div className={dark ? "app-shell dark-mode" : "app-shell"}>
      <Sidebar {...{ collapsed, setCollapsed, mobileOpen, setMobileOpen }} />

      <main className="main-shell">
        <Header {...{ region, setRegion, dark, setDark, setMobileOpen }} />

        <div className="dashboard vehicles-dashboard">
          {/* Header Intro */}
          <div className="dashboard-intro">
            <div>
              <span className="eyebrow blue">FLEET OPERATIONS · CORRIDOR TELEMETRY</span>
              <h2>Fleet Operations &amp; Tracking</h2>
              <p>
                Real-time operational status, corridor transit progress, and exception monitoring across the North Eastern Region.
              </p>
            </div>
            <div className="fleet-top-actions">
              <button
                className="outline-button"
                onClick={() => {
                  setRefresh(true);
                  setTimeout(() => setRefresh(false), 600);
                }}
                title="Refresh vehicle telemetry"
              >
                <RefreshCw size={14} className={refresh ? "spin" : ""} /> Refresh
              </button>
              <span className="live-label">
                <i /> Simulated Telemetry
              </span>
            </div>
          </div>

          {/* 1. Compact Fleet Overview */}
          <FleetOverview />

          {/* 2 & 3. Main Vehicle List / Table (with Search, Filters, and Optional Map) */}
          <VehicleTable
            records={records}
            onSelect={setSelected}
            search={search}
            setSearch={setSearch}
            filter={filter}
            setFilter={setFilter}
            showMap={showMap}
            setShowMap={setShowMap}
          />

          {/* 6. Active Fleet Exceptions */}
          <AlertsPanel onSelect={setSelected} />
        </div>
      </main>

      {/* 4. Selected Vehicle Details Drawer */}
      {selected && <DetailsDrawer vehicle={selected} close={() => setSelected(null)} />}
    </div>
  );
}
