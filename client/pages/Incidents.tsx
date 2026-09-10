import { useMemo, useState, useEffect } from "react";
import {
  AlertTriangle,
  Bell,
  BrainCircuit,
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CloudRain,
  FileText,
  LayoutDashboard,
  Loader2,
  Map as MapIcon,
  MapPin,
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
  TrafficCone,
  Truck,
  Upload,
  Waves,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import PathnovaLogo from "@/components/PathnovaLogo";
import { useNetwork } from "@/components/OfflineUX";
import { regions } from "@/data/dashboard";
import { fieldReports, incidentRecords as seedIncidents, IncidentRecord } from "@/data/incidents";
import {
  Incident,
  CreateIncidentRequest,
  CreateIncidentResponse,
  GetIncidentsResponse,
  IncidentType,
  SeverityLevel,
} from "@shared/api";

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

const sevColor = (x: string) =>
  x === "Critical" ? "red" : x === "High" ? "orange" : x === "Medium" ? "amber" : "green";

const iconFor = (x: string) =>
  x === "Landslide"
    ? Mountain
    : x === "Flood"
    ? Waves
    : x === "Traffic" || x === "Road Blockage"
    ? TrafficCone
    : AlertTriangle;

function mapApiIncidentToRecord(inc: Incident): IncidentRecord {
  const typeMap: Record<string, string> = {
    road_damage: "Road Damage",
    obstruction: "Landslide",
    flooding: "Flood",
    accident: "Accident",
    pothole: "Road Damage",
    other: "Road Blockage",
  };

  const sevMap: Record<string, IncidentRecord["severity"]> = {
    low: "Low",
    medium: "Medium",
    high: "High",
    critical: "Critical",
  };

  const statusMap: Record<string, IncidentRecord["status"]> = {
    reported: "Under Verification",
    verified: "Active",
    in_progress: "Active",
    resolved: "Resolved",
  };

  const x = Math.min(88, Math.max(12, Math.round(((inc.longitude - 89.5) / 6.0) * 80 + 10)));
  const y = Math.min(88, Math.max(15, Math.round((1 - (inc.latitude - 24.0) / 4.5) * 75 + 15)));

  const displayId = inc.id.length > 15 ? `INC-${inc.id.slice(0, 8).toUpperCase()}` : inc.id;

  return {
    id: displayId,
    type: typeMap[inc.incident_type] || "Road Damage",
    severity: sevMap[inc.severity] || "Medium",
    x,
    y,
    location: inc.location_name || `${inc.latitude.toFixed(2)}° N, ${inc.longitude.toFixed(2)}° E`,
    coordinates: `${inc.latitude.toFixed(4)}° N, ${inc.longitude.toFixed(4)}° E`,
    description: inc.description || "Field accessibility disruption reported on corridor.",
    reportedBy: "Driver Report",
    reportedAt: inc.created_at
      ? new Date(inc.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "Just now",
    status: statusMap[inc.status] || "Under Verification",
    affectedRoute: inc.location_name ? `${inc.location_name} Corridor` : "Assam / Arunachal Corridor",
    affectedVehicles: [],
    estimatedDelay:
      inc.severity === "critical" ? "+60 min" : inc.severity === "high" ? "+35 min" : "+15 min",
    disruptionProbability: inc.severity === "critical" ? 85 : inc.severity === "high" ? 65 : 35,
    confidence: 88,
    photo: inc.photo_url || undefined,
  };
}

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
              {label === "Alerts" && <b className="nav-badge">23</b>}
            </button>
          ) : (
            <Link
              key={label}
              to={href}
              className={`nav-item ${label === "Incident Reporting" ? "active" : ""}`}
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

function Header({ region, setRegion, dark, setDark, setMobileOpen, onRefresh, isRefreshing }: any) {
  const { status } = useNetwork();
  const isOnline = status === "online";

  return (
    <header className="topbar">
      <div className="mobile-menu">
        <button className="icon-button" onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <Menu size={22} />
        </button>
      </div>
      <div className="title-block">
        <h1>Incidents & Field Reports</h1>
        <p>Capture, verify and monitor road accessibility disruptions across NER.</p>
      </div>
      <div className="header-actions">
        <button
          className="outline-button hidden sm:flex"
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Refresh incident data from server"
        >
          <RefreshCw size={14} className={isRefreshing ? "animate-spin text-teal-600" : ""} />
          <span>Refresh</span>
        </button>
        <div className="select-wrap">
          <MapIcon size={16} />
          <select value={region} onChange={(e) => setRegion(e.target.value)}>
            {regions.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          <ChevronDown size={14} />
        </div>
        <span className={`system-status ${isOnline ? "online" : "offline"}`}>
          <i />
          {isOnline ? "Supabase Connected" : "Offline Mode"}
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

function Kpis({ records }: { records: IncidentRecord[] }) {
  const total = records.length;
  const active = records.filter((r) => r.status === "Active").length;
  const critical = records.filter((r) => r.severity === "Critical").length;
  const underVerification = records.filter((r) => r.status === "Under Verification").length;
  const resolved = records.filter((r) => r.status === "Resolved").length;

  const cards = [
    { label: "Total Incidents", value: total, note: "All registered reports", Icon: FileText, theme: "blue" },
    { label: "Active Incidents", value: active, note: "Affecting routes", Icon: AlertTriangle, theme: "orange" },
    { label: "Critical", value: critical, note: "Immediate response required", Icon: AlertTriangle, theme: "red" },
    { label: "Under Verification", value: underVerification, note: "Field review queued", Icon: ShieldCheck, theme: "amber" },
    { label: "Resolved", value: resolved, note: "Corridors restored", Icon: CheckCircle2, theme: "green" },
  ];

  return (
    <div className="kpi-grid incident-kpis" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
      {cards.map(({ label, value, note, Icon, theme }) => (
        <div className="kpi-card" key={label}>
          <div className="kpi-top">
            <span
              className={`kpi-icon ${
                theme === "red"
                  ? "text-red-600 bg-red-50"
                  : theme === "orange"
                  ? "text-orange-600 bg-orange-50"
                  : theme === "green"
                  ? "text-emerald-600 bg-emerald-50"
                  : theme === "amber"
                  ? "text-amber-600 bg-amber-50"
                  : "text-blue-600 bg-blue-50"
              }`}
            >
              <Icon size={18} />
            </span>
            <span className="muted">Live Status</span>
          </div>
          <div className="kpi-value">{value}</div>
          <div className="kpi-label">{label}</div>
          <div className="kpi-footer">
            <span className={`dot ${theme}`} />
            <span className="muted">{note}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function IncidentMap({
  records,
  onSelect,
}: {
  records: IncidentRecord[];
  onSelect: (i: IncidentRecord) => void;
}) {
  return (
    <section className="panel incident-map-panel">
      <div className="panel-header">
        <div>
          <h2>Live Incident Map</h2>
          <p>Verified field reports and accessibility disruption points across NER</p>
        </div>
        <span className="map-connect">
          <i /> Connected · Live GIS overlay
        </span>
      </div>
      <div className="incident-map">
        <div className="map-grid">
          <div className="district-lines" />
          <div className="region-shape" />
          <svg className="routes-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M20 73 C32 62 39 40 47 29 S63 50 70 76" className="route-line route-red" />
            <path d="M21 73 C33 79 56 79 70 76" className="route-line route-green" />
            <path d="M47 29 C52 49 58 65 70 76" className="route-line route-yellow" />
          </svg>
          {["Guwahati", "Itanagar", "Shillong", "Imphal", "Aizawl", "Kohima", "Agartala", "Gangtok", "Silchar", "Bomdila"].map(
            (n, i) => (
              <div
                className="city"
                key={n}
                style={{
                  left: `${[22, 47, 31, 70, 60, 79, 44, 5, 51, 38][i]}%`,
                  top: `${[72, 29, 79, 76, 91, 56, 94, 67, 84, 41][i]}%`,
                }}
              >
                <i />
                {n}
              </div>
            )
          )}
          {records.map((i) => {
            const Icon = iconFor(i.type);
            return (
              <button
                key={i.id}
                className={`incident-pin ${sevColor(i.severity)}`}
                style={{ left: `${i.x}%`, top: `${i.y}%` }}
                onClick={() => onSelect(i)}
                aria-label={`View ${i.type} at ${i.location}`}
                title={`${i.type} (${i.severity}) — ${i.location}`}
              >
                <Icon size={14} />
              </button>
            );
          })}
        </div>
        <div className="map-controls">
          <button>+</button>
          <button>−</button>
          <button>
            <MapPin size={14} />
          </button>
          <button>□</button>
        </div>
        <div className="incident-map-legend">
          <strong>SEVERITY</strong>
          <span>
            <i className="legend-critical" />
            Critical
          </span>
          <span>
            <i className="legend-orange" />
            High
          </span>
          <span>
            <i className="legend-yellow" />
            Medium
          </span>
          <span>
            <i className="legend-green" />
            Low
          </span>
        </div>
      </div>
    </section>
  );
}

function ReportModal({
  close,
  onCreated,
}: {
  close: () => void;
  onCreated: (incident: IncidentRecord, toastMsg: string) => void;
}) {
  const { status } = useNetwork();
  const isOffline = status === "offline";

  // Form State
  const [incidentType, setIncidentType] = useState<IncidentType>("obstruction");
  const [severity, setSeverity] = useState<SeverityLevel>("high");
  const [locationName, setLocationName] = useState("Near Bhalukpong, NH-13 Corridor");
  const [latitude, setLatitude] = useState(27.0125);
  const [longitude, setLongitude] = useState(92.6412);
  const [description, setDescription] = useState(
    "Road accessibility restricted due to debris and surface damage following rainfall."
  );
  const [isBlocking, setIsBlocking] = useState(true);

  // Photo State
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  // GPS & Submission State
  const [isLocating, setIsLocating] = useState(false);
  const [geoStatus, setGeoStatus] = useState("GPS Acquired · 27.0125° N, 92.6412° E");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStep, setSubmitStep] = useState<"idle" | "uploading" | "saving">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setPhotoError("Please select a valid image file (JPG, PNG, or WEBP).");
      return;
    }

    // Validate size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Photo size exceeds 5MB limit. Please upload a smaller image.");
      return;
    }

    setPhotoFile(file);
    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
      setPhotoPreview(null);
    }
  };

  const handleCaptureGps = () => {
    setIsLocating(true);
    setGeoStatus("Requesting GPS sensor...");

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = Number(pos.coords.latitude.toFixed(4));
          const lng = Number(pos.coords.longitude.toFixed(4));
          setLatitude(lat);
          setLongitude(lng);
          setGeoStatus(`GPS Locked: ${lat}° N, ${lng}° E`);
          setIsLocating(false);
        },
        () => {
          // Fallback to regional coordinates if denied
          setLatitude(27.0125);
          setLongitude(92.6412);
          setGeoStatus("Defaulted to Bhalukpong Corridor (27.0125° N, 92.6412° E)");
          setIsLocating(false);
        },
        { timeout: 8000 }
      );
    } else {
      setGeoStatus("Defaulted to Regional Point (27.0125° N, 92.6412° E)");
      setIsLocating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      let uploadedPhotoUrl: string | undefined = undefined;

      // STEP 1: Upload photo if selected
      if (photoFile) {
        setSubmitStep("uploading");
        const formData = new FormData();
        formData.append("photo", photoFile);

        const uploadRes = await fetch("/api/incidents/upload-photo", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const errData = await uploadRes.json().catch(() => ({}));
          throw new Error(errData.message || "Failed to upload photo evidence to Supabase Storage");
        }

        const uploadData = await uploadRes.json();
        if (uploadData.success && uploadData.photo_url) {
          uploadedPhotoUrl = uploadData.photo_url;
        }
      }

      // STEP 2: Submit incident payload to backend
      setSubmitStep("saving");
      const payload: CreateIncidentRequest = {
        incident_type: incidentType,
        severity: severity,
        location_name: locationName.trim() || "NER Transport Corridor",
        latitude: Number(latitude) || 27.0125,
        longitude: Number(longitude) || 92.6412,
        description: description.trim() || undefined,
        photo_url: uploadedPhotoUrl,
      };

      const res = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(
          errData.message ||
            (errData.errors ? errData.errors.join(", ") : "Failed to record incident")
        );
      }

      const resData: CreateIncidentResponse = await res.json();
      if (resData.success && resData.incident) {
        const newRecord = mapApiIncidentToRecord(resData.incident);
        onCreated(
          newRecord,
          uploadedPhotoUrl
            ? "Incident reported & photo stored in Supabase successfully!"
            : "Incident reported successfully!"
        );
        close();
      } else {
        throw new Error(resData.message || "Incident creation failed");
      }
    } catch (err: any) {
      console.warn("API Submission Error:", err);
      if (isOffline || !navigator.onLine) {
        // Safe offline queue fallback
        const offlineId = `INC-${Date.now().toString().slice(-4)}`;
        const offlineRecord: IncidentRecord = {
          id: offlineId,
          type:
            incidentType === "obstruction"
              ? "Landslide"
              : incidentType === "flooding"
              ? "Flood"
              : incidentType === "accident"
              ? "Accident"
              : "Road Damage",
          severity:
            severity === "critical"
              ? "Critical"
              : severity === "high"
              ? "High"
              : severity === "low"
              ? "Low"
              : "Medium",
          x: 38,
          y: 45,
          location: locationName.trim() || "Offline Captured Corridor",
          coordinates: `${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E`,
          description: description.trim() || "Captured locally in offline mode.",
          reportedBy: "Field Mobile Unit (Offline)",
          reportedAt: "Just now (Queued)",
          status: "Under Verification",
          affectedRoute: "NER Transport Corridor",
          affectedVehicles: [],
          estimatedDelay: severity === "critical" ? "+60 min" : "+30 min",
          disruptionProbability: severity === "critical" ? 80 : 50,
          confidence: 85,
          photo: photoPreview || undefined,
        };
        onCreated(offlineRecord, "Saved locally (Offline Mode) — Queued for sync when online.");
        close();
      } else {
        setErrorMessage(err.message || "Failed to submit report. Please retry.");
      }
    } finally {
      setIsSubmitting(false);
      setSubmitStep("idle");
    }
  };

  return (
    <div className="modal-backdrop" onClick={close}>
      <div className="compare-modal incident-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={close} aria-label="Close modal">
          <X size={19} />
        </button>
        <span className="eyebrow red">FIELD REPORTING · DIRECT SUPABASE FLOW</span>
        <h2>Report Road Incident</h2>
        <p className="modal-subtitle">
          Submit verified field intelligence with location, severity and photo evidence directly to
          operations.
        </p>

        {errorMessage && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#991b1b",
              borderRadius: "6px",
              padding: "8px 12px",
              fontSize: "11px",
              marginBottom: "12px",
            }}
          >
            <strong>Submission Notice:</strong> {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="incident-form">
          <label>
            Incident Type
            <select
              value={incidentType}
              onChange={(e) => setIncidentType(e.target.value as IncidentType)}
            >
              <option value="obstruction">Landslide / Road Obstruction</option>
              <option value="road_damage">Road Surface Damage</option>
              <option value="flooding">Flood / Waterlogging</option>
              <option value="accident">Vehicle Accident / Collision</option>
              <option value="pothole">Severe Pothole / Crater</option>
              <option value="other">Other Transport Hazard</option>
            </select>
          </label>

          <label>
            Severity Level
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as SeverityLevel)}
            >
              <option value="critical">Critical (Immediate Route Blockage)</option>
              <option value="high">High (Major Delays / Caution)</option>
              <option value="medium">Medium (Passable with Care)</option>
              <option value="low">Low (Minor Surface Irregularity)</option>
            </select>
          </label>

          <label className="wide">
            Location Name / Landmark
            <input
              type="text"
              placeholder="e.g. Near Bhalukpong, NH-13 Km 42"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              required
            />
          </label>

          <label>
            GPS Coordinates
            <button
              type="button"
              className="location-input"
              onClick={handleCaptureGps}
              disabled={isLocating}
            >
              {isLocating ? <Loader2 size={14} className="animate-spin" /> : <MapPin size={14} />}
              {isLocating ? "Acquiring GPS..." : "Acquire Current GPS"}
            </button>
            <small className="geo-confirmation">
              <MapPin size={12} /> {geoStatus}
            </small>
          </label>

          <label>
            Report Timestamp
            <input
              type="text"
              value={new Date().toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
              readOnly
            />
          </label>

          <label className="wide">
            Incident Description & Road Impact
            <textarea
              placeholder="Describe the condition, passability, lane availability..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </label>

          {/* Photo Evidence Section */}
          <div className="photo-evidence wide">
            <div className="photo-evidence-head">
              <strong className="flex items-center gap-1">
                <Camera size={13} className="text-teal-600" /> Photo Evidence (Supabase Storage)
              </strong>
              <small>JPG, PNG, WEBP · Max 5 MB</small>
            </div>

            {photoError && (
              <span style={{ color: "#b91c1c", fontSize: "10px", marginTop: "2px" }}>
                {photoError}
              </span>
            )}

            {!photoPreview ? (
              <label className="upload-box">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handlePhotoSelect}
                />
                <Upload size={20} className="text-teal-600" />
                <strong>Select or Drag Photo Evidence</strong>
                <small>Image will be uploaded to Supabase Storage and linked to report</small>
              </label>
            ) : (
              <div className="photo-previews" style={{ gridTemplateColumns: "1fr" }}>
                <div
                  className="photo-preview"
                  style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px" }}
                >
                  <img
                    src={photoPreview}
                    alt="Evidence Preview"
                    style={{ width: "70px", height: "55px", borderRadius: "6px", objectFit: "cover" }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span
                      style={{ fontWeight: 600, fontSize: "11px", color: "#1e293b" }}
                      title={photoFile?.name}
                    >
                      {photoFile?.name}
                    </span>
                    <small style={{ color: "#64748b", display: "block", fontSize: "10px" }}>
                      {photoFile ? `${(photoFile.size / 1024).toFixed(1)} KB` : ""} · Ready for Storage
                    </small>
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      style={{ color: "#b91c1c", fontSize: "11px", textDecoration: "underline", marginTop: "2px" }}
                    >
                      Remove photo
                    </button>
                  </div>
                  <span
                    style={{
                      fontSize: "10px",
                      background: "#e8f7f6",
                      color: "#247c79",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      fontWeight: 600,
                    }}
                  >
                    Evidence Attached
                  </span>
                </div>
              </div>
            )}
          </div>

          <label className="check-row wide">
            <input
              type="checkbox"
              checked={isBlocking}
              onChange={(e) => setIsBlocking(e.target.checked)}
            />
            Mark as actively obstructing transport corridor
          </label>

          <div className="reporter-line wide">
            <span>Reporter</span>
            <b>Logistics Field Operator · Mobile Operations</b>
          </div>

          <div className="modal-footer wide">
            <p>Report will be verified and displayed immediately on the operations dashboard.</p>
            <button type="submit" className="primary-button" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 size={15} className="animate-spin mr-1" />
                  {submitStep === "uploading"
                    ? "Uploading Photo to Supabase..."
                    : "Saving Incident..."}
                </>
              ) : (
                <>
                  Submit Incident <ChevronRight size={15} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Details({
  incident,
  close,
  onUpdateStatus,
}: {
  incident: IncidentRecord;
  close: () => void;
  onUpdateStatus: (s: IncidentRecord["status"]) => void;
}) {
  const Icon = iconFor(incident.type);

  return (
    <div className="drawer-overlay" onClick={close}>
      <aside className="incident-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <div>
            <span className="eyebrow red">INCIDENT DETAILS</span>
            <h2>{incident.id}</h2>
            <p>
              {incident.type} · {incident.location}
            </p>
          </div>
          <button className="icon-button" onClick={close} aria-label="Close drawer">
            <X size={19} />
          </button>
        </div>

        <div className="incident-drawer-status">
          <span className={`incident-severity ${sevColor(incident.severity)}`}>
            <Icon size={14} />
            {incident.severity} Severity
          </span>
          <span className="status-pill bg-amber-50 text-amber-700">{incident.status}</span>
        </div>

        <div className="mini-location">
          <MapPin size={14} />
          <span>{incident.coordinates}</span>
          <div className="mini-map">
            <div className="mini-road" />
            <i />
          </div>
        </div>

        {/* Verified Photo Evidence Section */}
        {incident.photo && (
          <div style={{ margin: "14px 0" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "6px",
              }}
            >
              <strong
                style={{
                  fontSize: "11px",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  color: "#334155",
                }}
              >
                <Camera size={13} className="text-teal-600" /> Attached Photo Evidence
              </strong>
              <span
                style={{
                  fontSize: "9px",
                  padding: "2px 6px",
                  background: "#e8f7f6",
                  color: "#247c79",
                  borderRadius: "4px",
                  fontWeight: 600,
                  border: "1px solid #b8dfdc",
                }}
              >
                Verified Storage
              </span>
            </div>
            <div
              style={{
                borderRadius: "8px",
                overflow: "hidden",
                border: "1px solid #e2e8f0",
                background: "#0f172a",
              }}
            >
              <img
                src={
                  incident.photo.startsWith("http")
                    ? incident.photo
                    : `https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80`
                }
                alt="Incident Evidence"
                style={{ width: "100%", maxHeight: "200px", objectFit: "cover", display: "block" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80";
                }}
              />
            </div>
          </div>
        )}

        <div className="incident-detail-grid">
          <span>
            Source<b>{incident.reportedBy === "Mobile Field Unit" ? "Driver Report" : incident.reportedBy}</b>
          </span>
          <span>
            Hazard Sharing<b style={{ color: "#2563eb" }}>Shared with relevant vehicles</b>
          </span>
          <span>
            Reported time<b>{incident.reportedAt}</b>
          </span>
          <span>
            Affected corridor<b>{incident.affectedRoute}</b>
          </span>
          <span>
            Estimated delay<b>{incident.estimatedDelay}</b>
          </span>
          <span>
            Disruption impact<b>{incident.disruptionProbability}% probability</b>
          </span>
        </div>

        <p className="incident-description" style={{ marginTop: "12px", lineHeight: "1.5" }}>
          {incident.description}
        </p>

        {/* Community Trust Score */}
        {(() => {
          const hasPhoto = !!incident.photo;
          const corroborating = incident.severity === "Critical" ? 3 : incident.severity === "High" ? 2 : 1;
          const trustScore = hasPhoto && corroborating >= 2 ? 86 : corroborating >= 2 ? 72 : hasPhoto ? 58 : 42;
          const confidence = trustScore >= 80 ? "High" : trustScore >= 60 ? "Medium" : "Low";
          const confidenceColor = confidence === "High" ? "#15803d" : confidence === "Medium" ? "#b45309" : "#64748b";
          const confidenceBg = confidence === "High" ? "#f0fdf4" : confidence === "Medium" ? "#fffbeb" : "#f8fafc";

          return (
            <div
              style={{
                marginTop: "16px",
                background: confidenceBg,
                border: `1px solid ${confidenceColor}40`,
                borderRadius: "10px",
                padding: "14px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                <div>
                  <div style={{ fontSize: "10px", color: "#475569", fontWeight: 700, marginBottom: "2px" }}>
                    COMMUNITY TRUST SCORE
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                    <span style={{ fontSize: "26px", fontWeight: 900, color: confidenceColor }}>{trustScore}</span>
                    <span style={{ fontSize: "14px", color: "#94a3b8" }}>/100</span>
                    <span
                      style={{
                        fontSize: "9px",
                        fontWeight: 700,
                        background: confidenceColor,
                        color: "#fff",
                        padding: "2px 8px",
                        borderRadius: "10px",
                        marginLeft: "6px",
                      }}
                    >
                      {confidence.toUpperCase()} CONFIDENCE
                    </span>
                  </div>
                </div>
                <ShieldCheck size={24} style={{ color: confidenceColor, opacity: 0.7 }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginBottom: "10px" }}>
                {[
                  ["Reported By", incident.reportedBy === "Mobile Field Unit" ? "Driver Report" : incident.reportedBy],
                  ["Photo Evidence", hasPhoto ? "Verified in Storage" : "Not Available"],
                  ["Corroborating Reports", `${corroborating} nearby ${corroborating === 1 ? "report" : "reports"}`],
                  ["Verification Status", incident.status],
                ].map(([l, v]) => (
                  <div key={l} style={{ fontSize: "10px" }}>
                    <span style={{ color: "#94a3b8", display: "block" }}>{l}</span>
                    <strong style={{ color: "#334155" }}>{v}</strong>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: "11px", color: "#475569", lineHeight: "1.5", background: "rgba(255,255,255,0.6)", borderRadius: "6px", padding: "8px 10px" }}>
                <ShieldCheck size={12} style={{ display: "inline", marginRight: "4px", color: confidenceColor }} />
                {trustScore >= 80
                  ? `Confidence score (${trustScore}/100) elevated — ${corroborating} independent nearby drivers reported matching hazard${hasPhoto ? " and photo evidence was uploaded" : ""}.`
                  : trustScore >= 60
                  ? `Moderate confidence (${trustScore}/100) — ${corroborating} corroborating ${corroborating === 1 ? "report" : "reports"}${hasPhoto ? " with photo evidence" : " but no photo evidence"}.`
                  : `Low confidence (${trustScore}/100) — single report with no corroborating evidence. Awaiting verification.`}
              </div>
            </div>
          );
        })()}

        {/* Operational Verification Workflow */}
        <div className="verification" style={{ marginTop: "16px" }}>
          <strong>Operational Workflow Status</strong>
          <div>
            <span className="done">Reported</span>
            <span className={incident.status !== "Under Verification" ? "done" : "current"}>
              Under Verification
            </span>
            <span className={incident.status === "Verified" || incident.status === "Resolved" ? "done" : ""}>
              Verified
            </span>
            <span className={incident.status === "Resolved" ? "done" : ""}>Resolved</span>
          </div>
        </div>

        <div className="drawer-actions" style={{ marginTop: "16px" }}>
          <button className="primary-button" onClick={() => onUpdateStatus("Verified")}>
            Verify Incident
          </button>
          <button className="outline-button" onClick={() => onUpdateStatus("Resolved")}>
            Mark Resolved
          </button>
          <button className="outline-button" onClick={() => onUpdateStatus("Rejected")}>
            Reject Report
          </button>
        </div>
      </aside>
    </div>
  );
}

export default function Incidents() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [region, setRegion] = useState(regions[0]);
  const [dark, setDark] = useState(false);

  // Filters & Data
  const [filter, setFilter] = useState("All");
  const [type, setType] = useState("All Types");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<IncidentRecord | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Incidents state initialized with seed data
  const [records, setRecords] = useState<IncidentRecord[]>(seedIncidents);

  // Fetch real incidents from Supabase backend on mount
  const fetchIncidents = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/incidents");
      if (res.ok) {
        const data: GetIncidentsResponse = await res.json();
        if (data.success && Array.isArray(data.incidents) && data.incidents.length > 0) {
          const apiRecords = data.incidents.map(mapApiIncidentToRecord);
          // Combine API records with seed incidents, avoiding duplicate IDs
          const apiIds = new Set(apiRecords.map((r) => r.id));
          const nonDuplicateSeed = seedIncidents.filter((s) => !apiIds.has(s.id));
          setRecords([...apiRecords, ...nonDuplicateSeed]);
        }
      }
    } catch (err) {
      console.warn("Could not fetch incidents from backend, using seed data:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleIncidentCreated = (newIncident: IncidentRecord, message: string) => {
    setRecords((prev) => [newIncident, ...prev]);
    setSelected(newIncident);
    setToastMessage(message);
  };

  const handleUpdateStatus = (newStatus: IncidentRecord["status"]) => {
    if (!selected) return;
    const updated = { ...selected, status: newStatus };
    setRecords((prev) => prev.map((r) => (r.id === selected.id ? updated : r)));
    setSelected(updated);
    setToastMessage(`Incident status updated to "${newStatus}"`);
  };

  const filtered = useMemo(() => {
    return records.filter((i) => {
      const matchesFilter =
        filter === "All" ||
        i.status === filter ||
        (filter === "Critical" && i.severity === "Critical") ||
        (filter === "Active" && (i.status === "Active" || i.status === "Verified"));
      const matchesType = type === "All Types" || i.type === type;
      const matchesSearch =
        !search ||
        `${i.id} ${i.location} ${i.type} ${i.reportedBy}`
          .toLowerCase()
          .includes(search.toLowerCase());
      return matchesFilter && matchesType && matchesSearch;
    });
  }, [records, filter, type, search]);

  return (
    <div className={dark ? "app-shell dark-mode" : "app-shell"}>
      <Sidebar {...{ collapsed, setCollapsed, mobileOpen, setMobileOpen }} />
      <main className="main-shell">
        <Header
          {...{
            region,
            setRegion,
            dark,
            setDark,
            setMobileOpen,
            onRefresh: fetchIncidents,
            isRefreshing,
          }}
        />

        <div className="dashboard incidents-dashboard">
          {/* Intro Section */}
          <div className="dashboard-intro">
            <div>
              <span className="eyebrow blue">FIELD OPERATIONS · LIVE DISRUPTIONS</span>
              <h2>Field Incident Reporting</h2>
              <p>
                Report road disruptions, landslides and structural damage with GPS coordinates and
                verified photo evidence.
              </p>
            </div>
            <div className="incident-head-actions">
              <button
                className="outline-button"
                onClick={fetchIncidents}
                disabled={isRefreshing}
                title="Sync with database"
              >
                <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} /> Refresh
              </button>
              <button className="primary-button" onClick={() => setReportModalOpen(true)}>
                <AlertTriangle size={14} /> Report Incident
              </button>
            </div>
          </div>

          {/* 1. Essential Incident Stats / KPI Summary */}
          <Kpis records={records} />

          {/* 2. Interactive Incident Map */}
          <IncidentMap records={records} onSelect={setSelected} />

          {/* 3. Recent / Active Incidents List (Main Focus) */}
          <section className="panel incidents-list">
            <div className="panel-header">
              <div>
                <h2>Recent & Active Incidents</h2>
                <p>
                  Showing {filtered.length} verified and pending incidents across the region
                </p>
              </div>
              <div className="incident-filters">
                <label className="search-box">
                  <Search size={15} />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search ID, location, corridor or type..."
                  />
                </label>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  <option>All Types</option>
                  {[
                    "Road Damage",
                    "Landslide",
                    "Flood",
                    "Accident",
                    "Road Blockage",
                    "Bridge Damage",
                    "Traffic",
                  ].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="filter-chips incident-chips">
              {["All", "Active", "Critical", "Under Verification", "Resolved"].map((x) => (
                <button
                  key={x}
                  className={filter === x ? "active" : ""}
                  onClick={() => setFilter(x)}
                >
                  {x}
                </button>
              ))}
            </div>

            <div className="table-wrap">
              <table className="incident-table">
                <thead>
                  <tr>
                    <th>Incident ID</th>
                    <th>Type</th>
                    <th>Location</th>
                    <th>Severity</th>
                    <th>Photo Evidence</th>
                    <th>Reported By</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                        No incidents match the selected filter.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((i) => {
                      const Icon = iconFor(i.type);
                      return (
                        <tr
                          key={i.id}
                          onClick={() => setSelected(i)}
                          style={{ cursor: "pointer" }}
                          className={selected?.id === i.id ? "bg-teal-50/40" : ""}
                        >
                          <td>
                            <strong className="text-teal-700 dark:text-teal-400">{i.id}</strong>
                          </td>
                          <td>
                            <span className="flex items-center gap-1.5 font-medium">
                              <Icon size={14} className="text-slate-500" />
                              {i.type}
                            </span>
                          </td>
                          <td>{i.location}</td>
                          <td>
                            <span className={`incident-severity ${sevColor(i.severity)}`}>
                              {i.severity}
                            </span>
                          </td>
                          <td>
                            {i.photo ? (
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  fontSize: "11px",
                                  color: "#0f766e",
                                  background: "#f0fdfa",
                                  border: "1px solid #ccfbf1",
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  fontWeight: 600,
                                }}
                                title="Photo evidence stored in Supabase"
                              >
                                <Camera size={12} />
                                Photo
                              </span>
                            ) : (
                              <span style={{ fontSize: "11px", color: "#94a3b8" }}>No photo</span>
                            )}
                          </td>
                          <td>{i.reportedBy}</td>
                          <td>{i.reportedAt}</td>
                          <td>
                            <span
                              className={`status-pill ${
                                i.status === "Resolved"
                                  ? "bg-green-50 text-green-700"
                                  : i.status === "Verified" || i.status === "Active"
                                  ? "bg-blue-50 text-blue-700"
                                  : "bg-amber-50 text-amber-700"
                              }`}
                            >
                              {i.status}
                            </span>
                          </td>
                          <td>
                            <button
                              className="view-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelected(i);
                              }}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* 4. Streamlined Recent Field Submissions Feed */}
          <section className="panel field-reports" style={{ marginTop: "20px" }}>
            <div className="panel-header">
              <div>
                <h2>Recent Field Submissions</h2>
                <p>Latest incident submissions verified by mobile operators</p>
              </div>
              <span className="status-pill bg-blue-50 text-blue-700">Live Field Stream</span>
            </div>
            <div style={{ display: "grid", gap: "10px", padding: "16px" }}>
              {fieldReports.map((r) => (
                <div
                  className="field-report"
                  key={r.location}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    background: "#f8fafc",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span className="field-photo" style={{ padding: "8px", background: "#e2e8f0", borderRadius: "6px" }}>
                      <Camera size={16} className="text-teal-700" />
                    </span>
                    <span>
                      <strong style={{ fontSize: "12px", color: "#1e293b", display: "block" }}>
                        {r.type} · {r.location}
                      </strong>
                      <small style={{ color: "#64748b", fontSize: "11px" }}>
                        {r.reporter} · {r.time} · {r.photo}
                      </small>
                    </span>
                  </div>
                  <span className="status-pill bg-amber-50 text-amber-700">{r.status}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Report Modal with Direct Photo Upload & Supabase Integration */}
      {reportModalOpen && (
        <ReportModal
          close={() => setReportModalOpen(false)}
          onCreated={handleIncidentCreated}
        />
      )}

      {/* Details Drawer */}
      {selected && (
        <Details
          incident={selected}
          close={() => setSelected(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {/* Success Toast */}
      {toastMessage && (
        <div className="toast-success" style={{ zIndex: 1000 }}>
          <CheckCircle2 size={16} className="text-emerald-500" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage("")} aria-label="Dismiss toast">
            <X size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
