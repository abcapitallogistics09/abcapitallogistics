import { randomBytes } from "crypto";

export interface SessionData {
  createdAt: number;
  username: string;
  role: string; // super_admin | admin | staff | custom
  permissions: string[]; // section keys
  userId: number | null; // null for super_admin (env-var based)
}

const sessions = new Map<string, SessionData>();
const SESSION_TTL = 24 * 60 * 60 * 1000;

function purgeExpired() {
  for (const [k, v] of sessions) {
    if (Date.now() - v.createdAt > SESSION_TTL) sessions.delete(k);
  }
}

export function createSession(data: Omit<SessionData, "createdAt">): string {
  purgeExpired();
  const token = randomBytes(32).toString("hex");
  sessions.set(token, { ...data, createdAt: Date.now() });
  return token;
}

/** Returns session data or null if missing/expired. */
export function getSession(token: string): SessionData | null {
  const session = sessions.get(token);
  if (!session) return null;
  if (Date.now() - session.createdAt > SESSION_TTL) {
    sessions.delete(token);
    return null;
  }
  return session;
}

/** Legacy boolean check — kept for backwards compatibility in other route files. */
export function validateSession(token: string): boolean {
  return getSession(token) !== null;
}

export function destroySession(token: string): void {
  sessions.delete(token);
}
