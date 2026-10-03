import { z } from "zod";
import { env } from "../config/env.js";
import { ApiError } from "../utils/httpError.js";
import type { RiskLevel } from "./riskScore.service.js";

export interface AiSupportInput {
  level: RiskLevel;
  /** Top reasons already ordered by importance; only the first 2 are sent. */
  reasons: string[];
  daysUntilNextExam: number | null;
}

export interface AiSupportResult {
  message: string;
  action: string;
  /** "ai" when Claude produced it, "fallback" when the fixed message was used. */
  source: "ai" | "fallback";
}

const aiResponseSchema = z.object({
  message: z.string().min(1).max(400),
  action: z.string().min(1).max(200),
});

const SYSTEM_PROMPT = `You write short supportive messages for students using a burnout-awareness app.
Rules:
- "message": at most 2 sentences, warm and supportive.
- "action": exactly one practical thing the student can do in about 10 minutes.
- Supportive tone only. No diagnosis, no medical advice, no fear-based or guilt-based language.
- Do not mention specific sleep hours, stress levels, scores or any raw data.
- Reply with ONLY a JSON object: {"message": "...", "action": "..."} and nothing else.`;

/** Fixed per-level fallback if Claude is unavailable or returns unusable output. */
const FALLBACKS: Record<RiskLevel, { message: string; action: string }> = {
  low: {
    message: "Things look steady for you right now. Keep listening to what your body needs.",
    action: "Take a 10-minute walk outside without your phone.",
  },
  medium: {
    message: "It sounds like this week has been demanding. Small resets can help a lot.",
    action: "Pick one task, set a 10-minute timer, and take a short break when it rings.",
  },
  high: {
    message: "The last few days seem heavy. Be kind to yourself — you do not have to fix everything today.",
    action: "Choose the single most important task and do just 10 minutes of it, then rest.",
  },
};

export async function getAiSupport(input: AiSupportInput): Promise<AiSupportResult> {
  if (!env.claudeApiKey) {
    throw ApiError.serviceUnavailable(
      "AI support is not configured: CLAUDE_API_KEY is missing from the server environment"
    );
  }

  try {
    const userPrompt = [
      `Current risk level: ${input.level}.`,
      input.reasons.length > 0
        ? `Main reasons (highest first): ${input.reasons.slice(0, 2).join("; ")}.`
        : "No specific reasons recorded.",
      input.daysUntilNextExam !== null
        ? `Days until the next exam: ${input.daysUntilNextExam}.`
        : "No upcoming exams recorded.",
      "Write the supportive JSON response now.",
    ].join("\n");

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": env.claudeApiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: env.claudeModel,
        max_tokens: 200,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Claude API responded with HTTP ${response.status}`);
    }

    const data = (await response.json()) as {
      content?: Array<{ type: string; text?: string }>;
    };
    const text = data.content?.find((part) => part.type === "text")?.text ?? "";

    // Claude may wrap the JSON in prose or code fences — extract the first object.
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Claude response did not contain JSON");

    const parsed = aiResponseSchema.parse(JSON.parse(jsonMatch[0]));
    return { message: parsed.message, action: parsed.action, source: "ai" };
  } catch (err) {
    if (err instanceof ApiError) throw err;
    console.error("[freebuff-api] AI support failed, using labeled fallback:", err);
    // Labeled fallback per spec — never pretends to be a real AI answer.
    const fb = FALLBACKS[input.level];
    return { ...fb, source: "fallback" };
  }
}
