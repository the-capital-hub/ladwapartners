import { randomUUID } from "crypto";

const BASE = process.env.GST_API_BASE_URL || "";
const TOKEN = process.env.GST_API_TOKEN;
const SECRET = process.env.GST_API_SECRET;

async function gstRequest(path, body = {}, method = 'POST') {
  if (!BASE || !TOKEN || !SECRET) {
    throw new Error('GST API credentials missing');
  }
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      token: TOKEN,
      secretkey: SECRET,
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
  const payload = {
    request_id: randomUUID(),
    consent: "Y",
    consent_text:
      "I hear by declare my consent agreement for fetching my information via RPACPC API",
    gstNumber: gstin,
    hsnDetails: true,
    branchDetails: true,
    filingDetails: true,
    filingFrequency: true,
    liabilityPaidDetails: true,
  };

  const res = await gstRequest("/services/bv010", payload);
  if (res.status !== "SUCCESS") {
    throw new Error(res.message || "GST verification failed");
  }

  const basic = res.data?.basicDetails || {};
  const filing = res.data?.filingDetails;
  const filingsCurrent = filing?.currentYear?.filingStatus?.[0] || [];
  const filingsPrev = filing?.previousYear?.filingStatus?.[0] || [];
  let lastFiling = null;
  if (filingsCurrent.length > 0) {
    lastFiling = filingsCurrent[0].filingDate;
  } else if (filingsPrev.length > 0) {
    lastFiling = filingsPrev[0].filingDate;
  }

  return {
    gstin: basic.gstin || gstin,
    status: basic.registrationStatus,
    legalName: basic.Legal_Name,
    tradeName: basic.tradeNam,
    pan: gstin.slice(2, 12),
    type: basic.registrationType,
    stateCode: gstin.slice(0, 2),
    lastFiling,
  };
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
