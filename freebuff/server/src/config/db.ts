import mongoose from "mongoose";

let memoryServerInstance: any = null;

export async function connectDatabase(uri?: string): Promise<void> {
  let targetUri = uri;
  if (!targetUri) {
    try {
      console.warn("[freebuff-api] MONGO_URI not provided; launching in-memory MongoDB for local dev...");
      const { createRequire } = await import("node:module");
      const require = createRequire(import.meta.url);
      const { MongoMemoryServer } = require("c:/Users/HP/Downloads/TeamPulse_MERN_Final_Hackathon/teampulse/server/node_modules/mongodb-memory-server");
      memoryServerInstance = await MongoMemoryServer.create();
      targetUri = memoryServerInstance.getUri("freebuff");
      console.log(`[freebuff-api] In-memory MongoDB active: ${targetUri}`);
    } catch (err: any) {
      console.warn("[freebuff-api] Could not start in-memory Mongo:", err?.message);
      throw new Error("MONGO_URI is not set. Add it to server/.env (see .env.example).");
    }
  }
  if (!targetUri) {
    throw new Error("MONGO_URI is not set and memory database could not be initialized.");
  }
  mongoose.set("strictQuery", true);
  await mongoose.connect(targetUri);
}

export type DbState = "connected" | "connecting" | "disconnected";

export function dbState(): DbState {
  switch (mongoose.connection.readyState) {
    case 1:
      return "connected";
    case 2:
      return "connecting";
    default:
      return "disconnected";
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  if (memoryServerInstance) {
    await memoryServerInstance.stop();
  }
}
