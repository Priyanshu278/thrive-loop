const router = require('express').Router();
const { Team, User } = require('../models');
const { auth } = require('../middleware');

router.use(auth); // every route below needs a logged-in user

router.post('/', async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const inviteCode = Math.random().toString(36).slice(2, 8).toUpperCase(); // e.g. "K3F9QZ"
    const team = await Team.create({ name: req.body.name, company: user.company, inviteCode });
    user.team = team._id;
    await user.save();
    res.json(team);
  } catch (err) { next(err); }
});

router.post('/join', async (req, res, next) => {
  try {
    const team = await Team.findOne({ inviteCode: (req.body.inviteCode || '').toUpperCase() });
    if (!team) return res.status(404).json({ error: 'Invalid invite code' });
    if (team.company !== req.user.company) return res.status(403).json({ error: 'Invite code is for a different company' });
    await User.findByIdAndUpdate(req.user.id, { team: team._id });
    res.json(team);
  } catch (err) { next(err); }
});

router.get('/mine', async (req, res, next) => {
  try {
    const me = await User.findById(req.user.id).populate('team');
    if (!me || !me.team) return res.json(null);
    const members = await User.find({ team: me.team._id }).select('name'); // names only
    res.json({ team: me.team, members });
  } catch (err) { next(err); }
});

module.exports = router;
