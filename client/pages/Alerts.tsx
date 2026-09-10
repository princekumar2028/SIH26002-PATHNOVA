import { useState, useMemo } from "react";
import {
  AlertTriangle,
  Bell,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CloudRain,
  ExternalLink,
  FileText,
  LayoutDashboard,
  Map as MapIcon,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  RefreshCw,
  Route as RouteIcon,
  Search,
  Settings,
  ShieldCheck,
  Sun,
  Truck,
  X,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import PathnovaLogo from "@/components/PathnovaLogo";
import { regions } from "@/data/dashboard";
import { alertRecords as initialAlerts, AlertRecord } from "@/data/alerts";

const nav = [
  ["Overview", LayoutDashboard, "/"],
  ["Live Map", MapIcon, "/live-map"],
  ["Vehicles", Truck, "/vehicles"],
  ["Routes", RouteIcon, "/routes"],
  ["Risk Intelligence", BrainCircuit, "/risk-intelligence"],
  ["Incident Reporting", AlertTriangle, "/incidents"],
  ["Weather & Hazards", CloudRain, "/weather-hazards"],
  ["Alerts", Bell, "/alerts"],
];

const sevColor = (x: string) =>
  x === "Critical" ? "red" : x === "High" ? "orange" : x === "Medium" ? "amber" : "green";

const iconFor = (type: string) => {
  switch (type) {
    case "Weather":
      return CloudRain;
    case "Vehicle":
      return Truck;
    case "Route":
      return RouteIcon;
    case "AI Predicted":
      return BrainCircuit;
    default:
      return AlertTriangle;
  }
};

function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen, unreadCount }: any) {
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
          aria-label="Toggle sidebar"
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>
      <div className="mobile-close">
        <button className="icon-button" onClick={() => setMobileOpen(false)} aria-label="Close sidebar">
          <X size={20} />
        </button>
      </div>
      <nav className="nav-list">
        {nav.map(([label, Icon, href]: any) =>
          href === "#" ? (
            <button key={label} className="nav-item">
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ) : (
            <Link
              key={label}
              to={href}
              className={`nav-item ${label === "Alerts" ? "active" : ""}`}
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={18} />
              <span>{label}</span>
              {label === "Alerts" && unreadCount > 0 && <b className="nav-badge">{unreadCount}</b>}
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
              <small>{loggedOut ? "Demo session ended" : "Operations Manager"}</small>
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
  return (
    <header className="topbar">
      <div className="mobile-menu">
        <button className="icon-button" onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <Menu size={22} />
        </button>
      </div>
      <div className="title-block">
        <h1>Operational Alerts</h1>
        <p>Monitor critical disruptions, fleet events and safety alerts across NER.</p>
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
        <span className="system-status online">
          <i /> Operational Alert Feed
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

/* ─── 1. Compact Alert Summary ─── */
function CompactAlertSummary({ records }: { records: AlertRecord[] }) {
  const critical = records.filter((a) => a.severity === "Critical").length;
  const high = records.filter((a) => a.severity === "High").length;
  const medium = records.filter((a) => a.severity === "Medium").length;
  const activeUnread = records.filter((a) => !a.isRead).length;

  return (
    <section className="panel alert-summary" style={{ marginTop: "14px" }}>
      <div className="panel-header">
        <div>
          <h2>Alert Status Summary</h2>
          <p>Active severity distribution across monitored transport corridors</p>
        </div>
        <span className="live-label">
          <i /> Live Monitoring
        </span>
      </div>
      <div className="summary-grid">
        <span>
          <b className="risk-red">{critical}</b>
          <small>Critical Disruptions</small>
        </span>
        <span>
          <b className="risk-orange">{high}</b>
          <small>High Priority</small>
        </span>
        <span>
          <b className="risk-amber">{medium}</b>
          <small>Medium Priority</small>
        </span>
        <span>
          <b style={{ color: "#2563eb" }}>{activeUnread}</b>
          <small>Active / Unread</small>
        </span>
      </div>
      <div className="severity-stack" style={{ margin: "0 20px 14px" }}>
        <i
          style={{ width: `${Math.max(6, (critical / records.length) * 100)}%`, background: "#bb3f4b" }}
          title={`Critical: ${critical}`}
        />
        <i
          style={{ width: `${Math.max(12, (high / records.length) * 100)}%`, background: "#e27d2f" }}
          title={`High: ${high}`}
        />
        <i
          style={{ width: `${Math.max(18, (medium / records.length) * 100)}%`, background: "#dda62f" }}
          title={`Medium: ${medium}`}
        />
        <i style={{ flex: 1, background: "#2ba773" }} title="Resolved / Low Risk" />
      </div>
    </section>
  );
}

/* ─── 2. Active Alert Feed ─── */
function AlertFeed({
  alerts,
  selected,
  onSelect,
  onRead,
  onAcknowledge,
  search,
  setSearch,
  filter,
  setFilter,
}: {
  alerts: AlertRecord[];
  selected: AlertRecord | null;
  onSelect: (a: AlertRecord) => void;
  onRead: (id: string) => void;
  onAcknowledge: (id: string) => void;
  search: string;
  setSearch: (s: string) => void;
  filter: string;
  setFilter: (f: string) => void;
}) {
  const unreadCount = alerts.filter((a) => !a.isRead).length;

  return (
    <section className="panel alert-feed" style={{ marginTop: "18px" }}>
      <div className="panel-header">
        <div>
          <h2>Active Alert Feed</h2>
          <p>Prioritized operational disruptions, weather impacts and vehicle safety alerts</p>
        </div>
        <span className="status-pill bg-red-50 text-red-700 font-semibold">
          {unreadCount} unread
        </span>
      </div>

      {/* Filter Bar */}
      <div style={{ padding: "0 20px 14px", borderBottom: "1px solid #edf1f3" }}>
        <div className="alert-filterbar" style={{ marginBottom: "10px" }}>
          <label className="search-box" style={{ flex: "0 0 280px" }}>
            <Search size={15} />
            <input
              placeholder="Search alert title, corridor, vehicle or source..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <div className="alert-filter-chips">
            {["All", "Unread", "Critical", "High", "Medium", "Route", "Vehicle", "Weather"].map(
              (x) => (
                <button
                  key={x}
                  className={filter === x ? "active" : ""}
                  onClick={() => setFilter(x)}
                >
                  {x}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Feed Rows */}
      {alerts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "#64748b" }}>
          <p>No alerts match the selected search or filter criteria.</p>
        </div>
      ) : (
        alerts.map((a) => {
          const Icon = iconFor(a.type);
          const isSelected = selected?.id === a.id;

          return (
            <article
              className={`alert-feed-row ${a.isRead ? "read" : "unread"}`}
              key={a.id}
              onClick={() => {
                onRead(a.id);
                onSelect(a);
              }}
              style={{
                background: isSelected ? "#f0fdfa" : undefined,
                borderLeftColor: isSelected ? "#0d9488" : undefined,
              }}
            >
              <span className={`alert-feed-icon ${sevColor(a.severity)}`}>
                <Icon size={17} />
              </span>

              <div className="alert-feed-content">
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <strong>{a.title}</strong>
                  <span className={`incident-severity ${sevColor(a.severity)}`}>
                    {a.severity}
                  </span>
                  <span
                    className={`status-pill ${
                      a.status === "Resolved"
                        ? "bg-green-50 text-green-700"
                        : a.status === "Acknowledged"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                    style={{ fontSize: "9px", padding: "1px 6px" }}
                  >
                    {a.status}
                  </span>
                </div>

                <p>{a.description}</p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                    fontSize: "11px",
                    color: "#64748b",
                    marginTop: "4px",
                  }}
                >
                  <span>
                    <b>Location:</b> {a.location}
                  </span>
                  <span>
                    <b>Corridor:</b> {a.affectedRoutes}
                  </span>
                  <span>
                    <b>Source:</b> {a.source}
                  </span>
                  <span>
                    <b>Time:</b> {a.createdAt}
                  </span>
                </div>
              </div>

              <div className="alert-row-actions">
                <div style={{ display: "flex", gap: "6px" }}>
                  {a.status === "New" && (
                    <button
                      className="outline-button"
                      style={{ fontSize: "10px", padding: "4px 8px", height: "auto" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAcknowledge(a.id);
                      }}
                      title="Acknowledge alert receipt"
                    >
                      Acknowledge
                    </button>
                  )}
                  {a.type === "Route" ? (
                    <Link
                      to="/routes"
                      className="view-button"
                      onClick={(e) => e.stopPropagation()}
                      style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                    >
                      View Route <ChevronRight size={12} />
                    </Link>
                  ) : a.type === "Vehicle" ? (
                    <Link
                      to="/vehicles"
                      className="view-button"
                      onClick={(e) => e.stopPropagation()}
                      style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                    >
                      Track Vehicle <ChevronRight size={12} />
                    </Link>
                  ) : a.type === "Weather" ? (
                    <Link
                      to="/weather-hazards"
                      className="view-button"
                      onClick={(e) => e.stopPropagation()}
                      style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                    >
                      View Weather <ChevronRight size={12} />
                    </Link>
                  ) : (
                    <button className="view-button">Details</button>
                  )}
                </div>
                <button
                  className="mini-action"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRead(a.id);
                  }}
                >
                  {a.isRead ? <Check size={14} className="text-teal-600" /> : "Mark read"}
                </button>
              </div>
            </article>
          );
        })
      )}
    </section>
  );
}

/* ─── 3. Alert Details (Drawer when selected) ─── */
function Drawer({
  alert,
  close,
  onAcknowledge,
  onResolve,
}: {
  alert: AlertRecord;
  close: () => void;
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
}) {
  const [notice, setNotice] = useState("");
  const Icon = iconFor(alert.type);

  const handleAck = () => {
    onAcknowledge(alert.id);
    setNotice("Alert acknowledged. Dispatch team notified.");
  };

  const handleRes = () => {
    onResolve(alert.id);
    setNotice("Alert marked resolved. Incident cleared from active monitor.");
  };

  return (
    <div className="drawer-overlay" onClick={close}>
      <aside className="alert-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <div>
            <span className="eyebrow red">OPERATIONAL ALERT DETAILS</span>
            <h2>{alert.id}</h2>
            <p>
              {alert.type} · Detected {alert.createdAt}
            </p>
          </div>
          <button className="icon-button" onClick={close} aria-label="Close drawer">
            <X size={19} />
          </button>
        </div>

        <div className="drawer-alert-title">
          <span className={`alert-feed-icon ${sevColor(alert.severity)}`}>
            <Icon size={18} />
          </span>
          <div>
            <h3>{alert.title}</h3>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span className={`incident-severity ${sevColor(alert.severity)}`}>
                {alert.severity} priority
              </span>
              <span
                className={`status-pill ${
                  alert.status === "Resolved"
                    ? "bg-green-50 text-green-700"
                    : alert.status === "Acknowledged"
                    ? "bg-blue-50 text-blue-700"
                    : "bg-amber-50 text-amber-700"
                }`}
                style={{ fontSize: "10px", padding: "1px 7px" }}
              >
                Status: {alert.status}
              </span>
            </div>
          </div>
        </div>

        <div className="drawer-info-grid">
          <span>
            Location / Corridor<b>{alert.location}</b>
          </span>
          <span>
            Source System<b>{alert.source}</b>
          </span>
          <span>
            Affected Corridor<b>{alert.affectedRoutes}</b>
          </span>
          <span>
            Affected Vehicles<b>{alert.affectedVehicles} vehicles in range</b>
          </span>
          <span>
            Detected Timestamp<b>{alert.createdAt}</b>
          </span>
          <span>
            Expected Disruption<b>{alert.expectedImpact}</b>
          </span>
        </div>

        <div style={{ marginTop: "16px" }}>
          <strong style={{ fontSize: "11px", color: "#334155", display: "block", marginBottom: "4px" }}>
            Alert Operational Description
          </strong>
          <p className="drawer-description" style={{ margin: "0", lineHeight: "1.5" }}>
            {alert.description}
          </p>
        </div>

        {/* Recommended Action */}
        <section className="recommended-action" style={{ marginTop: "16px" }}>
          <strong>
            <Zap size={15} /> Recommended Operator Action
          </strong>
          <p>{alert.recommendedAction}</p>
        </section>

        {notice && <div className="drawer-notice">{notice}</div>}

        {/* Operational Workflow Actions */}
        <div className="drawer-actions" style={{ marginTop: "18px" }}>
          {alert.status !== "Acknowledged" && alert.status !== "Resolved" && (
            <button className="primary-button" onClick={handleAck}>
              Acknowledge Alert
            </button>
          )}
          {alert.status !== "Resolved" && (
            <button className="outline-button" onClick={handleRes}>
              Mark Resolved
            </button>
          )}

          {/* Quick Context Links */}
          {alert.type === "Route" && (
            <Link to="/routes" className="outline-button" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "4px" }}>
              Inspect Route <ExternalLink size={13} />
            </Link>
          )}
          {alert.type === "Vehicle" && (
            <Link to="/vehicles" className="outline-button" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "4px" }}>
              Inspect Fleet <ExternalLink size={13} />
            </Link>
          )}
          {alert.type === "Weather" && (
            <Link to="/weather-hazards" className="outline-button" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "4px" }}>
              Check Weather <ExternalLink size={13} />
            </Link>
          )}
        </div>
      </aside>
    </div>
  );
}

/* ─── 4. Notification Channels ─── */
function NotificationChannels() {
  const channels = [
    { name: "In-App Dashboard", status: "Active & Real-Time", theme: "green", desc: "Live operations screen" },
    { name: "Email Notifications", status: "Configured (Prototype)", theme: "blue", desc: "Digest & critical alerts" },
    { name: "SMS Broadcast", status: "Ready for Integration", theme: "amber", desc: "Driver emergency alerts" },
    { name: "WhatsApp Gateway", status: "Ready for Integration", theme: "amber", desc: "Transporter dispatch" },
    { name: "Push Notifications", status: "Ready for Integration", theme: "amber", desc: "Mobile field crew" },
  ];

  return (
    <section className="panel notification-channels" style={{ marginTop: "20px" }}>
      <div className="panel-header">
        <div>
          <h2>Notification Delivery Channels</h2>
          <p>Multi-channel delivery status for fleet managers, depot heads and transport crews</p>
        </div>
        <span className="demo-label">PROTOTYPE CONFIGURATION</span>
      </div>

      <div className="channel-grid">
        {channels.map((c) => (
          <div key={c.name}>
            <Bell size={16} className="text-teal-700" />
            <span>
              <strong>{c.name}</strong>
              <small>{c.status}</small>
            </span>
            <i className={`dot ${c.theme}`} />
          </div>
        ))}
      </div>

      <p className="channel-note">
        In-app alerts are active in real time. Outbound SMS, Email and Push endpoints are prepared for API integration during deployment.
      </p>
    </section>
  );
}

/* ─── 5. Alert Simulation — DEMO MODE ─── */
function AlertSimulation({
  onTrigger,
  isLiveSim,
  setIsLiveSim,
}: {
  onTrigger: (type: string, severity: "Critical" | "High" | "Medium", location: string) => void;
  isLiveSim: boolean;
  setIsLiveSim: (v: boolean) => void;
}) {
  const [eventType, setEventType] = useState("Route Disruption");
  const [severity, setSeverity] = useState<"Critical" | "High" | "Medium">("High");
  const [location, setLocation] = useState("Bhalukpong · NH-13 Km 45");

  const handleSimulate = () => {
    onTrigger(eventType, severity, location.trim() || "NER Transport Corridor");
  };

  return (
    <section className="panel test-alert" style={{ marginTop: "20px" }}>
      <div className="panel-header">
        <div>
          <h2>Alert Simulation</h2>
          <p>
            Simulate operational events to preview how PATHNOVA prioritizes alerts and routes around disruptions.
          </p>
          <span className="demo-label">DEMO MODE · SIMULATION</span>
        </div>
        <span className={`live-label ${isLiveSim ? "active" : ""}`}>
          <i /> {isLiveSim ? "Simulated Stream Running" : "Manual Simulation Mode"}
        </span>
      </div>

      <div className="test-fields" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px", padding: "0 20px" }}>
        <div>
          <label style={{ fontSize: "10px", color: "#64748b", display: "block", marginBottom: "4px" }}>
            Event Type
          </label>
          <select value={eventType} onChange={(e) => setEventType(e.target.value)} style={{ width: "100%" }}>
            <option value="Route Disruption">Route Disruption (Landslide / Road Damage)</option>
            <option value="Vehicle Risk">Vehicle Risk (Breakdown / Speed Disruption)</option>
            <option value="Weather Warning">Severe Weather Warning (Heavy Rain / Fog)</option>
            <option value="Flood Hazard">Flood & Waterlogging Hazard</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: "10px", color: "#64748b", display: "block", marginBottom: "4px" }}>
            Severity
          </label>
          <select value={severity} onChange={(e) => setSeverity(e.target.value as any)} style={{ width: "100%" }}>
            <option value="Critical">Critical (Immediate Action)</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: "10px", color: "#64748b", display: "block", marginBottom: "4px" }}>
            Location Landmark
          </label>
          <input
            placeholder="e.g. Near Bhalukpong · NH-13"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}>
          <button className="primary-button" onClick={handleSimulate} style={{ flex: 1 }}>
            Trigger Demo Alert
          </button>
          <button
            className={`outline-button ${isLiveSim ? "active" : ""}`}
            onClick={() => setIsLiveSim(!isLiveSim)}
            title="Toggle periodic simulated alert generation"
          >
            {isLiveSim ? "Pause Stream" : "Auto Stream"}
          </button>
        </div>
      </div>

      <div style={{ margin: "14px 20px 0", padding: "10px 14px", background: "#f8fafc", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
        <small style={{ color: "#64748b", fontSize: "11px", display: "block" }}>
          <b>Simulation Notice:</b> Generated alerts inject simulated disruption events into the PATHNOVA operations room to verify triage, priority tagging and route recommendation failover. No production SMS or emails are triggered.
        </small>
      </div>
    </section>
  );
}

/* ═══════════════ Page Root ═══════════════ */
export default function Alerts() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [region, setRegion] = useState(regions[0]);
  const [dark, setDark] = useState(false);

  // Alerts State
  const [records, setRecords] = useState<AlertRecord[]>(initialAlerts);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<AlertRecord | null>(null);
  const [toast, setToast] = useState("");
  const [isLiveSim, setIsLiveSim] = useState(false);

  const unreadCount = useMemo(() => records.filter((a) => !a.isRead).length, [records]);

  // Filtered Alert List
  const filtered = useMemo(() => {
    return records.filter((a) => {
      const matchesFilter =
        filter === "All" ||
        (filter === "Unread" && !a.isRead) ||
        filter === a.severity ||
        filter === a.type;
      const matchesSearch =
        !search ||
        `${a.id} ${a.title} ${a.description} ${a.location} ${a.source} ${a.affectedRoutes}`
          .toLowerCase()
          .includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [records, filter, search]);

  const markRead = (id: string) => {
    setRecords((prev) => prev.map((a) => (a.id === id ? { ...a, isRead: true } : a)));
  };

  const markAllRead = () => {
    setRecords((prev) => prev.map((a) => ({ ...a, isRead: true })));
    setToast("All alerts marked as read.");
    setTimeout(() => setToast(""), 3000);
  };

  const handleAcknowledge = (id: string) => {
    setRecords((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Acknowledged", isRead: true } : a))
    );
    if (selected?.id === id) {
      setSelected({ ...selected, status: "Acknowledged", isRead: true });
    }
    setToast(`Alert ${id} acknowledged by operator.`);
    setTimeout(() => setToast(""), 3000);
  };

  const handleResolve = (id: string) => {
    setRecords((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Resolved", isRead: true } : a))
    );
    if (selected?.id === id) {
      setSelected({ ...selected, status: "Resolved", isRead: true });
    }
    setToast(`Alert ${id} marked as resolved.`);
    setTimeout(() => setToast(""), 3000);
  };

  const handleTriggerSimulatedAlert = (
    eventType: string,
    severity: "Critical" | "High" | "Medium",
    location: string
  ) => {
    const newId = `ALT-2026-${String(records.length + 190).padStart(4, "0")}`;
    const newAlert: AlertRecord = {
      id: newId,
      type: eventType.includes("Weather")
        ? "Weather"
        : eventType.includes("Vehicle")
        ? "Vehicle"
        : "Route",
      severity,
      title: `Simulated: ${eventType}`,
      description: `Simulated event triggered at ${location}. Disruption detected on primary transport corridor requiring operator action.`,
      location,
      source: "Simulation Engine (Demo Mode)",
      createdAt: "Just now",
      status: "New",
      isRead: false,
      confidence: 94,
      riskProbability: severity === "Critical" ? 88 : severity === "High" ? 72 : 45,
      affectedRoutes: location.includes("Bhalukpong")
        ? "Guwahati → Itanagar"
        : "Shillong → Silchar",
      affectedVehicles: severity === "Critical" ? 6 : 2,
      expectedImpact: severity === "Critical" ? "+60 min delay" : "+25 min delay",
      recommendedAction: "Review alternate corridor options and alert affected drivers.",
    };

    setRecords((prev) => [newAlert, ...prev]);
    setSelected(newAlert);
    setToast(`Simulated alert [${newId}] injected [DEMO MODE]`);
    setTimeout(() => setToast(""), 4000);
  };

  return (
    <div className={dark ? "app-shell dark-mode" : "app-shell"}>
      <Sidebar
        {...{
          collapsed,
          setCollapsed,
          mobileOpen,
          setMobileOpen,
          unreadCount,
        }}
      />

      <main className="main-shell">
        <Header {...{ region, setRegion, dark, setDark, setMobileOpen }} />

        <div className="dashboard alerts-dashboard">
          {/* Intro Section */}
          <div className="dashboard-intro">
            <div>
              <span className="eyebrow blue">OPERATIONS CENTER · REAL-TIME EVENTS</span>
              <h2>Operational Alerts & Triage</h2>
              <p>
                Prioritize critical route disruptions, weather warnings and vehicle safety alerts
                across NER transport corridors.
              </p>
            </div>
            <div className="alert-head-actions">
              <button className="outline-button" onClick={markAllRead}>
                <Check size={14} /> Mark all read
              </button>
              <button
                className="outline-button"
                onClick={() => {
                  setToast("Alert stream synchronized.");
                  setTimeout(() => setToast(""), 2000);
                }}
              >
                <RefreshCw size={14} /> Refresh
              </button>
            </div>
          </div>

          {/* 1. Compact Alert Summary */}
          <CompactAlertSummary records={records} />

          {/* 2. Active Alert Feed (Main Focal Content) */}
          <AlertFeed
            alerts={filtered}
            selected={selected}
            onSelect={setSelected}
            onRead={markRead}
            onAcknowledge={handleAcknowledge}
            search={search}
            setSearch={setSearch}
            filter={filter}
            setFilter={setFilter}
          />

          {/* 3. Notification Channels */}
          <NotificationChannels />

          {/* 4. Alert Simulation — DEMO MODE */}
          <AlertSimulation
            onTrigger={handleTriggerSimulatedAlert}
            isLiveSim={isLiveSim}
            setIsLiveSim={setIsLiveSim}
          />
        </div>
      </main>

      {/* 5. Alert Details Drawer when selected */}
      {selected && (
        <Drawer
          alert={selected}
          close={() => setSelected(null)}
          onAcknowledge={handleAcknowledge}
          onResolve={handleResolve}
        />
      )}

      {/* Toast Feedback */}
      {toast && (
        <div className="toast-success" style={{ zIndex: 1000 }}>
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toast}</span>
          <button onClick={() => setToast("")} aria-label="Dismiss toast">
            <X size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
