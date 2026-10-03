import type { Application } from "express";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import { dbState } from "./config/db.js";
import { notFoundHandler, errorHandler } from "./middleware/error.middleware.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import checkinRoutes from "./routes/checkin.routes.js";
import examRoutes from "./routes/exam.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import careCircleRoutes from "./routes/careCircle.routes.js";
import nudgeRoutes from "./routes/nudge.routes.js";
import privacyRoutes from "./routes/privacy.routes.js";
import counsellorRoutes from "./routes/counsellor.routes.js";
import demoRoutes from "./routes/demo.routes.js";

export function createApp(): Application {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.clientUrl }));
  app.use(express.json({ limit: "100kb" }));

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "freebuff-api",
      db: dbState(),
      time: new Date().toISOString(),
    });
  });

  // When the DB is down, DB-backed routes must still answer with JSON 503s.
  // Health and unknown routes (404) do not need the database.
  const DB_BACKED_PREFIXES = [
    "/api/auth",
    "/api/users",
    "/api/checkins",
    "/api/exams",
    "/api/ai",
    "/api/care-circle",
    "/api/nudges",
    "/api/privacy",
    "/api/counsellor",
    "/api/demo",
  ];
  app.use((req, res, next) => {
    const needsDb = DB_BACKED_PREFIXES.some((p) => req.path === p || req.path.startsWith(p + "/"));
    if (needsDb && dbState() !== "connected") {
      res.status(503).json({ error: "Database is not connected - check MONGO_URI on the server" });
      return;
    }
    next();
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/checkins", checkinRoutes);
  app.use("/api/exams", examRoutes);
  app.use("/api/ai", aiRoutes);
  app.use("/api/care-circle", careCircleRoutes);
  app.use("/api/nudges", nudgeRoutes);
  app.use("/api/privacy", privacyRoutes);
  app.use("/api/counsellor", counsellorRoutes);
  app.use("/api/demo", demoRoutes);

  app.use("/api", notFoundHandler);
  app.use(errorHandler);

  return app;
}
