import { useEffect, useState } from "react";
import { ShieldCheck, Heart, Check } from "lucide-react";
import { getCareCircle, sendNudgeToMember } from "../lib/api";
import type { CareCircleMember } from "../types";

export default function CareCircle() {
  const [members, setMembers] = useState<CareCircleMember[]>([]);
  const [sentMap, setSentMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    getCareCircle().then(setMembers);
  }, []);

  async function handleSendNudge(id: string) {
    await sendNudgeToMember(id);
    setSentMap((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setSentMap((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  }

  return (
    <div style={{ maxWidth: "820px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <span className="micro-label">HUMAN SUPPORT</span>
        <h1 className="serif-display" style={{ fontSize: "36px", margin: "6px 0 8px" }}>
          Care Circle
        </h1>
        <p style={{ color: "#78716C", fontSize: "16px", lineHeight: "1.4" }}>
          People who can be there without needing every detail.
        </p>
      </div>

      <div className="card" style={{ display: "flex", alignItems: "flex-start", gap: "12px", backgroundColor: "#E7F0ED", borderColor: "#BCD5CD" }}>
        <ShieldCheck size={20} style={{ color: "#4D7C6F", flexShrink: 0, marginTop: "2px" }} />
        <div style={{ fontSize: "13.5px", color: "#3E655B", lineHeight: "1.45" }}>
          <strong>Your raw check-in numbers are never shared with your circle.</strong>
          <p style={{ margin: "2px 0 0" }}>
            When your signal is elevated, friends only see that you might be having a busy week and can send a quiet check-in.
          </p>
        </div>
      </div>

      <div className="circle-grid">
        {members.map((member) => (
          <div key={member.id} className="card circle-member-card">
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  backgroundColor: "#F5F5F4",
                  color: "#1C1917",
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 600,
                  fontSize: "15px"
                }}
              >
                {member.name[0]}
              </div>
              <div>
                <strong style={{ fontSize: "15px", display: "block" }}>{member.name}</strong>
                <span style={{ fontSize: "12.5px", color: "#78716C" }}>{member.relationship}</span>
              </div>
            </div>

            <div>
              {sentMap[member.id] ? (
                <span style={{ fontSize: "12px", color: "#16A34A", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <Check size={14} /> Nudge sent
                </span>
              ) : (
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ fontSize: "12.5px", padding: "6px 12px" }}
                  onClick={() => handleSendNudge(member.id)}
                >
                  <Heart size={13} style={{ color: "#E11D48" }} /> Send nudge
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: "16px" }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => alert("Invite link copied to clipboard.")}
        >
          + Add a friend to your circle
        </button>
      </div>
    </div>
  );
}
