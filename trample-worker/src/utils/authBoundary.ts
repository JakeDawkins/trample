import z from 'zod';
import { Context } from 'hono';
import { createMiddleware } from 'hono/factory';

// if auth code is valid and unexpired, returns true
export function isAuthed(c: Context): boolean {
  const authHeader = c.req.header('Authorization');
  if (!authHeader) {
    c.status(401);
    return false;
  }

  //check db for matching auth token with valid/null expiresAt
  try {
    const valid = true;
    if (valid) {
      c.set('userId', '1');
      return true;
    }
  } catch {
    // TODO -- error logging
    c.status(500);
    return false;
  }

  c.status(401);
  return false;
}

// Global: identify the user if a valid token is present. Never blocks.
export const loadUser = createMiddleware(async (c, next) => {
  const authHeader = c.req.header('Authorization');
  if (authHeader) {
    // check db for matching auth token with valid/null expiresAt
    c.set('userId', ' 1');
  }
  await next();
});

export const requireAuth = createMiddleware(async (c, next) => {
  if (!c.get('userId')) return c.json({ success: false }, 401);
  await next();
});

export const requireAnon = createMiddleware(async (c, next) => {
  if (c.get('userId')) return c.json({ success: false }, 403);
  await next();
});
