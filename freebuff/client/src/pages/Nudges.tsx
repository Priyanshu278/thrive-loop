import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircleHeart, Check, ArrowLeft, HeartHandshake, ShieldCheck } from "lucide-react";
import { getNudges, markNudgeRead } from "../lib/api";
import type { Nudge } from "../types";

export default function Nudges() {
  const [nudges, setNudges] = useState<Nudge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNudges().then((data) => {
      setNudges(data);
      setLoading(false);
    });
  }, []);

  const handleMarkRead = async (id: string) => {
    await markNudgeRead(id);
    setNudges((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadCount = nudges.filter((n) => !n.read).length;

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
        <span className="micro-label">CARE CIRCLE • GENTLE NUDGES</span>
        <h1
          className="serif-display"
          style={{ fontSize: 34, marginTop: 6, marginBottom: 8 }}
        >
          A little support from people who care.
        </h1>
        <p style={{ fontSize: 15, color: "var(--muted)" }}>
          Quiet, non-intrusive check-ins sent by your trusted circle. No public comments, no algorithmic feed.
        </p>
      </div>

      {loading ? (
        <div className="card" style={{ textAlign: "center", padding: 48, color: "var(--muted)" }}>
          Loading your nudges...
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: 8,
              borderBottom: "1px solid var(--border)",
            }}
          >
            <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 500 }}>
              {unreadCount > 0
                ? `${unreadCount} unread ${unreadCount === 1 ? "nudge" : "nudges"}`
                : "All nudges read"}
            </span>
            <Link
              to="/circle"
              className="btn btn-outline"
              style={{ fontSize: 13, padding: "6px 14px" }}
            >
              <HeartHandshake size={14} /> Manage Circle
            </Link>
          </div>

          {nudges.length === 0 ? (
            <div
              className="card"
              style={{
                textAlign: "center",
                padding: "48px 24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "var(--sage-light)",
                  display: "grid",
                  placeItems: "center",
                  color: "var(--sage)",
                }}
              >
                <MessageCircleHeart size={22} />
              </div>
              <h3 className="serif-display" style={{ fontSize: 20 }}>
                Your space is quiet.
              </h3>
              <p style={{ fontSize: 14, color: "var(--muted)", maxWidth: 360 }}>
                No active nudges at this moment. You can always ping a close friend whenever you feel like catching up.
              </p>
            </div>
          ) : (
            nudges.map((nudge) => (
              <div
                key={nudge.id}
                className="card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  borderColor: nudge.read ? "var(--border)" : "var(--sage)",
                  backgroundColor: nudge.read ? "var(--surface)" : "#FCFDFD",
                  position: "relative",
                  transition: "all 0.2s ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: nudge.read ? "var(--bg-secondary)" : "var(--sage-light)",
                        color: nudge.read ? "var(--muted)" : "var(--sage)",
                        fontWeight: 600,
                        fontSize: 13,
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      {nudge.from.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{nudge.from}</div>
                      <div style={{ fontSize: 11, color: "var(--subtle)" }}>
                        {nudge.timestamp}
                      </div>
                    </div>
                  </div>

                  {!nudge.read ? (
                    <button
                      onClick={() => handleMarkRead(nudge.id)}
                      className="btn btn-outline"
                      style={{
                        fontSize: 12,
                        padding: "4px 10px",
                        gap: 4,
                      }}
                      title="Mark as read"
                    >
                      <Check size={12} /> Mark read
                    </button>
                  ) : (
                    <span style={{ fontSize: 12, color: "var(--subtle)" }}>Read</span>
                  )}
                </div>

                <div
                  className="serif-display"
                  style={{
                    fontSize: 18,
                    lineHeight: 1.4,
                    color: "var(--ink)",
                    padding: "4px 0",
                  }}
                >
                  "{nudge.message}"
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid var(--border)",
                    paddingTop: 10,
                    marginTop: 4,
                  }}
                >
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>
                    Private nudge between you and {nudge.from}
                  </span>
                  <Link
                    to="/circle"
                    style={{
                      fontSize: 12,
                      color: "var(--sage)",
                      fontWeight: 500,
                    }}
                  >
                    Reply via Circle →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Privacy guarantee reminder */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "16px 20px",
          background: "var(--bg-secondary)",
          borderRadius: "var(--r-md)",
          border: "1px solid var(--border)",
        }}
      >
        <ShieldCheck size={20} color="var(--sage)" style={{ flexShrink: 0 }} />
        <p style={{ fontSize: 13, color: "var(--muted)" }}>
          <strong>Gentle support philosophy:</strong> Friends in your Care Circle only see that you're navigating a busy period. They never see your individual check-in ratings or notes.
        </p>
      </div>
    </div>
  );
}
