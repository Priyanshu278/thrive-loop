import { useEffect, useState } from "react";
import { Outlet, NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  CheckCircle,
  Activity,
  Users,
  Calendar as CalendarIcon,
  LogOut,
} from "lucide-react";
import { getCurrentUser } from "./lib/api";
import type { User } from "./types";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("freebuff_token");
    localStorage.removeItem("freebuff_user");
    navigate("/login");
  };

  // If on login or onboarding page, render full screen without the app header/footer
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/onboarding";

  if (isAuthPage) {
    return <Outlet />;
  }

  return (
    <div className="app-shell">
      {/* Editorial Desktop Header */}
      <header className="app-header">
        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          <Link to="/" className="app-brand">
            <span className="brand-dot" />
            <span className="brand-name">Freebuff</span>
          </Link>

          <nav className="app-nav" aria-label="Primary navigation">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
              end
            >
              Today
            </NavLink>
            <NavLink
              to="/checkin"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              Daily Check-in
            </NavLink>
            <NavLink
              to="/signal"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              Signal
            </NavLink>
            <NavLink
              to="/circle"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              Care Circle
            </NavLink>
            <NavLink
              to="/nudges"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              Nudges
            </NavLink>
            <NavLink
              to="/calendar"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              Calendar
            </NavLink>
            <NavLink
              to="/privacy"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              Privacy
            </NavLink>
            <NavLink
              to="/counsellor"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              Counsellor (K≥10)
            </NavLink>
          </nav>
        </div>

        <div className="header-user-slot">
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  color: "var(--ink)",
                  fontWeight: 500,
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: "var(--sage-light)",
                    color: "var(--sage)",
                    display: "grid",
                    placeItems: "center",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {user.name.charAt(0)}
                </div>
                <span>{user.name}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="btn btn-ghost"
                style={{
                  fontSize: 12,
                  padding: "4px 8px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                }}
                title="Sign out"
              >
                <LogOut size={13} />
                <span>Sign out</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="btn btn-primary"
              style={{ fontSize: 13, padding: "6px 14px" }}
            >
              Sign in
            </Link>
          )}
        </div>
      </header>

      {/* Main Page Area */}
      <main className="app-main">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation Bar (< 960px) */}
      <nav className="mobile-bottom-bar" aria-label="Mobile navigation">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `mobile-nav-item ${isActive ? "active" : ""}`
          }
          end
        >
          <Home size={18} />
          <span>Today</span>
        </NavLink>
        <NavLink
          to="/checkin"
          className={({ isActive }) =>
            `mobile-nav-item ${isActive ? "active" : ""}`
          }
        >
          <CheckCircle size={18} />
          <span>Check-in</span>
        </NavLink>
        <NavLink
          to="/signal"
          className={({ isActive }) =>
            `mobile-nav-item ${isActive ? "active" : ""}`
          }
        >
          <Activity size={18} />
          <span>Signal</span>
        </NavLink>
        <NavLink
          to="/circle"
          className={({ isActive }) =>
            `mobile-nav-item ${isActive ? "active" : ""}`
          }
        >
          <Users size={18} />
          <span>Circle</span>
        </NavLink>
        <NavLink
          to="/calendar"
          className={({ isActive }) =>
            `mobile-nav-item ${isActive ? "active" : ""}`
          }
        >
          <CalendarIcon size={18} />
          <span>Calendar</span>
        </NavLink>
      </nav>
    </div>
  );
}
