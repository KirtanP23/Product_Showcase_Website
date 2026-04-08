import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const SECRET = process.env.JWT_SECRET;

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '1d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (e) {
    return null;
  }
}

export function setCookie(res, name, value, options = {}) {
  const stringValue =
    typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value);

  const cookieOptions = { ...options };

  if ('maxAge' in cookieOptions) {
    cookieOptions.maxAge = Math.floor(cookieOptions.maxAge / 1000); // Convert ms to seconds
  }

  res.setHeader('Set-Cookie', serialize(name, String(stringValue), cookieOptions));
}

export function clearCookie(res, name) {
  res.setHeader('Set-Cookie', serialize(name, '', {
    maxAge: -1,
    path: '/',
  }));
}
