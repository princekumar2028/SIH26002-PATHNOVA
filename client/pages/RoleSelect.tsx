import { useNavigate } from "react-router-dom";
import PathnovaLogo from "@/components/PathnovaLogo";
import { BarChart3, Truck } from "lucide-react";

export default function RoleSelect() {
  const navigate = useNavigate();

  return (
    <div className="role-select-root">
      {/* Background gradient layer */}
      <div className="role-select-bg" aria-hidden="true" />

      <div className="role-select-content">
        {/* Brand */}
        <div className="role-select-brand">
          <div className="role-select-logo">
            <PathnovaLogo />
          </div>
          <div className="role-select-wordmark">
            <span className="path-wordmark">PATH</span>
            <span className="nova-wordmark">NOVA</span>
          </div>
          <p className="role-select-tagline">
            AI-powered logistics &amp; route intelligence — North Eastern India
          </p>
        </div>

        {/* Heading */}
        <h1 className="role-select-heading">How are you using PATHNOVA?</h1>

        {/* Role Cards */}
        <div className="role-cards">
          {/* Operations Portal */}
          <button
            id="role-operations"
            className="role-card role-card--ops"
            onClick={() => navigate("/dashboard")}
          >
            <div className="role-card-icon">
              <BarChart3 size={40} strokeWidth={1.5} />
            </div>
            <div className="role-card-body">
              <strong className="role-card-title">Operations Portal</strong>
              <span className="role-card-desc">
                For authorities &amp; logistics managers
              </span>
              <ul className="role-card-features">
                <li>Live map &amp; fleet monitoring</li>
                <li>Risk intelligence &amp; alerts</li>
                <li>Incident management</li>
                <li>Weather &amp; hazard advisories</li>
              </ul>
            </div>
            <div className="role-card-cta">Enter Portal →</div>
          </button>

          {/* Driver Portal */}
          <button
            id="role-driver"
            className="role-card role-card--driver"
            onClick={() => navigate("/driver")}
          >
            <div className="role-card-icon">
              <Truck size={40} strokeWidth={1.5} />
            </div>
            <div className="role-card-body">
              <strong className="role-card-title">Driver Portal</strong>
              <span className="role-card-desc">
                For drivers &amp; field operations
              </span>
              <ul className="role-card-features">
                <li>My route &amp; ETA</li>
                <li>Road ahead conditions</li>
                <li>Live weather</li>
                <li>Report a road problem</li>
              </ul>
            </div>
            <div className="role-card-cta">Enter Portal →</div>
          </button>
        </div>

        {/* Footer note */}
        <p className="role-select-footer">
          PATHNOVA v1.0 &nbsp;·&nbsp; North Eastern Region
        </p>
      </div>
    </div>
  );
}
