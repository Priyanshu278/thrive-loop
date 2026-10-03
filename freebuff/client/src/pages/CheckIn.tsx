import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, ShieldCheck } from "lucide-react";
import { submitCheckIn } from "../lib/api";
import type { RiskSignal } from "../types";

export default function CheckIn() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [sleep, setSleep] = useState(6.5);
  const [stress, setStress] = useState(3);
  const [mood, setMood] = useState(3);
  const [deadlines, setDeadlines] = useState(2);
  const [isComplete, setIsComplete] = useState(false);
  const [newSignal, setNewSignal] = useState<RiskSignal | null>(null);

  async function handleFinish() {
    const signal = await submitCheckIn({
      date: new Date().toISOString().slice(0, 10),
      sleepHours: sleep,
      stress,
      mood,
      deadlines,
    });
    setNewSignal(signal);
    setIsComplete(true);
  }

  if (isComplete && newSignal) {
    return (
      <div style={{ maxWidth: "560px", margin: "40px auto", textAlign: "center" }}>
        <div style={{ width: "56px", height: "56px", borderRadius: "50%", backgroundColor: "#DCFCE7", color: "#16A34A", display: "grid", placeItems: "center", margin: "0 auto 16px" }}>
          <Check size={28} />
        </div>
        <span className="micro-label">CHECK-IN COMPLETE</span>
        <h1 className="serif-display" style={{ fontSize: "36px", margin: "8px 0 12px" }}>
          Thanks for checking in.
        </h1>
        <p style={{ color: "#78716C", fontSize: "15px", lineHeight: "1.5", marginBottom: "28px" }}>
          Sometimes noticing the pattern is the first useful step. Your personal rhythms have been quietly updated.
        </p>

        <div className="card" style={{ padding: "24px", textAlign: "left", marginBottom: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <span className="micro-label">YOUR SIGNAL</span>
            <span className={`signal-pill level-${newSignal.level.toLowerCase()}`}>
              ● {newSignal.level}
            </span>
          </div>
          <div style={{ fontSize: "36px", fontFamily: "var(--font-serif)", fontWeight: 400, color: "#1C1917", marginBottom: "8px" }}>
            {newSignal.score}
          </div>
          <p style={{ fontSize: "14px", color: "#78716C", lineHeight: "1.4" }}>
            {newSignal.headline}
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            Back to Home →
          </button>
          <button className="btn btn-outline" onClick={() => navigate("/signal")}>
            See what this means
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkin-flow-wrapper">
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
        <button
          type="button"
          onClick={() => (step > 1 ? setStep(step - 1) : navigate("/"))}
          className="btn btn-ghost"
          style={{ padding: "6px" }}
        >
          <ArrowLeft size={18} />
        </button>
        <span className="micro-label">STEP {step} OF 4</span>
      </div>

      <div className="stepper-progress-bar">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className={`stepper-progress-segment ${s <= step ? "active" : ""}`} />
        ))}
      </div>

      {/* STEP 1: SLEEP */}
      {step === 1 && (
        <div>
          <span className="micro-label">FIRST, SLEEP</span>
          <h2 className="checkin-step-title">How long did you sleep last night?</h2>
          <div style={{ textAlign: "center", margin: "32px 0" }}>
            <span style={{ fontSize: "52px", fontFamily: "var(--font-serif)", color: "#1C1917" }}>
              {sleep}
            </span>
            <span style={{ fontSize: "18px", color: "#78716C", marginLeft: "4px" }}>hours</span>
          </div>
          <div className="chips-row">
            {[4.5, 5.5, 6.5, 7.5, 8.5].map((val) => (
              <button
                key={val}
                type="button"
                className={`choice-chip ${sleep === val ? "selected" : ""}`}
                onClick={() => setSleep(val)}
              >
                {val}h
              </button>
            ))}
          </div>
          <button className="btn btn-primary btn-full" style={{ height: "46px" }} onClick={() => setStep(2)}>
            Continue to Stress →
          </button>
        </div>
      )}

      {/* STEP 2: STRESS */}
      {step === 2 && (
        <div>
          <span className="micro-label">STRESS LOAD</span>
          <h2 className="checkin-step-title">How stressed do you feel right now?</h2>
          <p style={{ color: "#78716C", fontSize: "14px", marginBottom: "24px" }}>
            1 represents calm and unhurried; 5 represents high pressure or cognitive overload.
          </p>
          <div className="chips-row">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                type="button"
                className={`choice-chip ${stress === val ? "selected" : ""}`}
                onClick={() => setStress(val)}
              >
                {val}
              </button>
            ))}
          </div>
          <button className="btn btn-primary btn-full" style={{ height: "46px" }} onClick={() => setStep(3)}>
            Continue to Mood →
          </button>
        </div>
      )}

      {/* STEP 3: MOOD */}
      {step === 3 && (
        <div>
          <span className="micro-label">MOOD CHECK</span>
          <h2 className="checkin-step-title">How are you feeling overall?</h2>
          <div className="chips-row">
            {[
              { val: 1, label: "Drained" },
              { val: 2, label: "Tense" },
              { val: 3, label: "Steady" },
              { val: 4, label: "Good" },
              { val: 5, label: "Energized" },
            ].map((m) => (
              <button
                key={m.val}
                type="button"
                className={`choice-chip ${mood === m.val ? "selected" : ""}`}
                onClick={() => setMood(m.val)}
                style={{ fontSize: "13px" }}
              >
                {m.label}
              </button>
            ))}
          </div>
          <button className="btn btn-primary btn-full" style={{ height: "46px" }} onClick={() => setStep(4)}>
            Continue to Deadlines →
          </button>
        </div>
      )}

      {/* STEP 4: DEADLINES */}
      {step === 4 && (
        <div>
          <span className="micro-label">ACADEMIC TEMPO</span>
          <h2 className="checkin-step-title">How many important deadlines are coming up?</h2>
          <p style={{ color: "#78716C", fontSize: "14px", marginBottom: "24px" }}>
            Major problem sets, lab reports, midterms, or presentations over the next 7 days:
          </p>
          <div className="chips-row">
            {[0, 1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                type="button"
                className={`choice-chip ${deadlines === val ? "selected" : ""}`}
                onClick={() => setDeadlines(val)}
              >
                {val}
              </button>
            ))}
          </div>
          <button className="btn btn-primary btn-full" style={{ height: "46px" }} onClick={handleFinish}>
            Finish check-in →
          </button>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center", marginTop: "32px", fontSize: "12px", color: "#A8A29E" }}>
        <ShieldCheck size={15} style={{ color: "#4D7C6F" }} />
        <span>Your individual numbers are private and never shown to friends or faculty.</span>
      </div>
    </div>
  );
}
