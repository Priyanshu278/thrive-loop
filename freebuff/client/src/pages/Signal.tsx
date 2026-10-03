import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Sparkles,
  Info,
  Sliders,
  PhoneCall,
  Heart,
  ThumbsUp,
  ThumbsDown,
  AlertCircle
} from "lucide-react";
import { getRiskSignal, getAISupport } from "../lib/api";
import type { RiskSignal, AISupportMessage } from "../types";

export default function Signal() {
  const [signal, setSignal] = useState<RiskSignal | null>(null);
  const [aiSupport, setAiSupport] = useState<AISupportMessage | null>(null);
  const [actionDone, setActionDone] = useState(false);
  const [showSafetyCard, setShowSafetyCard] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<string | null>(null);

  // What-If Simulation State (Step 11)
  const [simSleep, setSimSleep] = useState<number>(6.5);
  const [simFallingTrend, setSimFallingTrend] = useState<boolean>(false);
  const [simStress, setSimStress] = useState<number>(3);
  const [simMood, setSimMood] = useState<number>(3);
  const [simDeadlines, setSimDeadlines] = useState<number>(1);
  const [simExamProximity, setSimExamProximity] = useState<string>("none"); // "none" | "7d" | "3d"

  useEffect(() => {
    getRiskSignal().then((s) => {
      setSignal(s);
      if (s?.score && s.score >= 60) {
        setShowSafetyCard(true);
      }
    });
    getAISupport().then(setAiSupport);
  }, []);

  // Exact PDF Risk Score Calculation for What-If Simulator
  function computeWhatIf() {
    let score = 0;
    const reasons: string[] = [];

    // Sleep
    if (simSleep < 6) {
      score += 30;
      reasons.push("Average sleep < 6h (+30)");
    } else if (simSleep < 7) {
      score += 15;
      reasons.push("Average sleep < 7h (+15)");
    }

    // Falling sleep trend
    if (simFallingTrend) {
      score += 10;
      reasons.push("3-day declining sleep (+10)");
    }

    // Stress
    if (simStress >= 4) {
      score += 25;
      reasons.push("Average stress ≥ 4 (+25)");
    } else if (simStress >= 3) {
      score += 10;
      reasons.push("Average stress ≥ 3 (+10)");
    }

    // Mood
    if (simMood <= 2) {
      score += 20;
      reasons.push("Average mood ≤ 2 (+20)");
    }

    // Deadlines
    if (simDeadlines >= 3) {
      score += 10;
      reasons.push("Deadlines ≥ 3 this week (+10)");
    }

    // Exam proximity
    if (simExamProximity === "3d") {
      score += 15;
      reasons.push("Exam within 3 days (+15)");
    } else if (simExamProximity === "7d") {
      score += 8;
      reasons.push("Exam within 7 days (+8)");
    }

    let level: "low" | "medium" | "high" = "low";
    if (score >= 60) level = "high";
    else if (score >= 30) level = "medium";

    return { score, level, reasons };
  }

  const whatIfResult = computeWhatIf();
  const currentScore = signal?.score || 42;
  const scoreDelta = whatIfResult.score - currentScore;

  return (
    <div className="signal-detail-page" style={{ maxWidth: "780px", margin: "0 auto", padding: "32px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <Link to="/" className="btn btn-ghost" style={{ padding: "6px" }}>
          <ArrowLeft size={18} />
        </Link>
        <span className="micro-label" style={{ color: "var(--sage)" }}>WELLBEING TELEMETRY</span>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <h1 className="serif-display" style={{ fontSize: "36px", marginBottom: "8px" }}>
          Your Current Signal
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "15px" }}>
          Freebuff synthesizes sleep, tempo, and stress into an early, quiet signal to prevent burnout.
        </p>
      </div>

      {/* Main Signal Display */}
      <div className="card" style={{ padding: "32px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <span className="micro-label">CURRENT TELEMETRY</span>
          <div style={{ display: "flex", alignItems: "baseline", gap: "16px", margin: "8px 0" }}>
            <span style={{ fontSize: "56px", fontFamily: "var(--font-serif)", fontWeight: 400, color: "var(--ink)", lineHeight: "1" }}>
              {currentScore}
            </span>
            <span className={`signal-pill level-${signal?.level.toLowerCase() || "medium"}`} style={{ fontSize: "14px", padding: "6px 14px" }}>
              ● {signal?.level || "Medium"}
            </span>
          </div>
          <p style={{ color: "var(--ink)", fontSize: "15px", fontWeight: 500, maxWidth: "420px" }}>
            {signal?.headline || "Workload demand is elevated. Prioritize sleep and micro-breaks."}
          </p>
        </div>

        <div style={{ textAlign: "right", color: "var(--subtle)", fontSize: "12px" }}>
          Updated {signal?.lastUpdated || "today"}
        </div>
      </div>

      {/* CRISIS SAFETY CARD (Step 12: High Risk / Urgent Support) */}
      {(showSafetyCard || whatIfResult.score >= 60) && (
        <div className="card" style={{ padding: "24px", borderLeft: "4px solid var(--high)", background: "#FFF1F2", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <AlertCircle size={22} style={{ color: "var(--high)", flexShrink: 0, marginTop: "2px" }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                <strong style={{ fontSize: "16px", color: "#9F1239" }}>Things Feeling Heavy? We're With You.</strong>
                <span style={{ fontSize: "11px", fontWeight: 700, background: "#FFE4E6", color: "#E11D48", padding: "2px 8px", borderRadius: "10px" }}>
                  SAFETY FIRST
                </span>
              </div>
              <p style={{ fontSize: "13.5px", color: "#881337", margin: "6px 0 14px", lineHeight: 1.5 }}>
                Freebuff signals indicate that your cognitive load or fatigue is currently high. You don't have to carry this alone. Confidential, free student helplines are available 24x7:
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px", marginBottom: "14px" }}>
                <a
                  href="tel:14416"
                  style={{ display: "flex", alignItems: "center", gap: "8px", background: "#FFFFFF", padding: "10px 14px", borderRadius: "8px", border: "1px solid #FECDD3", color: "#9F1239", fontSize: "13px", fontWeight: 600 }}
                >
                  <PhoneCall size={15} /> Tele-MANAS (Govt): 14416
                </a>
                <a
                  href="tel:18005990019"
                  style={{ display: "flex", alignItems: "center", gap: "8px", background: "#FFFFFF", padding: "10px 14px", borderRadius: "8px", border: "1px solid #FECDD3", color: "#9F1239", fontSize: "13px", fontWeight: 600 }}
                >
                  <Heart size={15} /> KIRAN Helpline: 1800-599-0019
                </a>
              </div>

              <div style={{ background: "#FFFFFF", padding: "12px 14px", borderRadius: "8px", fontSize: "12.5px", color: "#4C0519" }}>
                <strong>Quick 3-Minute Grounding:</strong> Inhale for 4 seconds, hold for 7 seconds, exhale slowly for 8 seconds. Repeat 3 times. Put away screens for 15 minutes.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 11: WHAT-IF RISK PROJECTION SIMULATOR */}
      <div className="card" style={{ padding: "28px", marginBottom: "24px", border: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Sliders size={18} style={{ color: "var(--sage)" }} />
            <h2 style={{ fontSize: "18px", fontWeight: 600, color: "var(--ink)" }}>
              What-If Risk Simulator
            </h2>
          </div>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--sage)", background: "var(--sage-light)", padding: "3px 8px", borderRadius: "8px" }}>
            STEP 11 SPECIFICATION
          </span>
        </div>

        <p style={{ color: "var(--muted)", fontSize: "13.5px", marginBottom: "20px" }}>
          Simulate how small habit adjustments change your risk level before the week unfolds.
        </p>

        {/* Sliders Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "24px" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
              <span>Average Sleep</span>
              <strong style={{ color: simSleep < 6 ? "var(--high)" : simSleep < 7 ? "var(--medium)" : "var(--low)" }}>
                {simSleep.toFixed(1)} hours
              </strong>
            </div>
            <input
              type="range"
              min="4"
              max="9"
              step="0.5"
              value={simSleep}
              onChange={(e) => setSimSleep(parseFloat(e.target.value))}
              style={{ width: "100%", accentColor: "var(--sage)" }}
            />
            <span style={{ fontSize: "11px", color: "var(--subtle)" }}>&lt;6h adds +30, &lt;7h adds +15</span>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
              <span>Average Stress</span>
              <strong style={{ color: simStress >= 4 ? "var(--high)" : simStress >= 3 ? "var(--medium)" : "var(--low)" }}>
                {simStress} / 5
              </strong>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={simStress}
              onChange={(e) => setSimStress(parseInt(e.target.value))}
              style={{ width: "100%", accentColor: "var(--sage)" }}
            />
            <span style={{ fontSize: "11px", color: "var(--subtle)" }}>≥4 adds +25, ≥3 adds +10</span>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
              <span>Average Mood</span>
              <strong style={{ color: simMood <= 2 ? "var(--high)" : "var(--low)" }}>
                {simMood} / 5
              </strong>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={simMood}
              onChange={(e) => setSimMood(parseInt(e.target.value))}
              style={{ width: "100%", accentColor: "var(--sage)" }}
            />
            <span style={{ fontSize: "11px", color: "var(--subtle)" }}>≤2 adds +20</span>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
              <span>Deadlines This Week</span>
              <strong style={{ color: simDeadlines >= 3 ? "var(--high)" : "var(--ink)" }}>
                {simDeadlines}
              </strong>
            </div>
            <input
              type="range"
              min="0"
              max="6"
              step="1"
              value={simDeadlines}
              onChange={(e) => setSimDeadlines(parseInt(e.target.value))}
              style={{ width: "100%", accentColor: "var(--sage)" }}
            />
            <span style={{ fontSize: "11px", color: "var(--subtle)" }}>≥3 adds +10</span>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
              Next Exam Proximity
            </label>
            <select
              value={simExamProximity}
              onChange={(e) => setSimExamProximity(e.target.value)}
              style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "13px", background: "#FFFFFF" }}
            >
              <option value="none">No exam within 7 days (+0)</option>
              <option value="7d">Within 7 days (+8)</option>
              <option value="3d">Within 3 days (+15)</option>
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", paddingTop: "20px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={simFallingTrend}
                onChange={(e) => setSimFallingTrend(e.target.checked)}
                style={{ width: "16px", height: "16px", accentColor: "var(--sage)" }}
              />
              <span>3-day falling sleep trend (+10)</span>
            </label>
          </div>
        </div>

        {/* Simulator Output Box */}
        <div style={{ background: "var(--bg)", padding: "18px 20px", borderRadius: "10px", border: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", marginBottom: "10px" }}>
            <div>
              <span className="micro-label">PROJECTED RISK SCORE</span>
              <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginTop: "4px" }}>
                <span style={{ fontSize: "36px", fontWeight: 600, fontFamily: "var(--font-serif)" }}>
                  {whatIfResult.score}
                </span>
                <span className={`signal-pill level-${whatIfResult.level}`}>
                  ● {whatIfResult.level.toUpperCase()}
                </span>
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <span className="micro-label">SCORE DELTA</span>
              <div style={{ fontSize: "18px", fontWeight: 700, marginTop: "4px", color: scoreDelta < 0 ? "var(--low)" : scoreDelta > 0 ? "var(--high)" : "var(--muted)" }}>
                {scoreDelta > 0 ? `+${scoreDelta}` : scoreDelta} vs current
              </div>
            </div>
          </div>

          {whatIfResult.reasons.length > 0 ? (
            <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px dashed var(--border)" }}>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--muted)" }}>Triggered Rule Penalties:</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "6px" }}>
                {whatIfResult.reasons.map((r, i) => (
                  <span key={i} style={{ fontSize: "11.5px", background: "#FFFFFF", padding: "3px 8px", borderRadius: "6px", border: "1px solid var(--border)", color: "var(--ink)" }}>
                    • {r}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ fontSize: "12.5px", color: "var(--low)", fontWeight: 600, marginTop: "8px" }}>
              ✓ Optimal baseline: No risk penalties active!
            </div>
          )}

          {/* Feedback Section (Step 11 requirement) */}
          <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
            <span style={{ fontSize: "12px", color: "var(--muted)" }}>
              Was this what-if projection helpful?
            </span>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button
                type="button"
                onClick={() => setFeedbackGiven("helpful")}
                style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", padding: "4px 10px", borderRadius: "6px", background: feedbackGiven === "helpful" ? "var(--sage-light)" : "#FFFFFF", border: "1px solid var(--border)", color: feedbackGiven === "helpful" ? "var(--sage-hover)" : "var(--ink)" }}
              >
                <ThumbsUp size={12} /> Yes
              </button>
              <button
                type="button"
                onClick={() => setFeedbackGiven("not_helpful")}
                style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", padding: "4px 10px", borderRadius: "6px", background: feedbackGiven === "not_helpful" ? "#FEE2E2" : "#FFFFFF", border: "1px solid var(--border)", color: feedbackGiven === "not_helpful" ? "var(--high)" : "var(--ink)" }}
              >
                <ThumbsDown size={12} /> No
              </button>
              {feedbackGiven && (
                <span style={{ fontSize: "11px", color: "var(--low)", fontWeight: 600 }}>
                  ✓ Feedback noted
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Support: Non-clinical action */}
      <div className="card" style={{ borderLeft: "4px solid var(--sage)", padding: "24px 28px", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <Sparkles size={18} style={{ color: "var(--sage)" }} />
          <span className="micro-label">AI EARLY SUPPORT (CLAUDE RESILIENT)</span>
        </div>

        <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>
          One small action for today
        </h3>
        <p style={{ color: "var(--muted)", fontSize: "14.5px", lineHeight: "1.5", marginBottom: "16px" }}>
          {aiSupport?.message || "Take a moment to step back from screens. A brief reset creates room for cognitive clarity."}
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setActionDone(true)}
            disabled={actionDone}
          >
            {actionDone ? "✓ Action noted for today" : aiSupport?.action || "Take a 15-min walk"}
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setShowSafetyCard((prev) => !prev)}
            style={{ fontSize: "12px", color: "var(--muted)" }}
          >
            {showSafetyCard ? "Hide Safety Helplines" : "Need Crisis Helplines?"}
          </button>
        </div>
      </div>

      {/* Non-clinical assurance banner */}
      <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", backgroundColor: "#F5F5F4", padding: "16px", borderRadius: "8px", fontSize: "13px", color: "var(--muted)" }}>
        <Info size={18} style={{ color: "var(--sage)", flexShrink: 0, marginTop: "1px" }} />
        <span>
          Freebuff signals are calculated strictly from your self-reported tempos. They are designed to encourage timely micro-breaks, not to diagnose or replace clinical medical advice.
        </span>
      </div>
    </div>
  );
}
