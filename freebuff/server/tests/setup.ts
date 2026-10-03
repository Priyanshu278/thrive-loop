// Test environment setup. Runs before any test module loads.
process.env.JWT_SECRET = process.env.JWT_SECRET ?? "test-only-secret";
process.env.CLIENT_URL = process.env.CLIENT_URL ?? "http://localhost:5173";
// AI validation tests expect NO key configured unless the environment provides one.
process.env.CLAUDE_API_KEY = process.env.CLAUDE_API_KEY ?? "";

// Database: tests use the REAL MongoDB configuration only (spec requirement).
// TEST_MONGO_URI overrides MONGO_URI when set. If neither points to a
// reachable MongoDB, DB-dependent tests are skipped with a loud message.
