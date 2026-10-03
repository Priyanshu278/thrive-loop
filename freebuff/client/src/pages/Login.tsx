import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { saveCurrentUser } from "../lib/api";

interface LoginProps {
  onLoginSuccess?: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("alex@university.edu");
  const [password, setPassword] = useState("student123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please provide your university email and password.");
      return;
    }

    setLoading(true);
    try {
      // Simulate/execute auth
      localStorage.setItem("freebuff_token", "sample-student-jwt-token");
      await saveCurrentUser({
        id: "u-alex",
        name: "Alex",
        email,
        onboardingComplete: true,
      });
      setTimeout(() => {
        setLoading(false);
        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          navigate("/");
        }
      }, 400);
    } catch (err: any) {
      setError(err.message || "Unable to sign in. Please verify your details.");
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      {/* Left: Authentic Student Life Photography */}
      <div className="login-photo-side">
        <img
          src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80"
          alt="Student studying in quiet sunlit library"
          className="login-hero-img"
        />
        <div className="login-photo-overlay">
          <p className="login-photo-quote">
            “A quieter way to notice when you're running low.”
          </p>
          <span className="login-photo-caption">
            Student wellbeing · Early support · Private by design
          </span>
        </div>
      </div>

      {/* Right: Editorial Login Experience */}
      <div className="login-form-side">
        <div style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <div className="brand-dot" />
            <span style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "0.08em", color: "#4D7C6F" }}>
              FREEBUFF
            </span>
          </div>

          <h1 className="login-heading">Welcome back.</h1>
          <p className="login-subhead">A little space for yourself.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div>
            <label className="micro-label" style={{ display: "block", marginBottom: "6px" }}>
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@university.edu"
              required
              className="form-input"
            />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <label className="micro-label">PASSWORD</label>
              <button
                type="button"
                style={{ fontSize: "12px", color: "#78716C" }}
                onClick={() => alert("Password reset instructions sent to your email.")}
              >
                Forgot password?
              </button>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="form-input"
            />
          </div>

          {error && (
            <div style={{ backgroundColor: "#FFE4E6", color: "#E11D48", padding: "10px 14px", borderRadius: "8px", fontSize: "13px" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-full"
            style={{ height: "46px", fontSize: "15px", marginTop: "8px" }}
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign in →"}
          </button>
        </form>

        <div className="login-privacy-note">
          <ShieldCheck size={16} style={{ color: "#4D7C6F" }} />
          <span>Private by design. Your check-ins stay entirely yours.</span>
        </div>
      </div>
    </div>
  );
}
