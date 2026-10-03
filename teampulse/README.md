# TeamPulse — MERN Hackathon Build

AI workplace wellbeing product: team challenges + Habit Rescue + privacy-first HR analytics.

## Stack
React + Vite | Node.js + Express | MongoDB + Mongoose | JWT + bcrypt | Claude API (server-side)

## Run
1. Create MongoDB Atlas database.
2. `cd server` -> `cp .env.example .env` and fill `MONGO_URI`, `JWT_SECRET`, optional `ANTHROPIC_API_KEY`, and `HR_CODE`.
3. `npm install && npm run dev`.
4. In another terminal: `cd client && npm install && npm run dev`.
5. Open the Vite URL.

## Demo flow
Register -> create/join team -> Seed demo data -> Generate challenge -> open Team -> open Insights -> trigger Habit Rescue when applicable -> if HR, open HR Dashboard -> show Privacy -> Impact -> ROI.

## Important
The web MERN version does not pretend to access Android Health Connect. Manual entry and seeded demo data are available. A real Health Connect integration requires a native Android bridge/client.

## Learn it
Read `LEARN_THIS_PROJECT.md`. It explains the MERN request flow, authentication, database, AI, privacy and interview story.

## API map
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me`
- POST `/api/teams`
- POST `/api/teams/join`
- GET `/api/teams/mine`
- POST `/api/metrics`
- GET `/api/metrics/week`
- POST `/api/metrics/rescue`
- POST `/api/metrics/rescue/:id/recovered`
- POST `/api/challenges/generate`
- GET `/api/challenges/active`
- POST `/api/challenges/:id/result`
- GET `/api/hr/overview`
- GET `/api/hr/impact`
- GET `/api/hr/audit`
- POST `/api/hr/roi`
- POST `/api/demo/seed`
- GET `/api/demo/health-connect`
