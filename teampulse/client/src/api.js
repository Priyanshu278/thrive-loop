// One small helper for all API calls. It adds the login token automatically.

// Fallback messages when the server responds with an error status but no
// JSON body. The server's own { error: "..." } always wins when present.
const STATUS_FALLBACKS = {
  400: 'Invalid request',
  401: 'Wrong email or password',
  403: 'Not allowed',
  404: 'API endpoint not found',
  500: 'Server error',
};

const API_BASE = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? '' : 'https://thrive-loop.onrender.com')
).replace(/\/+$/, '');

export async function api(path, method = 'GET', body) {
  let res;
  const url = API_BASE ? `${API_BASE}/api${path}` : `/api${path}`;
  try {
    res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + (localStorage.getItem('token') || ''),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    // fetch itself failed: network down, DNS, refused connection, CORS block.
    throw new Error('Cannot reach the API - is the backend running?');
  }

  // Read the RAW body first. Parsing an empty body with res.json() is what
  // produced "Unexpected end of JSON input" when the backend was down.
  const text = await res.text();

  if (!res.ok && text === '') {
    // Empty error body is what the Vite dev proxy returns when it cannot
    // reach the backend (or the backend crashed without responding).
    throw new Error(
      `Server returned HTTP ${res.status} with an empty body - is the backend running?`
    );
  }

  let data = null;
  if (text !== '') {
    try {
      data = JSON.parse(text);
    } catch {
      // e.g. an HTML "Cannot POST /api/..." page from Express on a bad path.
      throw new Error(`Server returned a non-JSON response (HTTP ${res.status})`);
    }
  }

  if (!res.ok) {
    throw new Error(
      data?.error || STATUS_FALLBACKS[res.status] || `Request failed (HTTP ${res.status})`
    );
  }

  return data;
}
