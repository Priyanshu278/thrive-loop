export interface User {
  id: string;
  name: string;
  email: string;
  onboardingComplete: boolean;
}

export interface CheckIn {
  id: string;
  date: string;
  sleepHours: number;
  stress: number; // 1 - 5
  mood: number; // 1 - 5
  deadlines: number;
  note?: string;
  createdAt: string;
}

export type RiskLevel = "Low" | "Medium" | "High";

export interface RiskSignal {
  score: number; // 0 - 100
  level: RiskLevel;
  headline: string;
  factors: string[];
  lastUpdated: string;
}

export interface AISupportMessage {
  id: string;
  message: string;
  action: string;
  context: string;
  helpfulCount?: number;
}

export interface CareCircleMember {
  id: string;
  name: string;
  relationship: string;
  connected: boolean;
  avatarUrl?: string;
  lastNudge?: string;
}

export interface Nudge {
  id: string;
  from: string;
  message: string;
  read: boolean;
  timestamp: string;
}

export interface Exam {
  id: string;
  course: string;
  title: string;
  date: string;
  daysAway: number;
  weight?: string;
}

export interface WeeklyTelemetry {
  avgSleep: string;
  avgStress: number;
  avgMood: number;
  checkInCount: number;
  totalDays: number;
}
