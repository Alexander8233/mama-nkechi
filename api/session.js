// Vercel serverless function: creates a short-lived Speko session.
// Set SPEKO_API_KEY and SPEKO_AGENT_ID in Vercel → Project → Settings → Environment Variables.
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });
  const key = process.env.SPEKO_API_KEY, agentId = process.env.SPEKO_AGENT_ID;
  const base = (process.env.SPEKO_BASE_URL || 'https://api.speko.dev').replace(/\/$/, '');
  if (!key || !agentId) return res.status(500).json({ error: 'Server is missing SPEKO_API_KEY or SPEKO_AGENT_ID.' });
  try {
    const r = await fetch(`${base}/v1/sessions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', 'Idempotency-Key': globalThis.crypto.randomUUID() },
      body: JSON.stringify({ mode: 'cascade', agentId }),
    });
    const data = await r.json().catch(() => ({}));
    const transportToken = data.transportToken || data.conversationToken;
    const transportUrl = data.transportUrl || data.livekitUrl;
    if (!r.ok || !transportToken || !transportUrl) {
      console.error('Speko session error', r.status, JSON.stringify(data));
      return res.status(502).json({ error: data.error?.message || data.message || `Speko returned ${r.status}` });
    }
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ transportToken, transportUrl, sessionId: data.sessionId });
  } catch (e) {
    console.error(e);
    return res.status(502).json({ error: 'Could not reach Speko.' });
  }
};
