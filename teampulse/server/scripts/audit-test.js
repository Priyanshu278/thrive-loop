const http = require('http');

async function request(path, method = 'GET', body = null, token = null) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api' + path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
          ...(token ? { Authorization: 'Bearer ' + token } : {}),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: data ? JSON.parse(data) : null });
          } catch {
            resolve({ status: res.statusCode, raw: data });
          }
        });
      }
    );
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function audit() {
  console.log('=== BACKEND API AUDIT TEST ===');
  
  // 1. Health
  const health = await request('/health');
  console.log('1. Health check:', health.status, health.data);

  // 2. Register HR user
  const email = `audit_${Date.now()}@acme.com`;
  const reg = await request('/auth/register', 'POST', {
    name: 'Audit Officer',
    email,
    password: 'password123',
    company: 'Acme Corp',
    hrCode: 'TEAM-PULSE-HR',
  });
  console.log('2. Register HR user:', reg.status, { name: reg.data?.name, role: reg.data?.role, hasToken: !!reg.data?.token });
  const hrToken = reg.data?.token;

  // 3. Register standard employee
  const empEmail = `emp_${Date.now()}@acme.com`;
  const regEmp = await request('/auth/register', 'POST', {
    name: 'Alex Employee',
    email: empEmail,
    password: 'password123',
    company: 'Acme Corp',
  });
  console.log('3. Register Employee:', regEmp.status, { name: regEmp.data?.name, role: regEmp.data?.role });
  const empToken = regEmp.data?.token;

  // 4. Me endpoint
  const me = await request('/auth/me', 'GET', null, hrToken);
  console.log('4. /auth/me HR:', me.status, { email: me.data?.email, role: me.data?.role, company: me.data?.company });

  // 5. Create Team
  const team = await request('/teams', 'POST', { name: 'Engineering Core' }, hrToken);
  console.log('5. Create Team:', team.status, { team: team.data?.name, inviteCode: team.data?.inviteCode });
  const inviteCode = team.data?.inviteCode;

  // 6. Employee joins team
  const join = await request('/teams/join', 'POST', { inviteCode }, empToken);
  console.log('6. Employee joins team:', join.status, { team: join.data?.name });

  // 7. Check /teams/mine
  const mine = await request('/teams/mine', 'GET', null, empToken);
  console.log('7. /teams/mine:', mine.status, { team: mine.data?.team?.name, memberCount: mine.data?.members?.length, members: mine.data?.members });

  // 8. Log daily metrics
  const metric = await request('/metrics', 'POST', { steps: 8500, sleepHours: 7.2, source: 'manual' }, empToken);
  console.log('8. POST /metrics:', metric.status, { steps: metric.data?.steps, sleepHours: metric.data?.sleepHours });

  // 9. Get week metrics
  const week = await request('/metrics/week', 'GET', null, empToken);
  console.log('9. GET /metrics/week:', week.status, { metricsCount: week.data?.metrics?.length, streak: week.data?.streak, goal: week.data?.goal });

  // 10. Check rescue endpoint
  const rescue = await request('/metrics/rescue', 'POST', null, empToken);
  console.log('10. POST /metrics/rescue:', rescue.status, rescue.data);

  // 11. Generate challenge
  const chal = await request('/challenges/generate', 'POST', { context: 'normal' }, empToken);
  console.log('11. POST /challenges/generate:', chal.status, { title: chal.data?.title, target: chal.data?.target, metric: chal.data?.metric });

  // 12. Active challenge
  const activeChal = await request('/challenges/active', 'GET', null, empToken);
  console.log('12. GET /challenges/active:', activeChal.status, { title: activeChal.data?.title, target: activeChal.data?.target });

  // 13. HR Overview (as HR)
  const hrOverview = await request('/hr/overview', 'GET', null, hrToken);
  console.log('13. GET /hr/overview (HR token):', hrOverview.status, hrOverview.data);

  // 14. HR Overview (as Employee - should be 403 Forbidden)
  const hrForbidden = await request('/hr/overview', 'GET', null, empToken);
  console.log('14. GET /hr/overview (Employee token - testing security):', hrForbidden.status, hrForbidden.data);

  // 15. HR Impact
  const hrImpact = await request('/hr/impact', 'GET', null, hrToken);
  console.log('15. GET /hr/impact:', hrImpact.status, hrImpact.data);

  // 16. HR ROI
  const hrRoi = await request('/hr/roi', 'POST', { employees: 200, price: 5, cost: 12000 }, hrToken);
  console.log('16. POST /hr/roi:', hrRoi.status, hrRoi.data);

  // 17. HR Audit Log
  const hrAudit = await request('/hr/audit', 'GET', null, hrToken);
  console.log('17. GET /hr/audit:', hrAudit.status, hrAudit.data);
}

audit().catch(console.error);
