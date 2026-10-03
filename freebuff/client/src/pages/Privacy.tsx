import { Link } from "react-router-dom";
import { Lock, Users, Building2, ArrowLeft, CheckCircle2, Download, Trash2 } from "lucide-react";

export default function Privacy() {
  return (
    <div className="signal-detail-page">
      <div>
        <Link
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            color: "var(--muted)",
            marginBottom: 16,
          }}
        >
          <ArrowLeft size={14} /> Back to Today
        </Link>
        <span className="micro-label">PRIVACY PLEDGE • ARCHITECTURAL TRANSPARENCY</span>
        <h1
          className="serif-display"
          style={{ fontSize: 36, marginTop: 6, marginBottom: 8 }}
        >
          Your data. Your space. Always.
        </h1>
        <p style={{ fontSize: 15, color: "var(--muted)" }}>
          Wellbeing tools fail if students fear scrutiny. Freebuff is architected with strict boundary separation by design.
        </p>
      </div>

      {/* 3 Pillar Diagram */}
      <div className="privacy-flow-diagram">
        {/* Card 1 */}
        <div className="privacy-diagram-card">
          <div
            className="privacy-diagram-icon"
            style={{ backgroundColor: "var(--sage-light)", color: "var(--sage)" }}
          >
            <Lock size={20} />
          </div>
          <span className="micro-label" style={{ color: "var(--sage)" }}>STRICTLY PRIVATE</span>
          <h3 className="serif-display" style={{ fontSize: 20, margin: "6px 0 10px" }}>
            Daily Check-ins
          </h3>
          <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.5 }}>
            Your sleep hours, stress ratings, mood choices, and personal reflections never leave your private vault. No peer, professor, or campus administrator can view them.
          </p>
        </div>

        {/* Card 2 */}
        <div className="privacy-diagram-card">
          <div
            className="privacy-diagram-icon"
            style={{ backgroundColor: "var(--sage-light)", color: "var(--sage)" }}
          >
            <Users size={20} />
          </div>
          <span className="micro-label" style={{ color: "var(--sage)" }}>DISCREET NUDGES</span>
          <h3 className="serif-display" style={{ fontSize: 20, margin: "6px 0 10px" }}>
            Care Circle
          </h3>
          <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.5 }}>
            Friends you choose to invite can send or receive gentle nudges (like offering a coffee or a study break). They never see your signal score, numbers, or history.
          </p>
        </div>

        {/* Card 3 */}
        <div className="privacy-diagram-card">
          <div
            className="privacy-diagram-icon"
            style={{ backgroundColor: "var(--sage-light)", color: "var(--sage)" }}
          >
            <Building2 size={20} />
          </div>
          <span className="micro-label" style={{ color: "var(--sage)" }}>ANONYMIZED ONLY</span>
          <h3 className="serif-display" style={{ fontSize: 20, margin: "6px 0 10px" }}>
            Campus Support
          </h3>
          <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.5 }}>
            Counselors receive aggregate university cohort trends (e.g. "Mechanical Engineering sophomores report higher stress during Week 7") to allocate workshops. Never individual names.
          </p>
        </div>
      </div>

      {/* Specific Trust Guarantees */}
      <div className="card" style={{ padding: "28px 32px" }}>
        <span className="micro-label">OUR FOUR BOUNDARIES</span>
        <h3 className="serif-display" style={{ fontSize: 24, margin: "8px 0 20px" }}>
          How we safeguard student autonomy
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            {
              title: "Zero academic surveillance",
              desc: "Freebuff has no integration with grading, transcripts, or academic standing systems. You cannot be penalized for fatigue.",
            },
            {
              title: "No behavioral advertising or commercial brokers",
              desc: "Your wellbeing rhythms are never sold, rented, or repurposed for commercial targeting.",
            },
            {
              title: "Local encrypted tokenization",
              desc: "Session keys and encrypted check-in credentials are authenticated via industry standard HTTPS transport with zero plaintext exposure.",
            },
            {
              title: "Autonomous control over your records",
              desc: "You have complete rights to export your check-in timeline or delete your profile and historical entries at any moment.",
            },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <CheckCircle2 size={18} color="var(--sage)" style={{ marginTop: 2, flexShrink: 0 }} />
              <div>
                <strong style={{ fontSize: 14.5, color: "var(--ink)" }}>{item.title}: </strong>
                <span style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.5 }}>{item.desc}</span>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 28,
            paddingTop: 20,
            borderTop: "1px solid var(--border)",
          }}
        >
          <button
            type="button"
            className="btn btn-outline"
            style={{ fontSize: 13, gap: 6 }}
            onClick={() => alert("Your encrypted check-in archive is being prepared for export.")}
          >
            <Download size={14} /> Export my data
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            style={{ fontSize: 13, color: "var(--high)", gap: 6 }}
            onClick={() => {
              if (confirm("Are you sure you want to clear your local check-in history? This cannot be undone.")) {
                localStorage.removeItem("freebuff_signal");
                localStorage.removeItem("freebuff_nudges");
                alert("Local data cleared.");
                window.location.reload();
              }
            }}
          >
            <Trash2 size={14} /> Wipe local history
          </button>
        </div>
      </div>
    </div>
  );
}
