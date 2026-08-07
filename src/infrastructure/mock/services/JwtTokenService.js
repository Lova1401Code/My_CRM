// Fake JWT service — base64-encoded payload (NOT secure, mock only).
import { APP } from '../../../core/config/constants.js';

function base64Encode(obj) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(obj))));
}

function base64Decode(str) {
  return JSON.parse(decodeURIComponent(escape(atob(str))));
}

export class JwtTokenService {
  encode(payload) {
    const header = base64Encode({ alg: 'mock', typ: 'JWT' });
    const body = base64Encode({ ...payload, iat: Date.now(), exp: Date.now() + 86400000 });
    const signature = base64Encode({ s: 'mock-signature' });
    return `${header}.${body}.${signature}`;
  }

  decode(token) {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    try {
      const payload = base64Decode(parts[1]);
      if (payload.exp && Date.now() > payload.exp) return null;
      return payload;
    } catch {
      return null;
    }
  }
}

export const tokenService = new JwtTokenService();
export { APP };