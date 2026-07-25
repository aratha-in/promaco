import crypto from 'crypto';

const SECRET_KEY = process.env.SESSION_SECRET || 'promacon-secure-secret-key-123456';

export function signSession(username) {
  const expiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  const data = JSON.stringify({ username, expiry });
  const hmac = crypto.createHmac('sha256', SECRET_KEY).update(data).digest('hex');
  return `${Buffer.from(data).toString('base64')}.${hmac}`;
}

export function verifySession(token) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  
  const [dataB64, signature] = parts;
  const data = Buffer.from(dataB64, 'base64').toString('utf8');
  
  const expectedSignature = crypto.createHmac('sha256', SECRET_KEY).update(data).digest('hex');
  if (signature !== expectedSignature) return null;
  
  try {
    const session = JSON.parse(data);
    if (session.expiry < Date.now()) return null; // Expired
    return session;
  } catch (e) {
    return null;
  }
}

export function getSessionFromRequest(req) {
  const cookieHeader = req.headers.get('cookie') || '';
  const cookies = {};
  cookieHeader.split(';').forEach(c => {
    const parts = c.trim().split('=');
    if (parts.length >= 2) {
      const name = parts[0];
      const value = parts.slice(1).join('=');
      cookies[name] = value;
    }
  });
  const token = cookies['promacon_session'];
  return verifySession(token ? decodeURIComponent(token) : null);
}
