const http = require('http');

function req(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const payload = body == null ? null : JSON.stringify(body);
    const r = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api' + path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload != null ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
        ...(token ? { Authorization: 'Bearer ' + token } : {}),
      },
    }, (res) => {
      let d = '';
      res.on('data', (c) => (d += c));
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(d), text: d }); }
        catch (e) { resolve({ status: res.statusCode, body: null, text: d }); }
      });
    });
    r.on('error', reject);
    if (payload) r.write(payload);
    r.end();
  });
}

async function main() {
  let pass = 0, fail = 0;
  const ok = (n, c, d) => { if (c) { pass++; console.log('PASS  ' + n); } else { fail++; console.log('FAIL  ' + n + (d ? '  -> ' + d : '')); } };
  const now = Date.now();

  console.log('=== 1. Register two users in different companies ===');
  const ra = await req('POST', '/auth/register', { name: 'Alice Acme', email: 'alice-' + now + '@acme.com', password: 'password123', company: 'Acme Corp' });
  ok('register Alice', ra.status === 200 && ra.body.role === 'employee', ra.status + ' ' + JSON.stringify(ra.body).slice(0,120));
  const tokenA = ra.body && ra.body.token || '';
  const rb = await req('POST', '/auth/register', { name: 'Bob Globex', email: 'bob-' + now + '@globex.com', password: 'password123', company: 'Globex Corp' });
  ok('register Bob', rb.status === 200 && rb.body.role === 'employee', rb.status + ' ' + JSON.stringify(rb.body).slice(0,120));
  const tokenB = rb.body && rb.body.token || '';

  console.log('=== 2. Alice creates a team (Acme) ===');
  const rc = await req('POST', '/teams', { name: 'Acme Wellbeing' }, tokenA);
  ok('Alice creates team', rc.status === 200 && rc.body.inviteCode && rc.body.inviteCode.length >= 5, rc.status + ' ' + JSON.stringify(rc.body).slice(0,120));
  const inviteA = rc.body && rc.body.inviteCode || '';
  const teamIdA = rc.body && rc.body._id || '';

  console.log('=== 3. Bob (different company) tries to join Alice\'s team via invite code (IDOR/cross-company) ===');
  const rd = await req('POST', '/teams/join', { inviteCode: inviteA }, tokenB);
  ok('Bob joins team via invite code (IDOR — different company)', rd.status === 200, rd.status + ' ' + JSON.stringify(rd.body).slice(0,120));
  const rm = await req('GET', '/teams/mine', null, tokenB);
  ok('Bob\'s team is now Alice\'s Acme team (cross-company data-integrity leak)', rm.status === 200 && rm.body && rm.body.team && rm.body.team._id === teamIdA, rm.status + ' ' + JSON.stringify(rm.body).slice(0,200));

  console.log('=== 4. Register HR user with publicly-known HR_CODE (privilege escalation) ===');
  const re = await req('POST', '/auth/register', { name: 'Eve HR', email: 'eve-' + now + '@acme.com', password: 'password123', company: 'Acme Corp', hrCode: 'TEAM-PULSE-HR' });
  ok('register as HR using known HR_CODE', re.status === 200 && re.body.role === 'hr', re.status + ' ' + JSON.stringify(re.body).slice(0,120));
  const tokenC = re.body && re.body.token || '';

  console.log('=== 5. HR accesses /hr/overview (should be aggregate, no individual data) ===');
  const ro = await req('GET', '/hr/overview', null, tokenC);
  ok('HR overview returns 200', ro.status === 200, ro.status + ' ' + JSON.stringify(ro.body).slice(0,300));
  const rows = ro.body && ro.body;
  const hasIndividual = rows && rows.some(r => (r.name && !(r.name === 'Acme Wellbeing' || r.team)) || (r.steps !== undefined && r.steps !== null) || (r.sleep !== undefined && r.sleep !== null));
  ok('HR overview has NO individual name/step rows (aggregate only)', !hasIndividual && Array.isArray(rows), JSON.stringify(rows).slice(0,400));

  console.log('=== 6. Forge JWT with wrong secret (auth bypass attempt) ===');
  const jwt = require('jsonwebtoken');
  let forged;
  try { forged = jwt.sign({ id: 'fake-id', role: 'hr', company: 'Acme' }, 'wrong-secret', { expiresIn: '7d' }); } catch (e) { forged = null; }
  const rf = await req('GET', '/auth/me', null, forged);
  ok('forged JWT (wrong secret) -> 401', rf.status === 401, rf.status + ' ' + JSON.stringify(rf.body).slice(0,120));

  console.log('=== 7. Steps edge cases (input validation) ===');
  const rn = await req('POST', '/metrics', { steps: -1, sleepHours: 7 }, tokenA);
  ok('steps=-1 -> 400', rn.status === 400, rn.status + ' ' + rn.text.slice(0,80));
  const rn2 = await req('POST', '/metrics', { steps: 100001, sleepHours: 7 }, tokenA);
  ok('steps=100001 -> 400', rn2.status === 400, rn2.status + ' ' + rn2.text.slice(0,80));
  const rn3 = await req('POST', '/metrics', { steps: 'not-a-number', sleepHours: 7 }, tokenA);
  ok('steps=string-non-numeric -> Number()->NaN -> ||0 -> 0 -> accepted (validation allows 0)', rn3.status === 200, rn3.status + ' ' + rn3.text.slice(0,80));
  const rn4 = await req('POST', '/metrics', { steps: {}, sleepHours: 7 }, tokenA);
  ok('steps={} -> Number({})=NaN -> ||0 -> 0 -> accepted', rn4.status === 200, rn4.status + ' ' + rn4.text.slice(0,80));

  console.log('=== 8. NoSQL injection attempt on login email ($ne) ===');
  const rj = await req('POST', '/auth/login', { email: { $ne: null }, password: 'anything' });
  ok('NoSQL injection email={$ne:null} -> 401 (no bypass; Mongoose casts to string)', rj.status === 401, rj.status + ' ' + JSON.stringify(rj.body).slice(0,120));

  console.log('=== 9. Login with undefined email (Mongoose omits field -> findOne({})) ===');
  const rk = await req('POST', '/auth/login', {}, 'anything');
  ok('undefined email -> Mongoose omits field -> findOne({}) returns first user -> but password compare fails -> 401', rk.status === 401, rk.status + ' ' + JSON.stringify(rk.body).slice(0,120));

  console.log('\n=== SUMMARY: pass=' + pass + ' fail=' + fail + ' ===');
  process.exit(fail > 0 ? 1 : 0);
}

main().catch((e) => { console.error('CRASH', e); process.exit(1); });
