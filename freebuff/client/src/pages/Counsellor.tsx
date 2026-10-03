import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Users,
  Moon,
  Zap,
  Calendar,
  Sparkles,
  RefreshCw,
  Lock
} from "lucide-react";
import { api } from "../lib/api";

interface CounsellorData {
  aggregated: boolean;
  activeStudentCount: number;
  minRequired: number;
  privacyRule: string;
  message?: string;
  metrics?: {
    avgSleepHours: number;
    avgStressLevel: number;
    avgMoodScore: number;
    upcomingExams: number;
  };
  riskDistribution?: {
    lowPct: number;
    mediumPct: number;
    highPct: number;
  };
  supportInsights?: string[];
}

export default function Counsellor() {
  const [data, setData] = useState<CounsellorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get<CounsellorData>("/api/counsellor/overview");
      setData(res.data);
    } catch (err: any) {
      console.warn("Counsellor load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSeed = async () => {
    setActionMsg("Seeding demo cohort (12 students)...");
    try {
      await api.post("/api/demo/seed");
      setActionMsg("✓ 12 demo students seeded! Cohort now satisfies K ≥ 10 threshold.");
      await loadData();
      setTimeout(() => setActionMsg(""), 4000);
    } catch (err: any) {
      setActionMsg("Failed to seed demo cohort: " + err.message);
    }
  };

  const handleReset = async () => {
    setActionMsg("Resetting demo cohort...");
    try {
      await api.post("/api/demo/reset");
      setActionMsg("✓ Demo cohort cleared. Clean privacy state restored.");
      await loadData();
      setTimeout(() => setActionMsg(""), 4000);
    } catch (err: any) {
      setActionMsg("Failed to reset: " + err.message);
    }
  };

  return (
    <div style={{ maxWidth: "880px", margin: "0 auto", padding: "32px 16px" }}>
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <span className="micro-label" style={{ color: "var(--sage)" }}>INSTITUTIONAL WELLBEING</span>
          <span style={{ color: "var(--subtle)" }}>•</span>
          <span style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 500 }}>Counsellor & Mentor View</span>
        </div>
        <h1 className="serif-display" style={{ fontSize: "36px", marginBottom: "8px", color: "var(--ink)" }}>
          Cohort Wellbeing Overview
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "15px", maxWidth: "620px" }}>
          Macro-level wellbeing rhythms designed to help student mentors and counsellors spot systemic academic burnout early—strictly with zero individual surveillance.
        </p>
      </div>

      {/* Action toast */}
      {actionMsg && (
        <div style={{ padding: "12px 16px", background: "var(--sage-light)", border: "1px solid var(--sage-border)", borderRadius: "8px", color: "var(--sage-hover)", fontSize: "14px", fontWeight: 600, marginBottom: "20px" }}>
          {actionMsg}
        </div>
      )}

      {/* K >= 10 Privacy Guarantee Banner */}
      <div className="card" style={{ padding: "20px 24px", marginBottom: "28px", borderLeft: "4px solid var(--sage)", background: "var(--surface)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
          <ShieldCheck size={22} style={{ color: "var(--sage)", flexShrink: 0, marginTop: "2px" }} />
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
              <strong style={{ fontSize: "15px", color: "var(--ink)" }}>K ≥ 10 Aggregation Guarantee Enforced</strong>
              <span style={{ fontSize: "12px", color: "var(--sage)", background: "var(--sage-light)", padding: "3px 10px", borderRadius: "12px", fontWeight: 600 }}>
                Active Protection
              </span>
            </div>
            <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "4px", lineHeight: 1.5 }}>
              Under Freebuff's privacy charter, no staff member, mentor, or peer can ever see individual check-ins, scores, or timestamps. Data is only displayed in aggregate cohorts of 10 or more students to ensure absolute anonymity.
            </p>
          </div>
        </div>
      </div>

      {/* Conditional: Aggregated vs Locked */}
      {loading ? (
        <div className="card" style={{ padding: "40px", textAlign: "center", color: "var(--muted)" }}>
          Loading cohort insights…
        </div>
      ) : !data?.aggregated ? (
        /* BELOW 10 STUDENTS: Privacy Locked State */
        <div className="card" style={{ padding: "40px 32px", textAlign: "center", background: "#FFFFFF", border: "1px dashed var(--border)" }}>
          <div style={{ width: "54px", height: "54px", borderRadius: "50%", background: "#FEF3C7", color: "#D97706", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Lock size={26} />
          </div>
          <h2 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "8px", color: "var(--ink)" }}>
            Cohort Insights Protected (K &lt; 10)
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "14px", maxWidth: "520px", margin: "0 auto 20px", lineHeight: 1.6 }}>
            Currently, only <strong>{data?.activeStudentCount || 0} student(s)</strong> have checked in. To prevent individual deanonymization, aggregated trends unlock automatically when <strong>{data?.minRequired || 10} or more students</strong> participate.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSeed}
              style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
            >
              <Sparkles size={16} /> Seed Demo Cohort (12 Students)
            </button>
            <Link to="/checkin" className="btn btn-outline">
              Log My Check-in →
            </Link>
          </div>
        </div>
      ) : (
        /* 10+ STUDENTS: Aggregated Macro Dashboard */
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* 4 Metric Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
            <div className="card" style={{ padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <span className="micro-label">ACTIVE STUDENTS</span>
                <Users size={16} style={{ color: "var(--sage)" }} />
              </div>
              <div style={{ fontSize: "32px", fontWeight: 600, color: "var(--ink)", fontFamily: "var(--font-serif)" }}>
                {data.activeStudentCount}
              </div>
              <span style={{ fontSize: "12px", color: "var(--low)", fontWeight: 500 }}>✓ K ≥ 10 Compliant</span>
            </div>

            <div className="card" style={{ padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <span className="micro-label">AVG SLEEP</span>
                <Moon size={16} style={{ color: "#3B82F6" }} />
              </div>
              <div style={{ fontSize: "32px", fontWeight: 600, color: "var(--ink)", fontFamily: "var(--font-serif)" }}>
                {data.metrics?.avgSleepHours}h
              </div>
              <span style={{ fontSize: "12px", color: "var(--muted)" }}>Cohort 7-day average</span>
            </div>

            <div className="card" style={{ padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <span className="micro-label">AVG STRESS</span>
                <Zap size={16} style={{ color: "#D97706" }} />
              </div>
              <div style={{ fontSize: "32px", fontWeight: 600, color: "var(--ink)", fontFamily: "var(--font-serif)" }}>
                {data.metrics?.avgStressLevel} / 5
              </div>
              <span style={{ fontSize: "12px", color: "var(--muted)" }}>Moderate exam load</span>
            </div>

            <div className="card" style={{ padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <span className="micro-label">EXAM LOAD</span>
                <Calendar size={16} style={{ color: "#8B5CF6" }} />
              </div>
              <div style={{ fontSize: "32px", fontWeight: 600, color: "var(--ink)", fontFamily: "var(--font-serif)" }}>
                {data.metrics?.upcomingExams}
              </div>
              <span style={{ fontSize: "12px", color: "var(--muted)" }}>Upcoming this fortnight</span>
            </div>
          </div>

          {/* Risk Distribution Breakdown */}
          <div className="card" style={{ padding: "24px" }}>
            <span className="micro-label">COHORT RISK DISTRIBUTION</span>
            <h2 style={{ fontSize: "18px", fontWeight: 600, margin: "6px 0 16px", color: "var(--ink)" }}>
              Current Wellbeing Bands Across Cohort
            </h2>

            <div style={{ display: "flex", height: "16px", borderRadius: "8px", overflow: "hidden", marginBottom: "16px" }}>
              <div style={{ width: `${data.riskDistribution?.lowPct}%`, background: "var(--low)" }} title={`Low Risk: ${data.riskDistribution?.lowPct}%`} />
              <div style={{ width: `${data.riskDistribution?.mediumPct}%`, background: "var(--medium)" }} title={`Medium Risk: ${data.riskDistribution?.mediumPct}%`} />
              <div style={{ width: `${data.riskDistribution?.highPct}%`, background: "var(--high)" }} title={`High Risk: ${data.riskDistribution?.highPct}%`} />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", fontSize: "13px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--low)" }} />
                <span>Low Risk (0–29): <strong>{data.riskDistribution?.lowPct}%</strong></span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--medium)" }} />
                <span>Medium (30–59): <strong>{data.riskDistribution?.mediumPct}%</strong></span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--high)" }} />
                <span>High (60+): <strong>{data.riskDistribution?.highPct}%</strong></span>
              </div>
            </div>
          </div>

          {/* Counsellor Guidance & Observations */}
          <div className="card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <Sparkles size={18} style={{ color: "var(--sage)" }} />
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--ink)" }}>Institutional Action Items</h3>
            </div>
            <ul style={{ display: "flex", flexDirection: "column", gap: "10px", listStyle: "none" }}>
              {(data.supportInsights || []).map((ins, idx) => (
                <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "14px", color: "var(--ink)" }}>
                  <span style={{ color: "var(--sage)", fontWeight: 700 }}>•</span>
                  <span>{ins}</span>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
              <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                Demonstration tools for hackathon evaluators:
              </span>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleSeed}
                  style={{ fontSize: "12px", padding: "6px 12px" }}
                >
                  <RefreshCw size={13} style={{ marginRight: "4px" }} /> Re-seed Cohort
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={handleReset}
                  style={{ fontSize: "12px", color: "var(--high)", padding: "6px 12px" }}
                >
                  Clear Demo Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
