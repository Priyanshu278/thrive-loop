// Builds the Express app. Kept separate from server.js so it is easy to test.
const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middleware');

const app = express();
app.use(cors());
app.use(express.json()); // lets us read req.body as JSON

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/teams', require('./routes/teams'));
app.use('/api/metrics', require('./routes/metrics'));
app.use('/api/challenges', require('./routes/challenges'));
app.use('/api/hr', require('./routes/hr'));
app.use('/api/demo', require('./routes/demo'));

app.use(errorHandler); // must be LAST so it catches errors from everything above
module.exports = app;
