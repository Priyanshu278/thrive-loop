# Freebuff — MERN Build (in progress)

Spec: "Freebuff — Full MERN Build Task". Backend complete (v0.2); frontend is
the Step 1 scaffold only and is not part of the current work.

## Backend (freebuff/server)

Node + Express + TypeScript + Mongoose + JWT + bcryptjs + zod + helmet +
express-rate-limit. Structure: `src/{config,models,controllers,routes,middleware,services,utils}`,
`src/app.ts`, `src/server.ts`.

### Routes

| Method | Path | Notes |
| --- | --- | --- |
| GET | /api/health | `{status:"ok", service:"freebuff-api", db, time}` |
| POST | /api/auth/register | rate-limited, zod-validated |
| POST | /api/auth/login | rate-limited, 401 JSON on bad credentials |
| GET | /api/auth/me | protected |
| PATCH | /api/users/me | protected (name, onboardingCompleted) |
| POST/GET | /api/checkins | protected; one per user per day (upsert) |
| GET | /api/checkins/latest, /api/checkins/summary | protected; summary = risk result |
| POST/GET/PATCH/DELETE | /api/exams | protected, ownership-scoped |
| POST | /api/ai/support | protected, rate-limited; Claude via server only |
| POST/GET/DELETE | /api/care-circle(+ /invite) | protected; risk-level word only, max 3 |
| GET | /api/nudges, POST /api/nudges/:id/read | protected; supportive text only |
| GET | /api/privacy | protected; stored/shared transparency |

Risk rules live in `src/services/riskScore.service.ts` (pure function, unit
tested): last-7-record average sleep (<6h +30, <7h +15), strictly falling
latest-3 sleep (+10), average stress (>=4 +25, >=3 +10), average mood (<=2 +20),
latest deadlines (>=3 +10), next upcoming exam (<=3 days +15, <=7 +8);
0-29 low, 30-59 medium, 60+ high. Wellbeing awareness — not a diagnosis.

### Setup

1. `cd freebuff/server && npm install`
2. `cp .env.example .env` — set `MONGO_URI` (Atlas) and optionally
   `CLAUDE_API_KEY`; `JWT_SECRET` must be a long random string.
3. `npm run dev` (or `npm run build && npm start`)

If MongoDB is unreachable the API still boots, logs the failure loudly, and
DB-backed routes return JSON 503 — it never silently swaps in a fake database.

### Verify & test

- `npm run verify` — boots the real server, checks health, error formats,
  auth (when DB is up) and prints the DB status.
- `npm test` — vitest: 19 risk-score unit tests + API integration tests.
  Tests use the real `MONGO_URI`/`TEST_MONGO_URI` only; if MongoDB is not
  reachable they skip with an explicit message instead of mocking.

## Frontend (freebuff/client)

Step 1 scaffold (Vite + React + TS + Router, Home page). Not part of the
current backend-only task.
