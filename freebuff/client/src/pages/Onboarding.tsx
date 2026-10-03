import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

interface OnboardingProps {
  onComplete?: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [sleep, setSleep] = useState("7h");
  const [deadlines, setDeadlines] = useState("2-3");

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", backgroundColor: "#FAFAF9" }}>
      <div style={{ maxWidth: "520px", width: "100%" }}>
        {/* Progress dots */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "32px" }}>
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              style={{
                flex: 1,
                height: "3px",
                borderRadius: "99px",
                backgroundColor: s <= step ? "#4D7C6F" : "#E7E5E4",
                transition: "background-color 0.2s ease"
              }}
            />
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div>
            <span className="micro-label">GETTING STARTED</span>
            <h1 className="serif-display" style={{ fontSize: "36px", margin: "12px 0 20px", lineHeight: "1.2" }}>
              A little context helps us understand your week.
            </h1>
            <p style={{ color: "#78716C", fontSize: "16px", lineHeight: "1.5", marginBottom: "36px" }}>
              Freebuff doesn't demand hours of journaling. Two questions give us the baseline needed to surface gentle, timely signals before fatigue compounds.
            </p>
            <button className="btn btn-primary" style={{ padding: "12px 24px" }} onClick={() => setStep(2)}>
              Continue →
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div>
            <span className="micro-label">SLEEP BASELINE</span>
            <h1 className="serif-display" style={{ fontSize: "36px", margin: "12px 0 20px", lineHeight: "1.2" }}>
              How much sleep do you usually get?
            </h1>
            <div style={{ display: "flex", gap: "10px", margin: "24px 0 36px" }}>
              {["< 5h", "6h", "7h", "8h+"].map((val) => (
                <button
                  key={val}
                  type="button"
                  className={`choice-chip ${sleep === val ? "selected" : ""}`}
                  onClick={() => setSleep(val)}
                >
                  {val}
                </button>
              ))}
            </div>
            <button className="btn btn-primary" style={{ padding: "12px 24px" }} onClick={() => setStep(3)}>
              Continue →
            </button>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div>
            <span className="micro-label">ACADEMIC TEMPO</span>
            <h1 className="serif-display" style={{ fontSize: "36px", margin: "12px 0 20px", lineHeight: "1.2" }}>
              What does your week look like?
            </h1>
            <p style={{ color: "#78716C", fontSize: "15px", marginBottom: "20px" }}>
              Upcoming assignments, exams, or major presentations:
            </p>
            <div style={{ display: "flex", gap: "10px", marginBottom: "36px" }}>
              {["Quiet (0)", "Moderate (1-2)", "Busy (3-4)", "Exam Week (5+)"].map((val) => (
                <button
                  key={val}
                  type="button"
                  className={`choice-chip ${deadlines === val ? "selected" : ""}`}
                  onClick={() => setDeadlines(val)}
                  style={{ fontSize: "13px" }}
                >
                  {val}
                </button>
              ))}
            </div>
            <button className="btn btn-primary" style={{ padding: "12px 24px" }} onClick={() => setStep(4)}>
              Continue →
            </button>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "#E7F0ED", color: "#4D7C6F", display: "grid", placeItems: "center", marginBottom: "16px" }}>
              <ShieldCheck size={26} />
            </div>
            <span className="micro-label">PRIVACY PLEDGE</span>
            <h1 className="serif-display" style={{ fontSize: "36px", margin: "12px 0 16px", lineHeight: "1.2" }}>
              Your space is private.
            </h1>
            <p style={{ color: "#78716C", fontSize: "16px", lineHeight: "1.5", marginBottom: "36px" }}>
              Your check-ins stay strictly yours. Care Circle friends only receive warm nudges when you're running low—never raw numbers or diagnostic labels.
            </p>
            <button
              className="btn btn-primary"
              style={{ padding: "12px 28px" }}
              onClick={() => {
                if (onComplete) {
                  onComplete();
                } else {
                  navigate("/");
                }
              }}
            >
              Enter Freebuff →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
