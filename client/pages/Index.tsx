import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import PathnovaLogo from "@/components/PathnovaLogo";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bell,
  BrainCircuit,
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
  Mountain,
  PanelLeftClose,
  PanelLeftOpen,
  RefreshCw,
  Route as RouteIcon,
  Search,
  ShieldCheck,
  Sun,
  Truck,
  Waves,
  Wind,
  X,
  Zap,
} from "lucide-react";
import { regions } from "@/data/dashboard";
import { useWeather } from "@/hooks/use-weather";

/* ─── Navigation ─── */
const navItems = [
  ["Overview", LayoutDashboard, "/dashboard"],
  ["Routes", RouteIcon, "/routes"],
  ["Live Map", MapIcon, "/live-map"],
  ["Vehicles", Truck, "/vehicles"],
  ["Risk Intelligence", BrainCircuit, "/risk-intelligence"],
  ["Incident Reporting", AlertTriangle, "/incidents"],
  ["Weather & Hazards", CloudRain, "/weather-hazards"],
  ["Alerts", Bell, "/alerts"],
];

/* ─── Dynamic Live Time Hook ─── */
function useLiveTime() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dateStr = useMemo(() => {
    return now.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, [now]);

  const timeStr = useMemo(() => {
    return now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  }, [now]);

  const greeting = useMemo(() => {
    const hour = now.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, [now]);

  return { dateStr, timeStr, greeting };
}

/* ─── Sidebar Component ─── */
function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }: any) {
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);

  return (
    <aside
      className={`sidebar ${collapsed ? "sidebar-collapsed" : ""} ${
        mobileOpen ? "mobile-open" : ""
      }`}
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
          aria-label="Toggle sidebar"
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      <div className="mobile-close">
        <button
          className="icon-button"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="nav-list">
        {navItems.map(([label, Icon, href]: any) => {
          const isActive =
            href === "/dashboard"
              ? location.pathname === "/" || location.pathname === "/dashboard"
              : location.pathname.startsWith(href);

          return (
            <Link
              key={label}
              to={href}
              className={`nav-item ${isActive ? "active" : ""}`}
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={18} />
              <span>{label}</span>
              {label === "Alerts" && <b className="nav-badge">4</b>}
            </Link>
          );
        })}
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
              <Link
                to="/driver"
                role="menuitem"
                style={{ display: "block", width: "100%", padding: "8px 10px", textDecoration: "none", color: "#1a6f69", fontWeight: 600, fontSize: "10px" }}
              >
                🚚 Driver Portal →
              </Link>
              <Link
                to="/"
                role="menuitem"
                style={{ display: "block", width: "100%", padding: "8px 10px", textDecoration: "none", color: "#64748b", fontSize: "10px" }}
              >
                ⇋ Switch Role / Landing
              </Link>
              <button
                type="button"
                role="menuitem"
                onClick={() => setProfileOpen(false)}
              >
                Profile Settings
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

/* ─── Header Component ─── */
function Header({
  region,
  setRegion,
  dark,
  setDark,
  setMobileOpen,
}: any) {
  const [notice, setNotice] = useState(false);
  const [profile, setProfile] = useState(false);

  return (
    <header className="topbar">
      <div className="mobile-menu">
        <button
          className="icon-button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </div>

      <div className="title-block">
        <h1>Overview</h1>
        <p>North Eastern Region Logistics Command Center</p>
      </div>

      <div className="header-actions">
        <label className="search-box hidden md:flex">
          <Search size={16} />
          <input placeholder="Search corridor, vehicle, alert..." />
        </label>

        <div className="select-wrap">
          <MapIcon size={16} />
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            aria-label="Select region"
          >
            {regions.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          <ChevronDown size={14} />
        </div>

        <span className="system-status online hidden sm:inline-flex">
          <i /> System Operational
        </span>

        <Link
          to="/driver"
          className="header-driver-switch hidden sm:inline-flex"
          id="header-driver-switch"
          title="Switch to Driver Portal"
        >
          <Truck size={14} />
          <span>Driver Portal →</span>
        </Link>

        <div className="relative">
          <button
            className="icon-button notification-button"
            onClick={() => setNotice(!notice)}
            aria-label="Notifications"
          >
            <Bell size={19} />
            <b>4</b>
          </button>
          {notice && (
            <div className="dropdown notice-drop" style={{ width: "220px" }}>
              <strong>Operational Alerts</strong>
              <p>4 critical corridor alerts require review</p>
              <Link
                to="/alerts"
                className="text-button"
                onClick={() => setNotice(false)}
                style={{ fontSize: "11px", fontWeight: 600 }}
              >
                Open Alerts Center →
              </Link>
            </div>
          )}
        </div>

        <button
          className="icon-button theme-toggle"
          onClick={() => setDark(!dark)}
          aria-label="Toggle dark mode"
        >
          {dark ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        <div className="relative">
          <button
            className="header-avatar"
            onClick={() => setProfile(!profile)}
          >
            LA <ChevronDown size={13} />
          </button>
          {profile && (
            <div className="dropdown profile-drop">
              <strong>Logistics Administrator</strong>
              <p>Operations Command</p>
              <Link
                to="/alerts"
                className="text-button"
                onClick={() => setProfile(false)}
              >
                System Status
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/* ─── 2. Regional Operational Summary ─── */
function RegionalOperationalSummary() {
  const summaryPoints = [
    { label: "Regional Risk", value: "Medium (32%)", note: "Average across 8 states", dot: "amber" },
    { label: "Fleet Status", value: "96 Active Vehicles", note: "88 on schedule · 8 delayed", dot: "blue" },
    { label: "Active Incidents", value: "5 Field Reports", note: "2 verified · 3 under review", dot: "red" },
    { label: "Corridors", value: "8 Key Routes", note: "6 clear · 2 under caution", dot: "teal" },
    { label: "Weather Alert", value: "Heavy Rainfall", note: "Affecting Shillong & NH-13", dot: "amber" },
  ];

  return (
    <section className="panel" style={{ padding: "16px 20px", marginBottom: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "14px",
          paddingBottom: "10px",
          borderBottom: "1px solid #edf1f3",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "6px",
              background: "#e8f7f6",
              color: "#247c79",
              display: "grid",
              placeItems: "center",
            }}
          >
            <ShieldCheck size={16} />
          </span>
          <div>
            <h2 style={{ fontSize: "13px", margin: 0 }}>Regional Operational Summary</h2>
            <p style={{ margin: "2px 0 0", fontSize: "10px", color: "#64748b" }}>
              Unified network readiness across North Eastern Region freight corridors
            </p>
          </div>
        </div>
        <span className="live-label">
          <i /> Real-Time Network Snapshot
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: "14px",
        }}
      >
        {summaryPoints.map((item) => (
          <div
            key={item.label}
            style={{
              background: "#f8fafc",
              padding: "10px 12px",
              borderRadius: "7px",
              border: "1px solid #e2e8f0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <span className={`dot ${item.dot}`} />
              <span style={{ fontSize: "10px", color: "#64748b", fontWeight: 600 }}>
                {item.label}
              </span>
            </div>
            <strong style={{ display: "block", fontSize: "13px", color: "#1e293b", margin: "4px 0 2px" }}>
              {item.value}
            </strong>
            <small style={{ fontSize: "9px", color: "#94a3b8" }}>{item.note}</small>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── 3. Core Status Cards (Max 5) ─── */
function CoreStatusCards() {
  const cards = [
    {
      title: "Regional Risk",
      value: "32%",
      subtitle: "Moderate · AI Risk Engine",
      tone: "amber",
      Icon: BrainCircuit,
      href: "/risk-intelligence",
    },
    {
      title: "Fleet Operations",
      value: "96 Active",
      subtitle: "88 on time · 8 delayed",
      tone: "blue",
      Icon: Truck,
      href: "/vehicles",
    },
    {
      title: "Active Incidents",
      value: "5 Reports",
      subtitle: "2 verified · 3 under review",
      tone: "red",
      Icon: AlertTriangle,
      href: "/incidents",
    },
    {
      title: "Critical Alerts",
      value: "4 Critical",
      subtitle: "Immediate triage required",
      tone: "red",
      Icon: Bell,
      href: "/alerts",
    },
    {
      title: "Monitored Corridors",
      value: "8 Routes",
      subtitle: "6 clear · 2 caution",
      tone: "teal",
      Icon: RouteIcon,
      href: "/routes",
    },
  ];

  return (
    <div
      className="kpi-grid"
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        marginBottom: "20px",
      }}
    >
      {cards.map((c) => {
        const Icon = c.Icon;
        return (
          <Link
            to={c.href}
            key={c.title}
            className={`kpi-card ${c.tone === "red" ? "attention" : ""}`}
            style={{ textDecoration: "none" }}
          >
            <div className="kpi-top">
              <span
                className={`kpi-icon ${
                  c.tone === "red"
                    ? "text-red-600 bg-red-50"
                    : c.tone === "amber"
                    ? "text-amber-600 bg-amber-50"
                    : c.tone === "teal"
                    ? "text-teal-600 bg-teal-50"
                    : "text-blue-600 bg-blue-50"
                }`}
              >
                <Icon size={18} />
              </span>
              <ChevronRight size={14} className="text-slate-400" />
            </div>
            <div className="kpi-value">{c.value}</div>
            <div className="kpi-label">{c.title}</div>
            <div className="kpi-footer">
              <span className={`dot ${c.tone}`} />
              <span className="muted">{c.subtitle}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

/* ─── 4. Critical Route / Corridor Status ─── */
function CriticalCorridorStatus() {
  const corridors = [
    {
      route: "Guwahati → Itanagar (NH-13)",
      risk: "High Risk (87%)",
      riskClass: "risk-red",
      hazard: "Landslide debris & heavy rainfall near Bhalukpong",
      status: "Restricted",
      statusTone: "red",
      recommendation: "Reroute recommended — Use alternate Route B via Balipara",
    },
    {
      route: "Shillong → Silchar (NH-6)",
      risk: "Moderate (54%)",
      riskClass: "risk-orange",
      hazard: "Waterlogging & reduced visibility near Sonapur tunnel",
      status: "Caution (+35m delay)",
      statusTone: "amber",
      recommendation: "Single-lane convoy movement in effect; speed limit 30 km/h",
    },
    {
      route: "Imphal → Kohima (NH-2)",
      risk: "Moderate (42%)",
      riskClass: "risk-amber",
      hazard: "Road surface irregularities and active bridge inspection",
      status: "Passable with Care",
      statusTone: "blue",
      recommendation: "Maintain heavy vehicle spacing; standard transit permitted",
    },
    {
      route: "Silchar → Aizawl (NH-306)",
      risk: "Low Risk (22%)",
      riskClass: "risk-green",
      hazard: "Clear weather, stable road shoulders",
      status: "Fully Accessible",
      statusTone: "green",
      recommendation: "Normal dispatch schedules active",
    },
  ];

  return (
    <section className="panel" style={{ marginBottom: "20px" }}>
      <div className="panel-header">
        <div>
          <h2>Critical Corridor Status</h2>
          <p>Real-time operational conditions and transit recommendations across key NER arteries</p>
        </div>
        <Link
          to="/routes"
          className="text-button"
          style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "11px" }}
        >
          View All Routes <ChevronRight size={14} />
        </Link>
      </div>

      <div style={{ padding: "0 20px 16px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "12px",
          }}
        >
          {corridors.map((c) => (
            <div
              key={c.route}
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "14px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "8px",
                    marginBottom: "6px",
                  }}
                >
                  <strong style={{ fontSize: "12px", color: "#1e293b" }}>{c.route}</strong>
                  <span
                    className={`status-pill ${
                      c.statusTone === "red"
                        ? "bg-red-50 text-red-700"
                        : c.statusTone === "amber"
                        ? "bg-amber-50 text-amber-700"
                        : c.statusTone === "green"
                        ? "bg-green-50 text-green-700"
                        : "bg-blue-50 text-blue-700"
                    }`}
                    style={{ fontSize: "9px" }}
                  >
                    {c.status}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginBottom: "6px",
                    fontSize: "11px",
                  }}
                >
                  <span className={c.riskClass} style={{ fontWeight: 700 }}>
                    {c.risk}
                  </span>
                  <span style={{ color: "#94a3b8" }}>·</span>
                  <span style={{ color: "#64748b" }}>{c.hazard}</span>
                </div>

                <div
                  style={{
                    fontSize: "11px",
                    color: "#334155",
                    background: "#fff",
                    padding: "8px 10px",
                    borderRadius: "6px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <span style={{ color: "#0d9488", fontWeight: 600 }}>Action: </span>
                  {c.recommendation}
                </div>
              </div>

              <Link
                to="/routes"
                className="outline-button"
                style={{
                  width: "100%",
                  fontSize: "10px",
                  padding: "6px 10px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                Inspect Corridor <ChevronRight size={12} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 5. Weather & Hazard Snapshot ─── */
function WeatherSnapshot({ location }: { location: string }) {
  // Use real backend WeatherAPI
  const weatherState = useWeather(location);
  const data = weatherState.status === "success" ? weatherState.data : null;

  return (
    <section className="panel" style={{ height: "100%" }}>
      <div className="panel-header">
        <div>
          <h2>Weather & Hazard Snapshot</h2>
          <p>
            {data ? `${data.location_name}, ${data.region}` : "Guwahati, Assam"} · Live WeatherAPI
          </p>
        </div>
        <Link
          to="/weather-hazards"
          className="text-button"
          style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "11px" }}
        >
          View Weather <ChevronRight size={14} />
        </Link>
      </div>

      <div style={{ padding: "0 20px 18px" }}>
        {/* Weather Main */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 0 16px",
            borderBottom: "1px solid #edf1f3",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {data?.condition_icon ? (
              <img
                src={data.condition_icon}
                alt={data.condition}
                style={{ width: "48px", height: "48px" }}
              />
            ) : (
              <CloudRain size={36} className="text-amber-500" />
            )}
            <div>
              <strong style={{ font: "800 28px Manrope", color: "#1e293b", display: "block" }}>
                {data ? `${Math.round(data.temperature_c)}°C` : "24°C"}
              </strong>
              <span style={{ fontSize: "11px", color: "#d97706", fontWeight: 600 }}>
                {data ? data.condition : "Heavy Rain"}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "14px", textAlign: "right" }}>
            <div>
              <small style={{ fontSize: "9px", color: "#64748b", display: "block" }}>Precipitation</small>
              <b style={{ fontSize: "12px", color: "#1e293b" }}>
                {data ? `${data.precipitation_mm} mm` : "78 mm"}
              </b>
            </div>
            <div>
              <small style={{ fontSize: "9px", color: "#64748b", display: "block" }}>Wind</small>
              <b style={{ fontSize: "12px", color: "#1e293b" }}>
                {data ? `${Math.round(data.wind_speed_kph)} km/h` : "42 km/h"}
              </b>
            </div>
            <div>
              <small style={{ fontSize: "9px", color: "#64748b", display: "block" }}>Visibility</small>
              <b style={{ fontSize: "12px", color: "#1e293b" }}>
                {data ? `${data.visibility_km} km` : "4.2 km"}
              </b>
            </div>
          </div>
        </div>

        {/* Hazard & Logistics Impact */}
        <div style={{ marginTop: "14px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginBottom: "6px",
            }}
          >
            <AlertTriangle size={14} className="text-amber-600" />
            <strong style={{ fontSize: "11px", color: "#92400e" }}>
              Active Hazard: Monsoon Rain & Landslide Vulnerability
            </strong>
          </div>
          <p style={{ fontSize: "11px", color: "#475569", margin: "0 0 14px", lineHeight: "1.5" }}>
            Elevated rainfall across foothills has reduced road traction and increased rockfall risk on
            hilly curves along NH-13 and NH-6.
          </p>

          <Link
            to="/weather-hazards"
            className="primary-button"
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "6px",
              fontSize: "11px",
              textDecoration: "none",
            }}
          >
            Open Weather & Hazards Intelligence <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── 6. Recent Alerts / Operational Updates ─── */
function RecentAlerts() {
  const alertsList = [
    {
      title: "Critical Route Disruption",
      location: "Bhalukpong · NH-13",
      time: "12 min ago",
      severity: "CRITICAL",
      status: "Active",
    },
    {
      title: "High Vehicle Risk",
      location: "Shillong Corridor",
      time: "18 min ago",
      severity: "HIGH",
      status: "Active",
    },
    {
      title: "Severe Weather Warning",
      location: "Shillong, Meghalaya",
      time: "25 min ago",
      severity: "HIGH",
      status: "Acknowledged",
    },
    {
      title: "Road Damage Reported",
      location: "Near Bomdila",
      time: "42 min ago",
      severity: "MEDIUM",
      status: "Acknowledged",
    },
  ];

  return (
    <section className="panel" style={{ height: "100%" }}>
      <div className="panel-header">
        <div>
          <h2>Recent Operational Alerts</h2>
          <p>Prioritized events requiring coordinator triage</p>
        </div>
        <Link
          to="/alerts"
          className="text-button"
          style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "11px" }}
        >
          View All Alerts <ChevronRight size={14} />
        </Link>
      </div>

      <div style={{ padding: "0 20px 18px" }}>
        <div style={{ display: "grid", gap: "9px" }}>
          {alertsList.map((a) => (
            <div
              key={a.title}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 12px",
                background: "#f8fafc",
                borderRadius: "7px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "6px",
                    display: "grid",
                    placeItems: "center",
                    background:
                      a.severity === "CRITICAL"
                        ? "#fef2f2"
                        : a.severity === "HIGH"
                        ? "#fff7ed"
                        : "#f0f9ff",
                    color:
                      a.severity === "CRITICAL"
                        ? "#b91c1c"
                        : a.severity === "HIGH"
                        ? "#c2410c"
                        : "#0284c7",
                  }}
                >
                  <AlertTriangle size={15} />
                </span>
                <div>
                  <strong style={{ fontSize: "11px", color: "#1e293b", display: "block" }}>
                    {a.title}
                  </strong>
                  <small style={{ fontSize: "10px", color: "#64748b" }}>
                    {a.location} · {a.time}
                  </small>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span
                  className={`status-pill ${
                    a.severity === "CRITICAL"
                      ? "bg-red-50 text-red-700"
                      : a.severity === "HIGH"
                      ? "bg-orange-50 text-orange-700"
                      : "bg-blue-50 text-blue-700"
                  }`}
                  style={{ fontSize: "9px" }}
                >
                  {a.severity}
                </span>
              </div>
            </div>
          ))}
        </div>

        <Link
          to="/alerts"
          className="outline-button"
          style={{
            width: "100%",
            marginTop: "14px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "6px",
            fontSize: "11px",
            textDecoration: "none",
          }}
        >
          Open Operational Alerts Center <ChevronRight size={14} />
        </Link>
      </div>
    </section>
  );
}

/* ─── 7. Quick Navigation ─── */
function QuickNavigation() {
  const modules = [
    {
      title: "Live GIS Map",
      desc: "Interactive GIS map of active vehicles, routes and disruption points",
      Icon: MapIcon,
      href: "/live-map",
      color: "blue",
    },
    {
      title: "Vehicles & Fleet",
      desc: "Real-time fleet tracking, telematics and driver safety monitoring",
      Icon: Truck,
      href: "/vehicles",
      color: "teal",
    },
    {
      title: "Route Intelligence",
      desc: "AI corridor evaluation, delay prediction and alternate routing",
      Icon: RouteIcon,
      href: "/routes",
      color: "blue",
    },
    {
      title: "Risk Intelligence",
      desc: "Multi-factor vulnerability modeling and regional risk maps",
      Icon: BrainCircuit,
      href: "/risk-intelligence",
      color: "amber",
    },
    {
      title: "Incident Reporting",
      desc: "Field incident reporting with Supabase photo evidence verification",
      Icon: AlertTriangle,
      href: "/incidents",
      color: "red",
    },
    {
      title: "Weather & Hazards",
      desc: "Live WeatherAPI integration and meteorological hazard forecasts",
      Icon: CloudRain,
      href: "/weather-hazards",
      color: "blue",
    },
    {
      title: "Operational Alerts",
      desc: "Triage center, acknowledgment workflow and alert simulation",
      Icon: Bell,
      href: "/alerts",
      color: "orange",
    },
  ];

  return (
    <section className="panel" style={{ marginTop: "20px" }}>
      <div className="panel-header">
        <div>
          <h2>Module Quick Navigation</h2>
          <p>Direct operational access to all specialized PATHNOVA intelligence screens</p>
        </div>
      </div>

      <div style={{ padding: "0 20px 20px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
          }}
        >
          {modules.map((m) => {
            const Icon = m.Icon;
            return (
              <Link
                key={m.title}
                to={m.href}
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  padding: "14px",
                  textDecoration: "none",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "all 0.2s ease",
                }}
                className="hover:border-teal-500 hover:shadow-sm"
              >
                <div>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "7px",
                      background:
                        m.color === "red"
                          ? "#fef2f2"
                          : m.color === "amber"
                          ? "#fffbeb"
                          : m.color === "teal"
                          ? "#f0fdfa"
                          : m.color === "orange"
                          ? "#fff7ed"
                          : "#eff6ff",
                      color:
                        m.color === "red"
                          ? "#dc2626"
                          : m.color === "amber"
                          ? "#d97706"
                          : m.color === "teal"
                          ? "#0d9488"
                          : m.color === "orange"
                          ? "#ea580c"
                          : "#2563eb",
                      display: "grid",
                      placeItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <Icon size={17} />
                  </div>
                  <strong style={{ fontSize: "12px", color: "#1e293b", display: "block" }}>
                    {m.title}
                  </strong>
                  <p style={{ fontSize: "10px", color: "#64748b", margin: "4px 0 10px", lineHeight: "1.4" }}>
                    {m.desc}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "11px",
                    color: "#0d9488",
                    fontWeight: 600,
                  }}
                >
                  Open Screen <ArrowRight size={13} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ Main Overview Page ═══════════════ */
export default function Index() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [region, setRegion] = useState(regions[0]);
  const [dark, setDark] = useState(false);

  // Dynamic live time & greeting
  const { dateStr, timeStr, greeting } = useLiveTime();

  return (
    <div className={dark ? "app-shell dark-mode" : "app-shell"}>
      <Sidebar {...{ collapsed, setCollapsed, mobileOpen, setMobileOpen }} />

      <main className="main-shell">
        <Header {...{ region, setRegion, dark, setDark, setMobileOpen }} />

        <div className="dashboard">
          {/* Header Intro with Dynamic Time */}
          <div className="dashboard-intro">
            <div>
              <span className="eyebrow blue">
                OPERATIONS OVERVIEW · {dateStr.toUpperCase()}
              </span>
              <h2>{greeting}, Logistics Command</h2>
              <p>
                Regional logistics and accessibility overview for North Eastern Region operations.
              </p>
              <span className="overview-context">
                Live operational intelligence: Regional network readiness stable with caution on
                monsoon-affected foothill corridors.
              </span>
            </div>

            {/* Dynamic Date & Time Card */}
            <div className="date-card">
              <div className="date-icon">
                <Activity size={18} />
              </div>
              <div>
                <strong>{dateStr}</strong>
                <span>
                  <i /> {timeStr} · Live Monitoring
                </span>
              </div>
            </div>
          </div>

          {/* 1. Regional Operational Summary */}
          <RegionalOperationalSummary />

          {/* 2. Core Status Cards (Max 5) */}
          <CoreStatusCards />

          {/* 3. Critical Corridor Status */}
          <CriticalCorridorStatus />

          {/* 4. Weather Snapshot & Recent Alerts (Side by Side) */}
          <div className="two-col" style={{ alignItems: "stretch", marginBottom: "20px" }}>
            <WeatherSnapshot location="Guwahati" />
            <RecentAlerts />
          </div>

          {/* 5. Quick Navigation */}
          <QuickNavigation />
        </div>
      </main>
    </div>
  );
}
