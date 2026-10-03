// End-to-end login smoke test.
// Spawns the real server (src/server.js), then exercises the auth endpoints:
//   - directly on :5000
//   - through the Vite dev proxy on :5173 (the path the browser actually uses)
// Prints status, content-type and raw body for every case, then exits 0/1.
const { spawn } = require('child_process');

const DIRECT = 'http://localhost:5000';
const PROXY = 'http://localhost:5173';
const EMAIL = `smoke-${Date.now()}@acme.com`;
const PASSWORD = 'password123';
const results = [];

function check(name, cond, detail) {
  results.push({ name, ok: !!cond, detail });
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${detail ? '  -> ' + detail : ''}`);
}

async function waitForServer(base, tries = 120) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(base + '/api/health');
      if (r.ok) return true;
    } catch {}
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

async function call(base, path, options = {}) {
  const res = await fetch(base + path, {
    method: options.method || 'GET',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
  const text = await res.text();
  const contentType = res.headers.get('content-type') || '';
  let json = null;
  let jsonOk = false;
  if (text !== '') {
    try { json = JSON.parse(text); jsonOk = true; } catch { jsonOk = false; }
  }
  return { status: res.status, contentType, text, json, jsonOk };
}

async function main() {
  const server = spawn(process.execPath, ['src/server.js'], {
    cwd: __dirname + '/..',
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, PORT: '5000' }, // pin the port for the test
  });
  server.stdout.on('data', (d) => process.stdout.write('[server] ' + d));
  server.stderr.on('data', (d) => process.stdout.write('[server:err] ' + d));

  try {
    check('backend /api/health responds', await waitForServer(DIRECT));

    // 1. Register a fresh user (seed accounts are created via register).
    const reg = await call(DIRECT, '/api/auth/register', {
      method: 'POST',
      body: { name: 'Smoke Test', email: EMAIL, password: PASSWORD, company: 'Acme Corp' },
    });
    check('register -> 200 JSON with token', reg.status === 200 && reg.jsonOk && !!reg.json?.token,
      JSON.stringify(reg.json));

    // 2. Login with correct credentials (direct).
    const loginOk = await call(DIRECT, '/api/auth/login', {
      method: 'POST',
      body: { email: EMAIL, password: PASSWORD },
    });
    check('login correct -> 200 JSON {token,name,role}',
      loginOk.status === 200 && loginOk.jsonOk && !!loginOk.json?.token && loginOk.json?.role,
      JSON.stringify(loginOk.json));

    // 3. Login with WRONG password -> 401 + JSON error (no empty body).
    const loginBad = await call(DIRECT, '/api/auth/login', {
      method: 'POST',
      body: { email: EMAIL, password: 'wrong-password' },
    });
    check('login wrong password -> 401 JSON {error}',
      loginBad.status === 401 && loginBad.jsonOk && loginBad.json?.error === 'Wrong email or password',
      loginBad.text);

    // 4. Login with missing/empty body -> still valid JSON, no crash.
    const loginEmpty = await call(DIRECT, '/api/auth/login', { method: 'POST', body: {} });
    check('login empty body -> 401 JSON (no empty response, no 500 HTML)',
      loginEmpty.status === 401 && loginEmpty.jsonOk,
      `${loginEmpty.status} ${loginEmpty.text}`);

    // 5. Unknown endpoint -> Express default 404 (HTML). Client must map it.
    const notFound = await call(DIRECT, '/api/auth/nope', { method: 'POST', body: {} });
    check('unknown endpoint -> 404 (non-JSON documented)', notFound.status === 404,
      `${notFound.status} ${notFound.contentType}`);

    // 6. The REAL browser path: same calls through the Vite proxy on 5173.
    const proxyOk = await call(PROXY, '/api/auth/login', {
      method: 'POST',
      body: { email: EMAIL, password: PASSWORD },
    });
    check('login via Vite proxy -> 200 JSON', proxyOk.status === 200 && proxyOk.jsonOk && !!proxyOk.json?.token,
      JSON.stringify(proxyOk.json));

    const proxyBad = await call(PROXY, '/api/auth/login', {
      method: 'POST',
      body: { email: EMAIL, password: 'nope' },
    });
    check('wrong password via Vite proxy -> 401 JSON {error}',
      proxyBad.status === 401 && proxyBad.jsonOk && !!proxyBad.json?.error,
      proxyBad.text);

    const failed = results.filter((r) => !r.ok).length;
    console.log(`\n${results.length - failed}/${results.length} checks passed`);
    process.exitCode = failed ? 1 : 0;
  } finally {
    server.kill('SIGTERM');
  }
}

main().catch((err) => {
  console.error('smoke test crashed:', err);
  process.exit(1);
});
