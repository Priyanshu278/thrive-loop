const router = require('express').Router();
const { Challenge, User, ChallengeResult, Team } = require('../models');
const { auth } = require('../middleware');
const { teamAverages, askClaude } = require('../services');

router.use(auth);

// Helper to ensure user has a team so they can participate in team challenges seamlessly
async function ensureUserTeam(userId) {
  const me = await User.findById(userId);
  if (!me.team) {
    let team = await Team.findOne({ company: me.company });
    if (!team) {
      const inviteCode = Math.random().toString(36).slice(2, 8).toUpperCase();
      team = await Team.create({
        name: 'Product & Design Squad',
        company: me.company || 'Acme Corp',
        inviteCode
      });
    }
    me.team = team._id;
    await me.save();
  }
  return me;
}

const SYSTEM = `Create one weekly workplace wellbeing challenge. Return ONLY JSON with title,description,metric,target,tip. Target should be 10-15% above the team average. Context can be deadline_week, heat, rain or normal. Prefer sleep/light walking during deadline weeks. No medical, diet, weight or shame language.`;

// POST /challenges/start - Start or activate the team challenge
router.post('/start', async (req, res, next) => {
  try {
    const me = await ensureUserTeam(req.user.id);
    let challenge = await Challenge.findOne({ team: me.team }).sort('-createdAt');
    if (!challenge) {
      challenge = await Challenge.create({
        team: me.team,
        title: req.body.title || 'Walk together this week',
        description: req.body.description || 'Small steps together create big change without competition.',
        tip: req.body.tip || 'Take a 10-minute walk after lunch.',
        metric: 'steps',
        target: 8400,
        context: 'normal'
      });
    }
    // Record user participation result
    await ChallengeResult.create({
      challenge: challenge._id,
      user: me._id,
      completionPct: 15,
      thumbs: 'up'
    });
    res.json({ ok: true, active: true, challenge });
  } catch (e) { next(e); }
});

router.post('/generate', async (req, res, next) => {
  try {
    const me = await ensureUserTeam(req.user.id);
    const avg = await teamAverages(me.team);
    const allowedContexts = ['normal', 'deadline_week', 'heat', 'rain'];
    const context = allowedContexts.includes(req.body.context) ? req.body.context : 'normal';
    const recent = await ChallengeResult.find({}).sort('-createdAt').limit(3);
    let adjustment = 1;
    if (recent.length) {
      const avgCompletion = recent.reduce((a, r) => a + r.completionPct, 0) / recent.length;
      if (avgCompletion > 80) adjustment = 1.1;
      else if (avgCompletion < 40) adjustment = 0.9;
    }
    const ai = await askClaude(SYSTEM, `Team average: ${Math.round(avg.steps)} steps/day, ${avg.sleep.toFixed(1)} hours sleep. Context: ${context}. Difficulty adjustment: ${adjustment}.`);
    const valid = ai && ai.title && ['steps', 'sleep'].includes(ai.metric) && Number(ai.target) > 0;
    const data = valid
      ? { title: ai.title, description: ai.description, tip: ai.tip, metric: ai.metric, target: Math.round(Number(ai.target) * adjustment), context }
      : { title: 'Walk together this week', description: 'Add a little movement together without turning it into a competition.', tip: 'Try a 10-minute walk after lunch.', metric: 'steps', target: Math.round((avg.steps || 5000) * 1.1 * adjustment), context };
    res.json(await Challenge.create({ team: me.team, ...data }));
  } catch (e) { next(e); }
});

router.get('/active', async (req, res, next) => {
  try {
    const me = await User.findById(req.user.id);
    if (!me || !me.team) return res.json(null);
    res.json(await Challenge.findOne({ team: me.team }).sort('-createdAt'));
  } catch (e) { next(e); }
});

router.post('/:id/result', async (req, res, next) => {
  try {
    const me = await User.findById(req.user.id);
    if (!me) return res.status(401).json({ error: 'Unauthorized' });
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ error: 'Challenge not found' });
    if (String(challenge.team) !== String(me.team)) return res.status(403).json({ error: 'Not your team' });
    const completionPct = Math.max(0, Math.min(100, Number(req.body.completionPct) || 0));
    const thumbs = ['up', 'down', 'none'].includes(req.body.thumbs) ? req.body.thumbs : 'none';
    res.json(await ChallengeResult.create({ challenge: challenge._id, user: me._id, completionPct, thumbs }));
  } catch (e) { next(e); }
});

module.exports = router;
