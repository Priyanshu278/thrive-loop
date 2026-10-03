import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar as CalendarIcon, ArrowLeft, Clock, Sparkles, CheckCircle2 } from "lucide-react";
import { getExams } from "../lib/api";
import type { Exam } from "../types";

export default function Calendar() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getExams().then((data) => {
      setExams(data);
      setLoading(false);
    });
  }, []);

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
        <span className="micro-label">ACADEMIC TIMELINE • EXAMS & DEADLINES</span>
        <h1
          className="serif-display"
          style={{ fontSize: 34, marginTop: 6, marginBottom: 8 }}
        >
          Your upcoming academic tempo.
        </h1>
        <p style={{ fontSize: 15, color: "var(--muted)" }}>
          Tracking deadlines helps Freebuff contextualize your workload so pressure doesn't catch you off guard.
        </p>
      </div>

      {loading ? (
        <div className="card" style={{ textAlign: "center", padding: 48, color: "var(--muted)" }}>
          Loading schedule...
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Timeline Cards */}
          <div className="exam-timeline">
            {exams.map((exam) => (
              <div key={exam.id} className="card exam-card-item">
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "var(--sage)",
                        background: "var(--sage-light)",
                        padding: "3px 8px",
                        borderRadius: "var(--r-sm)",
                      }}
                    >
                      {exam.course}
                    </span>
                    {exam.weight && (
                      <span style={{ fontSize: 12, color: "var(--subtle)" }}>
                        {exam.weight}
                      </span>
                    )}
                  </div>
                  <h3
                    className="serif-display"
                    style={{ fontSize: 22, fontWeight: 500, color: "var(--ink)" }}
                  >
                    {exam.title}
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 13,
                      color: "var(--muted)",
                    }}
                  >
                    <CalendarIcon size={14} />
                    <span>{exam.date}</span>
                  </div>
                </div>

                <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: exam.daysAway <= 4 ? "var(--medium)" : "var(--muted)",
                      backgroundColor: exam.daysAway <= 4 ? "var(--medium-bg)" : "var(--bg-secondary)",
                      padding: "4px 12px",
                      borderRadius: "var(--r-full)",
                    }}
                  >
                    {exam.daysAway === 1 ? "Tomorrow" : `${exam.daysAway} days away`}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--subtle)" }}>
                    Preparation buffer suggested
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Academic Wellbeing Strategy Banner */}
          <div
            className="card"
            style={{
              padding: "24px 28px",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              display: "flex",
              gap: 20,
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "var(--r-sm)",
                background: "var(--sage-light)",
                display: "grid",
                placeItems: "center",
                color: "var(--sage)",
                flexShrink: 0,
              }}
            >
              <Sparkles size={20} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span className="micro-label">COGNITIVE PACING PRINCIPLE</span>
              <h4 className="serif-display" style={{ fontSize: 18 }}>
                Scheduling 30-minute decompression blocks 24 hours prior to exams cuts cognitive fatigue.
              </h4>
              <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.5 }}>
                Instead of late-night cramming immediately before Tuesday's Database Systems exam, aim to taper intensive study by 8:00 PM Monday evening. Freebuff will calibrate your risk signal to protect your recovery window.
              </p>
            </div>
          </div>

          {/* Rhythms Overview Tile */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            <div className="card" style={{ padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Clock size={16} color="var(--sage)" />
                <span style={{ fontSize: 13, fontWeight: 600 }}>Study Windows</span>
              </div>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.4 }}>
                Recommended peak focus blocks: 9:30 AM – 12:00 PM. Protect evenings for mental unwinding.
              </p>
            </div>

            <div className="card" style={{ padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <CheckCircle2 size={16} color="var(--sage)" />
                <span style={{ fontSize: 13, fontWeight: 600 }}>Calendar Sync</span>
              </div>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.4 }}>
                Academic dates are securely read-only. We do not export your wellbeing check-ins back to course portals.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
