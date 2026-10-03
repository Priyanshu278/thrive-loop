# TeamPulse — MERN Learning Manual

## Goal
This project is deliberately written so a student can understand it. Do not memorize code. Learn the flow.

## 1. The MERN picture

React (client) -> fetch() -> Express route -> middleware -> service/business logic -> Mongoose model -> MongoDB -> JSON response -> React state -> UI.

Example: saving today's steps:
1. User enters steps in React.
2. `api('/metrics','POST',...)` sends JSON with the JWT.
3. Express receives `/api/metrics`.
4. `auth` middleware verifies the JWT and gives the route the user id.
5. The metrics route validates values.
6. Mongoose `findOneAndUpdate(..., {upsert:true})` creates or updates today's document.
7. MongoDB stores the metric.
8. Server returns JSON.
9. React reloads the week and updates the dashboard.

## 2. What each technology does

- React: builds the user interface from components and state.
- Vite: development server and frontend build tool.
- Node.js: runs JavaScript on the server.
- Express: HTTP API framework; routes requests to backend logic.
- MongoDB: stores documents.
- Mongoose: gives MongoDB schemas/models and query helpers.
- JWT: proves who is logged in without storing a server session.
- bcrypt: hashes passwords before storage.
- Claude API: creates the team challenge/rescue wording; it is called only by the server.

## 3. Important files

### Client
- `client/src/App.jsx` — screen composition, state and API calls.
- `client/src/api.js` — one small helper for authenticated HTTP requests.
- `client/src/styles.css` — visual system and responsive UI.

### Server
- `server/src/server.js` — connects MongoDB and starts Express.
- `server/src/app.js` — registers middleware and API routes.
- `server/src/middleware.js` — JWT authentication, HR authorization, error handler.
- `server/src/models.js` — MongoDB/Mongoose models.
- `server/src/services.js` — reusable calculations, aggregation, privacy noise and Claude call.
- `server/src/routes/auth.js` — signup/login/current user.
- `server/src/routes/teams.js` — create/join/view team.
- `server/src/routes/metrics.js` — daily steps/sleep, streak and Habit Rescue.
- `server/src/routes/challenges.js` — AI challenge generation and learning from recent results.
- `server/src/routes/hr.js` — privacy-safe HR analytics, impact, audit and ROI estimate.
- `server/src/routes/demo.js` — seed demo data and explain Health Connect boundary on the web build.

## 4. Database concepts to understand

Collections: User, Team, Metric, Challenge, ChallengeResult, Rescue, AuditLog.

The `Metric` unique index on `(user,date)` prevents duplicate daily entries. Upsert makes the save operation safe to repeat.

## 5. Authentication flow

Register/login -> bcrypt verifies password -> server signs JWT -> browser stores token -> `api.js` sends `Authorization: Bearer <token>` -> `auth` middleware verifies token -> protected route runs.

## 6. AI flow

React never receives the Anthropic API key.

React -> `/api/challenges/generate` -> server calculates team averages -> server sends only team-level context to Claude -> JSON is validated -> safe fallback is used if AI fails -> challenge saved in MongoDB -> React displays it.

Habit Rescue follows the same server-side pattern.

## 7. Privacy architecture

HR is never allowed to request individual metric rows. The HR endpoint calculates team aggregates. Teams with fewer than 5 members are hidden. Eligible averages receive small random noise to reduce exact-value inference. HR access is logged in `AuditLog`.

## 8. Health Connect reality

The original product concept uses Android Health Connect. A browser MERN app cannot honestly pretend to read Android Health Connect directly. This build therefore has:
- manual entry for the MERN web version;
- seeded demo data marked as `health_connect_demo` for a realistic hackathon demo;
- `/api/demo/health-connect` which explicitly reports that a native Android bridge is required for real device access.

If you later make the Android native client, that client can read Health Connect and send permitted metrics to this backend.

## 9. AI learning loop

Each challenge can receive a completion percentage and thumbs feedback. The next generation looks at the latest three results:
- average completion > 80% -> target can increase about 10%;
- average completion < 40% -> target can decrease about 10%;
- otherwise keep the baseline.

This is a simple, explainable feedback loop—not a claim of machine learning training.

## 10. HR ROI estimator

It calculates an editable estimate:
annual program cost = employees × monthly price × 12
break-even prevented resignations = ceil(annual program cost / estimated cost of one resignation)

It is clearly labelled as an estimate, not a promise.

## 11. What you should be able to explain after the course

1. What MERN means.
2. What an HTTP request is.
3. GET vs POST.
4. What Express routes do.
5. Middleware and JWT.
6. Why passwords are hashed.
7. MongoDB documents and Mongoose models.
8. CRUD and upsert.
9. React state and props.
10. Why API calls belong outside UI markup when they become complex.
11. How frontend and backend connect.
12. Why API keys stay on the server.
13. How an aggregation computes team averages.
14. Why the HR endpoint must not return raw user rows.
15. How AI fallback prevents a broken app when Claude fails.
16. How to test and deploy the application.

## 12. Interview explanation

Use your own words. A good 30-second explanation is:

“TeamPulse is a MERN workplace wellbeing product. React handles the employee and HR interfaces, Express exposes protected REST APIs, MongoDB stores users, teams and wellbeing metrics, and Claude is called only from the Node backend. The interesting part is the privacy architecture: HR receives only team-level aggregates, groups under five are hidden, and individual metrics never go to the HR UI. Habit Rescue and adaptive team challenges make the product more useful than a static dashboard.”
