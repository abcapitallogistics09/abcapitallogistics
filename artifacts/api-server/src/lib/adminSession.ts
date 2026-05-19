import { randomBytes } from "crypto";

const sessions = new Map<string, { createdAt: number }>();
const SESSION_TTL = 24 * 60 * 60 * 1000;

export function createSession(): string {
  const token = randomBytes(32).toString("hex");
  for (const [k, v] of sessions) {
    if (Date.now() - v.createdAt > SESSION_TTL) sessions.delete(k);
  }
  sessions.set(token, { createdAt: Date.now() });
  return token;
}

export function validateSession(token: string): boolean {
  const session = sessions.get(token);
  if (!session) return false;
  if (Date.now() - session.createdAt > SESSION_TTL) {
    sessions.delete(token);
    return false;
  }
  return true;
}

export function destroySession(token: string): void {
  sessions.delete(token);
}
