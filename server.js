// Mama Nkechi: tiny server for the Speko voice demo.
// Serves the web page and creates short-lived Speko sessions so your API key never reaches the browser.
// Run: node server.js   (needs Node.js 18 or newer)
const http = require('http');
const fs = require('fs');
const path = require('path');

// Load .env without extra packages
const envFile = path.join(__dirname, '.env');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
const API_KEY = process.env.SPEKO_API_KEY;
const AGENT_ID = process.env.SPEKO_AGENT_ID;
const BASE = (process.env.SPEKO_BASE_URL || 'https://api.speko.dev').replace(/\/$/, '');
const PORT = Number(process.env.PORT || 3000);

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };

async function createSession(res) {
  if (!API_KEY || !AGENT_ID) {
    return send(res, 500, { error: 'Add SPEKO_API_KEY and SPEKO_AGENT_ID to your .env file, then restart.' });
  }
  try {
    const r = await fetch(`${BASE}/v1/sessions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': crypto.randomUUID() },
      body: JSON.stringify({ mode: 'cascade', agentId: AGENT_ID }),
    });
    const data = await r.json().catch(() => ({}));
    const transportToken = data.transportToken || data.conversationToken;
    const transportUrl = data.transportUrl || data.livekitUrl;
    if (!r.ok || !transportToken || !transportUrl) {
      console.error('Speko session error', r.status, JSON.stringify(data));
      return send(res, 502, { error: data.error?.message || data.message || `Speko returned ${r.status}. Check the terminal for details.` });
    }
    send(res, 200, { transportToken, transportUrl, sessionId: data.sessionId });
  } catch (e) {
    console.error(e);
    send(res, 502, { error: 'Could not reach Speko. Check your internet connection.' });
  }
}

function send(res, code, obj) {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(obj));
}

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/api/session' && req.method === 'POST') return createSession(res);
  const file = path.join(__dirname, 'public', url.pathname === '/' ? 'index.html' : path.normalize(url.pathname));
  if (!file.startsWith(path.join(__dirname, 'public')) || !fs.existsSync(file)) { res.writeHead(404); return res.end('Not found'); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => {
  console.log(`\n  Mama Nkechi is open for business 🛍️\n  → http://localhost:${PORT}\n  → Preview without Speko: http://localhost:${PORT}/?demo=1\n`);
  if (!API_KEY || !AGENT_ID) console.log('  ⚠  Add SPEKO_API_KEY and SPEKO_AGENT_ID to .env to talk to the real agent.\n');
});
