const BASE = process.env.GST_API_BASE_URL || '';
const TOKEN = process.env.GST_API_TOKEN;
const SECRET = process.env.GST_API_SECRET;

async function gstRequest(path, body = {}, method = 'POST') {
  if (!BASE || !TOKEN || !SECRET) {
    throw new Error('GST API credentials missing');
  }
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-token': TOKEN,
      'x-secret': SECRET,
    },
    body: method === 'GET' ? undefined : JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GST API error: ${res.status} ${text}`);
  }
  return res.json();
}

export async function verifyGSTIN(gstin) {
  return gstRequest('/gst/verify', { gstin });
}

export async function lookupGSTINFromPAN(pan) {
  return gstRequest('/pan/gstin', { pan });
}

export async function check206AB(pan) {
  try {
    return await gstRequest('/compliance/206ab', { pan });
  } catch (err) {
    return null;
  }
}

export function namesMatch(a, b) {
  if (!a || !b) return false;
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}
