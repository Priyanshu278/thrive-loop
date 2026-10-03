// Entry point: load .env, connect to MongoDB, then start the server.
require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

process.on('uncaughtException', (err) => {
  if (err.code === 'ECONNABORTED' || err.type === 'request.aborted') {
    console.warn('[server] Ignored client connection abort');
    return;
  }
  console.error('[server] Uncaught exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.warn('[server] Unhandled rejection:', reason);
});

async function start() {
  console.log('[server] JWT_SECRET set:', !!process.env.JWT_SECRET, '| length:', (process.env.JWT_SECRET || '').length);
  console.log('[server] MONGO_URI set:', !!process.env.MONGO_URI);

  let dbUri = process.env.MONGO_URI;

  // Dev convenience: with no MONGO_URI configured, run an in-memory MongoDB so
  // the API still boots and every route can return real JSON responses.
  // Never active in production.
  if (!dbUri && process.env.NODE_ENV !== 'production') {
    console.warn('[server] MONGO_URI not set - starting in-memory MongoDB (dev only)');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const memory = await MongoMemoryServer.create();
    dbUri = memory.getUri('teampulse');
    console.log('[server] in-memory MongoDB ready at', dbUri);
  }

  try {
    await mongoose.connect(dbUri);
    console.log('MongoDB connected');
    await seedDefaultData();
  } catch (err) {
    // Old behavior: never listen, so the Vite proxy answered with an empty 500
    // and the browser showed "Unexpected end of JSON input". Now we still
    // listen so clients get a proper JSON error instead of an empty body.
    console.error('DB connection failed:', err.message);
    console.error('[server] HTTP server will start anyway; DB-backed routes will return JSON 500 errors.');
  }

  // Number('0') is 0 (falsy), so an inherited PORT=0 from the shell falls
  // back to 5000 instead of binding to a random port.
  const port = Number(process.env.PORT) || 5000;
  app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
}

async function seedDefaultData() {
  try {
    const bcrypt = require('bcryptjs');
    const { User, Team, Metric } = require('./models');
    const existing = await User.findOne({ email: 'alex@acme.com' });
    if (!existing) {
      console.log('[seed] Seeding initial demo users and teams...');
      const team = await Team.create({
        name: 'Product Engineering',
        company: 'Acme Corp',
        inviteCode: 'PROD-2026',
      });

      const passHash = await bcrypt.hash('password123', 10);
      const alex = await User.create({
        name: 'Alex Morgan',
        email: 'alex@acme.com',
        passwordHash: passHash,
        role: 'employee',
        company: 'Acme Corp',
        team: team._id,
      });

      await User.create({
        name: 'Sarah Connor (HR Admin)',
        email: 'hr@acme.com',
        passwordHash: passHash,
        role: 'hr',
        company: 'Acme Corp',
        team: team._id,
      });

      // Seed 7 days of metrics for Alex
      const today = new Date();
      for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - (6 - i));
        const dateStr = d.toISOString().slice(0, 10);
        await Metric.create({
          user: alex._id,
          date: dateStr,
          steps: 5500 + (i * 420),
          sleepHours: 7.0 + ((i % 3) * 0.4),
          source: 'manual',
        });
      }
      console.log('[seed] Demo data successfully seeded! (alex@acme.com / hr@acme.com : password123)');
    }
  } catch (err) {
    console.warn('[seed] Seed error:', err.message);
  }
}

start();
