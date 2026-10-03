import dotenv from "dotenv";
import path from "node:path";

// Load .env from the server directory regardless of the process cwd.
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export const env = {
  port: Number(process.env.PORT) || 4000,
  nodeEnv: process.env.NODE_ENV ?? "development",
  mongoUri: process.env.MONGO_URI ?? "",
  jwtSecret: process.env.JWT_SECRET ?? "",
  claudeApiKey: process.env.CLAUDE_API_KEY ?? "",
  claudeModel: process.env.CLAUDE_MODEL ?? "claude-sonnet-4-5",
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:5173",
};
