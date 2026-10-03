import http from "node:http";
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase, dbState, disconnectDatabase } from "./config/db.js";

async function main(): Promise<void> {
  if (!env.jwtSecret) {
    console.warn("[freebuff-api] JWT_SECRET is not set - auth endpoints will fail until it is added to server/.env");
  }

  try {
    await connectDatabase(env.mongoUri || undefined);
    console.log(`[freebuff-api] MongoDB connected (${dbState()})`);
  } catch (err) {
    console.error("[freebuff-api] MongoDB connection FAILED:", err instanceof Error ? err.message : err);
    console.error("[freebuff-api] Database-backed routes will return JSON 503 errors until it is reachable.");
  }

  const app = createApp();

  const server = http.createServer(app);
  server.listen(env.port, () => {
    console.log(`[freebuff-api] listening on http://localhost:${env.port}`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    console.log(`[freebuff-api] ${signal} received, shutting down`);
    server.close();
    if (dbState() === "connected") await disconnectDatabase();
    process.exit(0);
  };
  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
}

main().catch((err) => {
  console.error("[freebuff-api] failed to start:", err);
  process.exit(1);
});
