const rateLimit = require('express-rate-limit');
const rl = require('express-rate-limit');

const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { auth } = require('../middleware');

const authThrottle = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Slow down.' },
  store: new rl.MemoryStore(),
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Slow down.' },
  store: new rl.MemoryStore(),
});

const registerThrottle = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Slow down.' },
  store: new rl.MemoryStore(),
});

const makeToken = (u) =>
  jwt.sign({ id: u._id, role: u.role, company: u.company }, process.env.JWT_SECRET, { expiresIn: '7d' });

router.post('/register', registerThrottle, async (req, res, next) => {
  try {
    const { name, email, password, company, hrCode } = req.body;
    if (!name || !email || !password || password.length < 6) {
      return res.status(400).json({ error: 'Name, email and a 6+ character password are required' });
    }
    if (await User.findOne({ email })) return res.status(400).json({ error: 'Email already used' });

    // Never trust the client for role. HR needs a secret code that only HR knows.
    const role = hrCode && hrCode === process.env.HR_CODE ? 'hr' : 'employee';
    const passwordHash = await bcrypt.hash(password, 10); // 10 = salt rounds
    const user = await User.create({ name, email, passwordHash, company, role });
    res.json({ token: makeToken(user), name: user.name, role });
  } catch (err) { next(err); }
});

router.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).select('+passwordHash');
    const ok = user && (await bcrypt.compare(req.body.password || '', user.passwordHash));
    if (!ok) return res.status(401).json({ error: 'Wrong email or password' });
    res.json({ token: makeToken(user), name: user.name, role: user.role });
  } catch (err) { next(err); }
});

router.get('/me', auth, async (req, res) => {
  res.json(await User.findById(req.user.id).select('name email role company team').populate('team', 'name inviteCode'));
});

module.exports = router;
