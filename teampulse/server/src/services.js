// Helper logic used by several routes. Plain functions, easy to explain in an interview.
const { User, Metric } = require('./models');

const DAILY_GOAL = 8000;

const dayString = (offset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};

// Counts how many days in a row the user reached the goal.
function calcStreak(metrics, goal = DAILY_GOAL) {
  const hit = new Set(metrics.filter((m) => m.steps >= goal).map((m) => m.date));
  let streak = 0;
  let offset = hit.has(dayString(0)) ? 0 : -1; // today may not be finished, so start from yesterday
  while (hit.has(dayString(offset))) {
    streak++;
    offset--;
  }
  return streak;
}

// Average steps and sleep of a whole team over the last 7 days (MongoDB aggregation).
async function teamAverages(teamId) {
  const members = await User.find({ team: teamId }).select('_id');
  const [result] = await Metric.aggregate([
    { $match: { user: { $in: members.map((m) => m._id) }, date: { $gte: dayString(-7) } } },
    { $group: { _id: null, steps: { $avg: '$steps' }, sleep: { $avg: '$sleepHours' } } },
  ]);
  return { members: members.length, steps: result?.steps || 0, sleep: result?.sleep || 0 };
}

// Adds about +-2% random noise so exact values are harder to trace back to people.
const addNoise = (n) => Math.round(n * (1 + (Math.random() - 0.5) * 0.04));

// Calls Claude and expects JSON back. Returns null on ANY problem so callers use a fallback.
async function askClaude(system, userText) {
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5-5',
        max_tokens: 400,
        system,
        messages: [{ role: 'user', content: userText }],
      }),
    });
    const data = await res.json();
    const text = data.content[0].text.replace(/```json|```/g, '').trim();
    return JSON.parse(text);
  } catch (err) {
    console.log('Claude call failed, using fallback:', err.message);
    return null;
  }
}

module.exports = { DAILY_GOAL, dayString, calcStreak, teamAverages, addNoise, askClaude };
