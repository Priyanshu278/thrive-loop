import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Moon,
  Zap,
  Smile,
  ShieldCheck,
  Calendar,
  Users,
  Sparkles,
} from "lucide-react";
import {
  getRiskSignal,
  getWeeklyTelemetry,
  getAISupport,
  getExams,
  getCareCircle,
} from "../lib/api";
import type { RiskSignal, WeeklyTelemetry, AISupportMessage, Exam, CareCircleMember } from "../types";

export default function Home() {
  const navigate = useNavigate();
  const [signal, setSignal] = useState<RiskSignal | null>(null);
  const [telemetry, setTelemetry] = useState<WeeklyTelemetry | null>(null);
  const [aiSupport, setAiSupport] = useState<AISupportMessage | null>(null);
  const [nextExam, setNextExam] = useState<Exam | null>(null);
  const [circle, setCircle] = useState<CareCircleMember[]>([]);

  useEffect(() => {
    getRiskSignal().then(setSignal);
    getWeeklyTelemetry().then(setTelemetry);
    getAISupport().then(setAiSupport);
    getExams().then((exams) => setNextExam(exams[0] || null));
    getCareCircle().then(setCircle);
  }, []);

  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  return (
    <div className="home-page">
      {/* 1. TOP EDITORIAL HERO */}
      <section className="home-top-editorial">
        <div>
          <span className="micro-label">{todayDate}</span>
          <h1 className="home-greeting-h1">Good morning, Alex.</h1>
          <p className="home-subhead">Let's check in with yourself.</p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="button"
            className="btn btn-outline"
            style={{ fontSize: "13px" }}
            onClick={() => navigate("/privacy")}
          >
            <ShieldCheck size={15} style={{ color: "#4D7C6F" }} /> Private
          </button>
        </div>
      </section>

      {/* 2. WEEKLY TELEMETRY ROW */}
      <section className="weekly-telemetry-row">
        <div className="telemetry-tile">
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#78716C", fontSize: "12px", fontWeight: 600 }}>
            <Moon size={14} style={{ color: "#4D7C6F" }} />
            <span>AVERAGE SLEEP</span>
          </div>
          <div className="telemetry-val">{telemetry?.avgSleep || "6.1h"}</div>
          <span style={{ fontSize: "12px", color: "#A8A29E" }}>Last 7 nights</span>
        </div>

        <div className="telemetry-tile">
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#78716C", fontSize: "12px", fontWeight: 600 }}>
            <Zap size={14} style={{ color: "#D97706" }} />
            <span>AVERAGE STRESS</span>
          </div>
          <div className="telemetry-val">{telemetry?.avgStress || "3.8"} <span style={{ fontSize: "14px", color: "#A8A29E", fontWeight: 400 }}>/ 5</span></div>
          <span style={{ fontSize: "12px", color: "#A8A29E" }}>Moderate load</span>
        </div>

        <div className="telemetry-tile">
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#78716C", fontSize: "12px", fontWeight: 600 }}>
            <Smile size={14} style={{ color: "#16A34A" }} />
            <span>MOOD RATING</span>
          </div>
          <div className="telemetry-val">{telemetry?.avgMood || "3.2"} <span style={{ fontSize: "14px", color: "#A8A29E", fontWeight: 400 }}>/ 5</span></div>
          <span style={{ fontSize: "12px", color: "#A8A29E" }}>Consistent trend</span>
        </div>
      </section>

      {/* 3. MAIN COMPOSITION: TODAY'S CHECK-IN BESIDE YOUR SIGNAL */}
      <section className="main-editorial-grid">
        {/* Today's Check-in Card */}
        <div className="today-checkin-box">
          <div>
            <span className="micro-label">TODAY'S CHECK-IN</span>
            <h2 className="checkin-prompt-title">How are you actually feeling?</h2>
            <p style={{ color: "#78716C", fontSize: "14.5px", lineHeight: "1.5", maxWidth: "360px" }}>
              Take 30 seconds to log sleep, deadlines, and pressure. Notice the pattern before it compounds into burnout.
            </p>
          </div>

          <div style={{ marginTop: "24px" }}>
            <button
              type="button"
              className="btn btn-primary"
              style={{ padding: "12px 24px", fontSize: "14.5px" }}
              onClick={() => navigate("/checkin")}
            >
              Check in →
            </button>
          </div>
        </div>

        {/* Your Signal Box */}
        <div className="your-signal-box">
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="micro-label">YOUR SIGNAL</span>
              <span className={`signal-pill level-${signal?.level.toLowerCase() || "medium"}`}>
                ● {signal?.level || "Medium"}
              </span>
            </div>

            <div className="signal-score-row">
              <span className="signal-big-num">{signal?.score || 42}</span>
              <span style={{ fontSize: "13px", color: "#78716C" }}>index score</span>
            </div>

            <p style={{ fontSize: "13.5px", color: "#1C1917", fontWeight: 500, lineHeight: "1.4" }}>
              {signal?.headline}
            </p>

            <div className="factors-list">
              {(signal?.factors || ["Sleep averaged 5.8h", "3 deadlines this week", "Stress higher"]).map((factor, i) => (
                <div key={i} className="factor-item">
                  <span style={{ color: "#D97706", fontWeight: 700 }}>•</span>
                  <span>{factor}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: "18px", borderTop: "1px solid #E7E5E4", paddingTop: "12px" }}>
            <Link
              to="/signal"
              style={{ fontSize: "13px", fontWeight: 600, color: "#4D7C6F", display: "inline-flex", alignItems: "center", gap: "4px" }}
            >
              See contributing factors →
            </Link>
          </div>
        </div>
      </section>

      {/* 4. LARGE EDITORIAL PHOTOGRAPHY SECTION */}
      <section className="editorial-photo-banner">
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
          alt="Quiet campus courtyard in natural afternoon light"
          className="editorial-campus-img"
        />
        <div className="photo-banner-overlay">
          <p className="photo-overlay-quote">
            “Taking a quiet moment isn't lost time. It's how you make the rest of your week possible.”
          </p>
        </div>
      </section>

      {/* 5. SECONDARY LOWER ROW: AI SUPPORT & NEXT UP */}
      <section className="lower-editorial-grid">
        {/* AI Support Box */}
        <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
              <Sparkles size={16} style={{ color: "#4D7C6F" }} />
              <span className="micro-label">EARLY SUPPORT</span>
            </div>
            <h3 style={{ fontSize: "17px", fontWeight: 600, marginBottom: "8px" }}>A gentle reminder</h3>
            <p style={{ color: "#78716C", fontSize: "13.5px", lineHeight: "1.5" }}>
              {aiSupport?.message}
            </p>
          </div>

          <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid #E7E5E4" }}>
            <span style={{ fontSize: "12px", color: "#A8A29E" }}>Suggested: </span>
            <strong style={{ fontSize: "13px", color: "#1C1917" }}>{aiSupport?.action}</strong>
          </div>
        </div>

        {/* Next Up Exam & Deadlines */}
        <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
              <Calendar size={16} style={{ color: "#D97706" }} />
              <span className="micro-label">NEXT UP</span>
            </div>
            <h3 style={{ fontSize: "17px", fontWeight: 600, marginBottom: "4px" }}>
              {nextExam?.course}
            </h3>
            <p style={{ color: "#78716C", fontSize: "13.5px" }}>
              {nextExam?.title} · <strong style={{ color: "#D97706" }}>{nextExam?.daysAway} days away</strong>
            </p>
            <span style={{ fontSize: "12px", color: "#A8A29E", display: "block", marginTop: "4px" }}>
              {nextExam?.date} ({nextExam?.weight})
            </span>
          </div>

          <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid #E7E5E4" }}>
            <Link
              to="/calendar"
              style={{ fontSize: "13px", fontWeight: 600, color: "#4D7C6F", display: "inline-flex", alignItems: "center", gap: "4px" }}
            >
              View exam schedule →
            </Link>
          </div>
        </div>
      </section>

      {/* 6. CARE CIRCLE STRIP */}
      <section className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "38px", height: "38px", borderRadius: "10px", backgroundColor: "#E7F0ED", color: "#4D7C6F", display: "grid", placeItems: "center" }}>
            <Users size={18} />
          </div>
          <div>
            <strong style={{ display: "block", fontSize: "14px" }}>Care Circle</strong>
            <span style={{ fontSize: "12.5px", color: "#78716C" }}>
              {circle.length} connected friends · Quiet support without exposing numbers
            </span>
          </div>
        </div>

        <Link to="/circle" className="btn btn-outline" style={{ fontSize: "13px" }}>
          Open Circle →
        </Link>
      </section>
    </div>
  );
}
