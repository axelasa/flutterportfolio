// Netlify Function: contact proxy.
//
// Keeps the EmailJS public key server-side, validates the request, and adds
// best-effort rate limiting per instance. Configure these environment
// variables in the Netlify dashboard for full control:
//
//   EMAILJS_SERVICE_ID       default: service_pcasi2i
//   EMAILJS_TEMPLATE_ID      default: template_xdu0ukg
//   EMAILJS_PUBLIC_KEY       default: the current client-side key
//   CONTACT_ALLOWED_ORIGINS  comma-separated list, e.g. https://your-site.netlify.app
//
// Until CONTACT_ALLOWED_ORIGINS is set, any origin may post (matching the
// previous client-side behaviour). The site falls back to calling EmailJS
// directly whenever this function is unavailable, so deploys keep working.

const EMAILJS_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send';
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const hits = new Map();

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

function rateLimited(key) {
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) return true;
  recent.push(now);
  hits.set(key, recent);
  return false;
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return json(405, { ok: false, error: 'Method not allowed' });
  }

  const headers = event.headers || {};
  const origin = headers.origin || '';
  const allowed = (process.env.CONTACT_ALLOWED_ORIGINS || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  if (allowed.length && !allowed.includes(origin)) {
    return json(403, { ok: false, error: 'Origin not allowed' });
  }

  const ip =
    headers['x-nf-client-connection-ip'] ||
    (headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    'unknown';
  if (rateLimited(ip)) {
    return json(429, { ok: false, error: 'Too many requests' });
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { ok: false, error: 'Invalid JSON' });
  }
  const values = {
    name: String(body.name || '').trim(),
    email: String(body.email || '').trim(),
    subject: String(body.subject || '').trim(),
    message: String(body.message || '').trim(),
  };
  if (
    !values.name ||
    !values.email ||
    !values.message ||
    values.name.length > 100 ||
    values.email.length > 254 ||
    values.subject.length > 200 ||
    values.message.length > 5000
  ) {
    return json(400, { ok: false, error: 'Missing or invalid fields' });
  }

  try {
    const response = await fetch(EMAILJS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: process.env.EMAILJS_SERVICE_ID || 'service_pcasi2i',
        template_id: process.env.EMAILJS_TEMPLATE_ID || 'template_xdu0ukg',
        user_id: process.env.EMAILJS_PUBLIC_KEY || 'WAO4wGj4STwDt2c8r',
        template_params: {
          user_name: values.name,
          user_email: values.email,
          user_subject: values.subject || 'New project inquiry',
          user_message: values.message,
        },
      }),
    });
    if (!response.ok) {
      return json(502, { ok: false, error: 'Upstream provider rejected' });
    }
    return json(200, { ok: true });
  } catch {
    return json(502, { ok: false, error: 'Upstream provider unreachable' });
  }
}
