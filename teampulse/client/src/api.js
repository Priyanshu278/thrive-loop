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

const RENDER_BACKEND_URL = 'https://thrive-loop.onrender.com';

function getApiBaseUrl() {
  const envUrl = import.meta.env.VITE_API_URL;
  // If explicitly configured with a valid full HTTP(S) URL, use it
  if (typeof envUrl === 'string' && (envUrl.startsWith('http://') || envUrl.startsWith('https://'))) {
    return envUrl.trim().replace(/\/+$/, '');
  }

  // Local development on localhost/127.0.0.1 uses relative /api for the local Vite proxy
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return '';
    }
  }

  if (import.meta.env.DEV) {
    return '';
  }

  // Default for all deployed environments (Vercel, custom domain, preview)
  return RENDER_BACKEND_URL;
}

export async function api(path, method = 'GET', body) {
  let res;
  const cleanPath = path.startsWith('/') ? path : '/' + path;
  const base = getApiBaseUrl();
  const url = base ? `${base}/api${cleanPath}` : `/api${cleanPath}`;

  console.log(`[ThriveLoop API] Calling: ${method} ${url}`);
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
