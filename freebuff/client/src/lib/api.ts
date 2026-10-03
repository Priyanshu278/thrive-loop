import axios from "axios";
import type {
  User,
  CheckIn,
  RiskSignal,
  AISupportMessage,
  CareCircleMember,
  Nudge,
  Exam,
  WeeklyTelemetry,
} from "../types";

export const api = axios.create({
  baseURL: "",
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("freebuff_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Robust response error interceptor that avoids "Unexpected end of JSON input"
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const data = error.response.data;
      const message =
        typeof data === "object" && data !== null
          ? data.message || data.error
          : null;
      return Promise.reject(
        new Error(message || `Server responded with ${error.response.status}`)
      );
    }
    if (error.request) {
      return Promise.reject(
        new Error("Could not connect to the Freebuff server. Please ensure it is running.")
      );
    }
    return Promise.reject(error);
  }
);

// Initial realistic demonstration state store
const INITIAL_USER: User = {
  id: "u-1",
  name: "Alex",
  email: "alex@university.edu",
  onboardingComplete: true,
};

const INITIAL_SIGNAL: RiskSignal = {
  score: 42,
  level: "Medium",
  headline: "Your recent check-ins suggest you may be running a little low.",
  factors: [
    "Sleep averaged 5.8h over last 3 days",
    "3 important deadlines this week",
    "Stress ratings trending higher",
  ],
  lastUpdated: "Today at 9:42 AM",
};

const INITIAL_TELEMETRY: WeeklyTelemetry = {
  avgSleep: "6.1h",
  avgStress: 3.8,
  avgMood: 3.2,
  checkInCount: 5,
  totalDays: 7,
};

const INITIAL_AI_SUPPORT: AISupportMessage = {
  id: "ai-1",
  message:
    "Your schedule is heaviest before Thursday. A 15-minute screen-free walk after your 2 PM lecture can release tension without costing study time.",
  action: "Take a 15-minute walk",
  context: "Based on 3 upcoming deadlines and 5.8h average sleep.",
};

const INITIAL_MEMBERS: CareCircleMember[] = [
  { id: "c-1", name: "Riya", relationship: "Roommate", connected: true, lastNudge: "Yesterday" },
  { id: "c-2", name: "Karan", relationship: "Study Partner", connected: true, lastNudge: "3 days ago" },
  { id: "c-3", name: "Neha", relationship: "Friend", connected: true },
];

const INITIAL_NUDGES: Nudge[] = [
  {
    id: "n-1",
    from: "Riya",
    message: "Hey Alex! Noticed you were up late studying. Grabbed you a coffee from the lobby ☕",
    read: false,
    timestamp: "10:30 AM",
  },
  {
    id: "n-2",
    from: "Karan",
    message: "No rush on the lab review today. Take a breather first!",
    read: true,
    timestamp: "Yesterday",
  },
];

const INITIAL_EXAMS: Exam[] = [
  {
    id: "e-1",
    course: "DATABASE SYSTEMS",
    title: "Mid-semester exam",
    date: "Tuesday, Oct 6",
    daysAway: 4,
    weight: "25% of grade",
  },
  {
    id: "e-2",
    course: "DISTRIBUTED SYSTEMS",
    title: "Project Milestone 2",
    date: "Thursday, Oct 8",
    daysAway: 6,
    weight: "15% of grade",
  },
];

// Helper methods with offline fallback
export async function getHealth() {
  try {
    const res = await api.get("/api/health");
    return res.data;
  } catch {
    return { status: "offline", service: "freebuff-client-offline" };
  }
}

export async function getCurrentUser(): Promise<User> {
  const stored = localStorage.getItem("freebuff_user");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Fallback
    }
  }
  return INITIAL_USER;
}

export async function saveCurrentUser(user: User): Promise<void> {
  localStorage.setItem("freebuff_user", JSON.stringify(user));
}

export async function getRiskSignal(): Promise<RiskSignal> {
  const stored = localStorage.getItem("freebuff_signal");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {}
  }
  return INITIAL_SIGNAL;
}

export async function getWeeklyTelemetry(): Promise<WeeklyTelemetry> {
  return INITIAL_TELEMETRY;
}

export async function getAISupport(): Promise<AISupportMessage> {
  return INITIAL_AI_SUPPORT;
}

export async function getCareCircle(): Promise<CareCircleMember[]> {
  const stored = localStorage.getItem("freebuff_circle");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {}
  }
  return INITIAL_MEMBERS;
}

export async function getNudges(): Promise<Nudge[]> {
  const stored = localStorage.getItem("freebuff_nudges");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {}
  }
  return INITIAL_NUDGES;
}

export async function markNudgeRead(id: string): Promise<void> {
  const list = await getNudges();
  const updated = list.map((n) => (n.id === id ? { ...n, read: true } : n));
  localStorage.setItem("freebuff_nudges", JSON.stringify(updated));
}

export async function sendNudgeToMember(memberId: string): Promise<void> {
  const list = await getCareCircle();
  const updated = list.map((m) =>
    m.id === memberId ? { ...m, lastNudge: "Just now" } : m
  );
  localStorage.setItem("freebuff_circle", JSON.stringify(updated));
}

export async function getExams(): Promise<Exam[]> {
  return INITIAL_EXAMS;
}

export async function submitCheckIn(data: Omit<CheckIn, "id" | "createdAt">): Promise<RiskSignal> {
  // Re-calculate risk score realistically
  // Baseline 20 + stress contribution (0-30) + lack of sleep (0-30) + deadlines (0-20)
  const sleepPenalty = Math.max(0, (7.5 - data.sleepHours) * 8);
  const stressPenalty = (data.stress - 1) * 7.5;
  const deadlinePenalty = Math.min(20, data.deadlines * 6);
  const rawScore = Math.min(95, Math.max(12, Math.round(15 + sleepPenalty + stressPenalty + deadlinePenalty)));

  let level: "Low" | "Medium" | "High" = "Low";
  let headline = "Your recent patterns look steady and sustainable.";
  if (rawScore >= 65) {
    level = "High";
    headline = "Your check-ins show multiple high-pressure factors converging.";
  } else if (rawScore >= 35) {
    level = "Medium";
    headline = "Your recent check-ins suggest you may be running a little low.";
  }

  const factors: string[] = [];
  if (data.sleepHours < 6.5) factors.push(`Sleep was ${data.sleepHours}h last night`);
  if (data.stress >= 4) factors.push(`Stress rated ${data.stress} of 5`);
  if (data.deadlines >= 2) factors.push(`${data.deadlines} upcoming deadlines`);
  if (factors.length === 0) factors.push("Rhythms within normal range");

  const newSignal: RiskSignal = {
    score: rawScore,
    level,
    headline,
    factors,
    lastUpdated: "Just now",
  };

  localStorage.setItem("freebuff_signal", JSON.stringify(newSignal));
  return newSignal;
}
